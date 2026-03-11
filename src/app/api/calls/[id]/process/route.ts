import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

// Allow up to 60s on Vercel Hobby (default is 10s which causes audio upload to fail)
export const maxDuration = 60;

/**
 * POST /api/calls/[id]/process
 *
 * Server-side post-call processing:
 * 1. Fetch conversation transcript from ElevenLabs API
 * 2. Send transcript to OpenAI (GPT-4o) for analysis
 * 3. Store transcript rows in Supabase
 * 4. Store feedback/scoring in Supabase
 * 5. Update call status to "completed"
 *
 * This replaces the fragile n8n webhook-based processing.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createServerClient();

  // 1. Get the call record
  const { data: call, error: callError } = await supabase
    .from("calls")
    .select("*")
    .eq("id", id)
    .single();

  if (callError || !call) {
    return NextResponse.json({ error: "Call not found" }, { status: 404 });
  }

  if (!call.conversation_id) {
    return NextResponse.json(
      { error: "No conversation_id on this call" },
      { status: 400 }
    );
  }

  try {
    // 2a. Look up scenario difficulty for dynamic evaluation prompt
    let evaluationPrompt = "";
    if (call.scenario_id) {
      const { data: scenario } = await supabase
        .from("scenarios")
        .select("difficulty")
        .eq("id", call.scenario_id)
        .single();

      const difficultyMap: Record<string, string> = {
        easy: "hot_lead_1_3.txt",
        medium: "warm_lead_4_6.txt",
        hard: "cold_lead_7_10.txt",
      };
      const promptFile = difficultyMap[scenario?.difficulty || "medium"] || "warm_lead_4_6.txt";

      try {
        const promptPath = path.join(process.cwd(), "src", "lib", "prompts", "evaluation", promptFile);
        evaluationPrompt = await fs.readFile(promptPath, "utf-8");
        console.log(`Using evaluation prompt: ${promptFile}`);
      } catch {
        console.warn(`Could not load prompt file ${promptFile}, using default criteria`);
      }
    }

    // 2b. Fetch conversation from ElevenLabs API (with retries)
    // After a call ends there can be a short delay before data is available
    let conversationData: ElevenLabsConversation | null = null;

    for (let attempt = 0; attempt < 6; attempt++) {
      if (attempt > 0) {
        // Wait progressively longer: 2s, 4s, 6s, 8s, 10s
        await new Promise((r) => setTimeout(r, (attempt + 1) * 2000));
      }

      const elResponse = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations/${call.conversation_id}`,
        {
          headers: {
            "xi-api-key": process.env.ELEVENLABS_API_KEY!,
          },
        }
      );

      if (elResponse.ok) {
        const data = await elResponse.json();
        if (data.transcript && data.transcript.length > 0) {
          conversationData = data;
          break;
        }
        // Transcript might not be ready yet, retry
        if (attempt < 5) continue;
        // Last attempt - accept even empty transcript
        conversationData = data;
      } else {
        console.error(
          `ElevenLabs API attempt ${attempt + 1} failed:`,
          elResponse.status
        );
      }
    }

    if (!conversationData) {
      await supabase
        .from("calls")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", id);
      return NextResponse.json(
        { error: "Could not fetch conversation from ElevenLabs" },
        { status: 502 }
      );
    }

    const transcript: ElevenLabsTranscriptEntry[] =
      conversationData.transcript || [];
    const elMetadata = conversationData.metadata || {};

    // 3. Format transcript as readable text for ChatGPT
    let transcriptText = "";
    transcript.forEach((entry) => {
      const role =
        entry.role === "agent" ? "KLIENT (AI)" : "MAKLER (Uzivatel)";
      transcriptText += `${role}: ${entry.message}\n\n`;
    });

    // 4. Call OpenAI for analysis
    let analysis: CallAnalysis | null = null;

    if (process.env.OPENAI_API_KEY && transcriptText.trim().length > 20) {
      try {
        const openaiResponse = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4o",
              temperature: 0.3,
              max_tokens: 2000,
              messages: [
                {
                  role: "system",
                  content: [
                    'Jsi expert na hodnoceni obchodnich hovoru v oblasti realitniho trhu v Ceske republice.',
                    'Mas hlubokou znalost ceskeho prava, smluvnich procesu a specifik realitniho trhu v CR.',
                    '',
                    'TVOJE ZNALOSTI ZAHRNUJI:',
                    '- Kompletni proces prodeje nemovitosti v CR: nabidka → prohlídka → rezervacni smlouva → blokacni depozit na vazanem uctu → kupni smlouva → navrh na vklad do katastru nemovitosti → predani nemovitosti.',
                    '- Exkluzivni vs. neexkluzivni zprostredkovatelska smlouva — vyhody exkluzivity pro klienta (aktivni marketing, vyssi nasazeni, jedna kontaktni osoba).',
                    '- Provizni system — jak vysvetlit a obhajit provizi maklere (typicky 3-5% z prodejni ceny).',
                    '- Pravni nuance: vecna bremena, predkupni prava, zapisy v katastru nemovitosti, list vlastnictvi.',
                    '- Rezervacni smlouva vs. smlouva o smlouve budouci — rozdily a kdy co pouzit.',
                    '- Uschova kupni ceny — advokátní/notarska/bankovni uschova, proc nikdy neprevadej primo.',
                    '- Dan z nabytí nemovitosti a dan z prijmu pri prodeji.',
                    '',
                    'POKROCILE SITUACE, KTERE ZNAS:',
                    '- Developerske projekty a prodej celych bytovych domu.',
                    '- Vyplaceni exekuce klienta a komplikovane zastavy na nemovitosti.',
                    '- Stavba bez stavebniho povoleni — jak to resit s kupcem a jake jsou rizika.',
                    '- Najemnik odmita odejit — prodej obsazene nemovitosti, prava najemce.',
                    '- Dedicke spory a prodej nemovitosti s vice vlastniky (podilove spoluvlastnictvi).',
                    '- Rozvod a vyporadani SJM (spolecneho jmeni manzelu) pri prodeji.',
                    '- Prodej nemovitosti v insolvenci.',
                    '- Kupujici bez hypoteky vs. s hypotekou — rozdily v procesu.',
                    '',
                    'PRAVIDLA HODNOCENI:',
                    '- Pokud makler rekne neco pravne SPATNE (napr. spatny proces, spatna informace o smlouve, dani, katastru), VZDY to oznac jako "mistake" v transcript_highlights a VZDY to zmin v "improvements".',
                    '- Pokud makler spravne vysvetli pravni proces nebo smluvni postup, oznac to jako "good".',
                    '- Hodnotis nejen prodejni dovednosti, ale i ODBORNOU SPRAVNOST informaci, ktere makler klientovi sdeluje.',
                    '',
                    'Analyzuj treninkovy hovor mezi realitnim maklerem a AI klientem.',
                    'Odpovidej VZDY v cestine. Odpovidej POUZE ve formatu JSON bez markdown bloku.',
                  ].join('\n'),
                },
                {
                  role: "user",
                  content: `Analyzuj nasledujici treninkovy hovor realitniho maklere.\n\nPREPIS HOVORU:\n${transcriptText}\n\nVrat POUZE validni JSON (bez \`\`\`json bloku) v tomto formatu:\n{\n  "overall_score": <cislo 0-100>,\n  "strengths": ["silna stranka 1", "silna stranka 2"],\n  "improvements": ["oblast ke zlepseni 1", "oblast ke zlepseni 2"],\n  "filler_words": [{"word": "ehm", "count": 2}],\n  "recommendations": ["doporuceni 1", "doporuceni 2"],\n  "transcript_highlights": [\n    {"index": 0, "highlight": null},\n    {"index": 1, "highlight": "good"},\n    {"index": 2, "highlight": "mistake"}\n  ]\n}\n\n${evaluationPrompt ? `SPECIFICKA HODNOTICI KRITERIA PRO TENTO TYP HOVORU:\n${evaluationPrompt}` : `Hodnotici kriteria:\n1. Profesionalni predstaveni a navazani kontaktu (0-10 bodu)\n2. Zjistovani potreb klienta (0-15 bodu)\n3. Prezentace hodnoty sluzeb a obhajoba provize (0-15 bodu)\n4. ODBORNA SPRAVNOST — zna makler spravny pravni postup, smluvni proces, dane? (0-25 bodu)\n5. Prace s namitkami a obtizne situace (0-15 bodu)\n6. Uzavreni / domluveni dalsiho kroku (0-10 bodu)\n7. Komunikacni dovednosti (0-10 bodu) - plynulost, vyplnova slova, ton`}\n\nDULEZITE: Pokud makler sdeli klientovi SPATNOU pravni nebo procesni informaci (napr. nespravny postup u katastru, spatne vysvetleni uschovy, rezervacni smlouvy ci dani), VZDY sniz skore a jasne to popis v improvements a recommendations.`,
                },
              ],
            }),
          }
        );

        if (openaiResponse.ok) {
          const data = await openaiResponse.json();
          const content = data.choices?.[0]?.message?.content || "";
          try {
            const cleaned = content
              .replace(/```json\n?/g, "")
              .replace(/```\n?/g, "")
              .trim();
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            analysis = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
          } catch (parseErr) {
            console.error("Failed to parse ChatGPT JSON:", parseErr);
          }
        } else {
          console.error("OpenAI API error:", openaiResponse.status);
        }
      } catch (aiErr) {
        console.error("OpenAI call failed:", aiErr);
      }
    }

    // 5. Fallback analysis if ChatGPT failed or no API key
    if (!analysis) {
      analysis = {
        overall_score: 50,
        strengths: ["Hovor byl dokoncen"],
        improvements: [
          "Pro detailni analyzu pridejte OPENAI_API_KEY do .env.local",
        ],
        filler_words: [],
        recommendations: [
          "Zkuste hovor znovu pro detailnejsi zpetnou vazbu",
        ],
        transcript_highlights: [],
      };
    }

    // 6. Clean up old data (in case of re-processing)
    await supabase.from("transcripts").delete().eq("call_id", id);
    await supabase.from("feedback").delete().eq("call_id", id);

    // 7. Store transcript rows in Supabase
    const transcriptRows = transcript.map(
      (entry: ElevenLabsTranscriptEntry, index: number) => {
        const time = entry.time_in_call_secs || index * 8;
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);

        const highlightEntry = analysis!.transcript_highlights?.find(
          (h: TranscriptHighlight) => h.index === index
        );

        return {
          call_id: id,
          speaker: entry.role === "agent" ? "ai" : "user",
          text: entry.message || "",
          timestamp_label: `${mins}:${secs.toString().padStart(2, "0")}`,
          highlight: highlightEntry?.highlight || null,
          sort_order: index,
        };
      }
    );

    if (transcriptRows.length > 0) {
      const { error: transcriptError } = await supabase
        .from("transcripts")
        .insert(transcriptRows);
      if (transcriptError) {
        console.error("Failed to store transcript:", transcriptError);
      }
    }

    // 8. Store feedback in Supabase
    const { error: feedbackError } = await supabase.from("feedback").insert({
      call_id: id,
      overall_score: analysis.overall_score,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      filler_words: analysis.filler_words,
      recommendations: analysis.recommendations,
    });
    if (feedbackError) {
      console.error("Failed to store feedback:", feedbackError);
    }

    // 9. Download and store audio recording from ElevenLabs
    // Audio recording is a TEAM-only feature (team, team_manager, admin)
    let audioUrl: string | null = null;

    // Check user's role — audio only for team roles
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = userProfile?.role || "free";
    const canDownloadAudio = ["team", "team_manager", "admin"].includes(userRole);

    if (canDownloadAudio) {
      try {
        // Audio may not be immediately available, retry a few times
        for (let audioAttempt = 0; audioAttempt < 3; audioAttempt++) {
          if (audioAttempt > 0) {
            await new Promise((r) => setTimeout(r, 3000)); // wait 3s between retries
          }

          const audioResponse = await fetch(
            `https://api.elevenlabs.io/v1/convai/conversations/${call.conversation_id}/audio`,
            {
              headers: {
                "xi-api-key": process.env.ELEVENLABS_API_KEY!,
              },
            }
          );

          if (audioResponse.ok) {
            const audioBuffer = await audioResponse.arrayBuffer();

            // Verify we got actual audio data (not empty)
            if (audioBuffer.byteLength > 1000) {
              const fileName = `${id}.mp3`;

              const { error: uploadError } = await supabase.storage
                .from("call-recordings")
                .upload(fileName, audioBuffer, {
                  contentType: "audio/mpeg",
                  upsert: true,
                });

              if (!uploadError) {
                const { data: urlData } = supabase.storage
                  .from("call-recordings")
                  .getPublicUrl(fileName);
                audioUrl = urlData.publicUrl;
                console.log("Audio uploaded successfully:", audioUrl);
              } else {
                console.error("Failed to upload audio:", uploadError);
              }
              break; // Success, stop retrying
            } else {
              console.log(`Audio attempt ${audioAttempt + 1}: too small (${audioBuffer.byteLength} bytes), retrying...`);
            }
          } else {
            console.log(`Audio attempt ${audioAttempt + 1}: HTTP ${audioResponse.status}, retrying...`);
          }
        }
      } catch (audioErr) {
        console.error("Failed to download audio:", audioErr);
      }
    }

    // 10. Update call status to completed
    const durationSeconds =
      elMetadata.call_duration_secs || call.duration_seconds || 0;

    const { error: updateError } = await supabase
      .from("calls")
      .update({
        status: "completed",
        success_rate: analysis.overall_score,
        duration_seconds: Math.round(durationSeconds),
        audio_url: audioUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Failed to update call status:", updateError);
    }

    return NextResponse.json({
      success: true,
      overall_score: analysis.overall_score,
      transcript_count: transcript.length,
      duration_seconds: Math.round(durationSeconds),
      audio_url: audioUrl,
    });
  } catch (err) {
    console.error("Process call error:", err);
    await supabase
      .from("calls")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("id", id);
    return NextResponse.json(
      { error: "Processing failed" },
      { status: 500 }
    );
  }
}

// Type definitions for ElevenLabs API response
interface ElevenLabsTranscriptEntry {
  role: "agent" | "user";
  message: string;
  time_in_call_secs?: number;
}

interface ElevenLabsConversation {
  conversation_id: string;
  status: string;
  transcript: ElevenLabsTranscriptEntry[];
  has_audio?: boolean;
  has_user_audio?: boolean;
  has_response_audio?: boolean;
  metadata?: {
    call_duration_secs?: number;
    start_time_unix_secs?: number;
  };
  analysis?: Record<string, unknown>;
}

interface TranscriptHighlight {
  index: number;
  highlight: "good" | "mistake" | null;
}

interface CallAnalysis {
  overall_score: number;
  strengths: string[];
  improvements: string[];
  filler_words: { word: string; count: number }[];
  recommendations: string[];
  transcript_highlights?: TranscriptHighlight[];
}
