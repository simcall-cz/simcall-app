"use client";

import { Phone, TrendingUp, Calendar, Star, Lock, Award, Flame, Target, Shield, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { agentProfile } from "@/data/dashboard/agent-stats";
import { achievements } from "@/data/dashboard/achievements";
import type { Achievement } from "@/types/dashboard";

const iconMap: Record<string, React.ElementType> = {
  Phone,
  Flame,
  Target,
  Shield,
  Award,
  Star,
  Crown,
  Handshake: Award,
};

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const Icon = iconMap[achievement.icon] || Star;
  const earned = achievement.earned;

  return (
    <Card className={`relative transition-all ${earned ? "hover:shadow-lg" : "opacity-50"}`}>
      <CardContent className="p-6 text-center">
        {!earned && (
          <div className="absolute top-3 right-3">
            <Lock className="h-4 w-4 text-neutral-300" />
          </div>
        )}
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
            earned ? "bg-primary-50 text-primary-500" : "bg-neutral-100 text-neutral-300"
          }`}
        >
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="font-semibold text-neutral-800">{achievement.title}</h3>
        <p className="mt-1 text-sm text-neutral-500">{achievement.description}</p>
        {earned && achievement.earnedDate && (
          <Badge variant="success" className="mt-3">
            {new Date(achievement.earnedDate).toLocaleDateString("cs-CZ")}
          </Badge>
        )}
        {!earned && (
          <Badge variant="secondary" className="mt-3">
            Zamčeno
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

export default function ProfilPage() {
  const memberSinceDate = new Date(agentProfile.memberSince).toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-neutral-800">Profil</h1>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-5 sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-full bg-primary-500 text-2xl sm:text-3xl font-bold text-white">
              {agentProfile.avatarInitials}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left w-full">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">{agentProfile.name}</h2>
              <p className="text-sm sm:text-base text-neutral-500">{agentProfile.email}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:gap-2 sm:justify-start">
                <Badge>{agentProfile.role}</Badge>
                <Badge variant="secondary">{agentProfile.company}</Badge>
                <Badge variant="outline" className="text-xs">{`Člen od ${memberSinceDate}`}</Badge>
              </div>

              {/* Stats */}
              <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4 rounded-xl bg-neutral-50 p-3 sm:p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-neutral-500">
                    <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                    <span>Hovory</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-neutral-800">{agentProfile.totalCalls}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-neutral-500">
                    <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                    <span>Úspěšnost</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-primary-500">{agentProfile.avgSuccessRate}%</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-neutral-500">
                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                    <span>Týden</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-neutral-800">{agentProfile.callsThisWeek}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings (mock) */}
      <Card>
        <CardHeader>
          <CardTitle>Nastavení</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Jméno</label>
              <input
                type="text"
                disabled
                value={agentProfile.name}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">E-mail</label>
              <input
                type="email"
                disabled
                value={agentProfile.email}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Společnost</label>
              <input
                type="text"
                disabled
                value={agentProfile.company}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Role</label>
              <input
                type="text"
                disabled
                value={agentProfile.role}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-500"
              />
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-6">
            <h3 className="mb-4 font-semibold text-neutral-800">Notifikace</h3>
            <div className="space-y-4">
              {[
                { label: "E-mailové notifikace", desc: "Dostávejte souhrn tréninku e-mailem", checked: true },
                { label: "Týdenní report", desc: "Souhrn výkonu každý pátek", checked: true },
                { label: "Tipy ke zlepšení", desc: "AI doporučení na základě vašich hovorů", checked: false },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between gap-4 rounded-lg border border-neutral-100 p-3 sm:p-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base text-neutral-800">{pref.label}</p>
                    <p className="text-xs sm:text-sm text-neutral-500 truncate">{pref.desc}</p>
                  </div>
                  <div
                    className={`h-6 w-11 rounded-full transition-colors ${
                      pref.checked ? "bg-primary-500" : "bg-neutral-200"
                    } relative cursor-pointer`}
                  >
                    <div
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        pref.checked ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Uložit změny</Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <div>
        <h2 className="mb-6 text-xl font-bold text-neutral-800">
          Vaše úspěchy{" "}
          <span className="text-sm font-normal text-neutral-400">
            ({achievements.filter((a) => a.earned).length}/{achievements.length})
          </span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
}
