import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";

// Define the auth client
function getAuthClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Because environment variables might replace newlines with literal "\n", we fix them
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY in environment variables");
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    // The scope required to create calendar events and meet links
    scopes: ["https://www.googleapis.com/auth/calendar.events"],
  });
}

interface CreateEventParams {
  name: string;
  email: string;
  meetingDate: string; // YYYY-MM-DD
  meetingTime: string; // HH:MM
}

/**
 * Creates a Google Calendar event with a Google Meet link.
 * Returns the generated Meet link.
 */
export async function createCalendarEvent({ name, email, meetingDate, meetingTime }: CreateEventParams): Promise<string> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error("Missing GOOGLE_CALENDAR_ID in environment variables");
  }

  const auth = getAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  // Parse start and end times (using Europe/Prague timezone)
  const [hoursStr, minutesStr] = meetingTime.split(":");
  
  // Format to standard ISO 8601 strings with timezone offset for Prague (+01:00 or +02:00)
  // To keep it simple and handles DST automatically via Google's timezone parameter
  const startDateTime = `${meetingDate}T${hoursStr.padStart(2, "0")}:${minutesStr.padStart(2, "0")}:00`;
  
  // End time is +30 minutes
  const startDateObj = new Date(1970, 0, 1, parseInt(hoursStr, 10), parseInt(minutesStr, 10));
  startDateObj.setMinutes(startDateObj.getMinutes() + 30);
  const endHours = String(startDateObj.getHours()).padStart(2, "0");
  const endMinutes = String(startDateObj.getMinutes()).padStart(2, "0");
  const endDateTime = `${meetingDate}T${endHours}:${endMinutes}:00`;

  // Provide a unique requestId so Google knows this is a unique conference
  const requestId = uuidv4();

  const response = await calendar.events.insert({
    calendarId,
    // conferenceDataVersion=1 is REQUIRED to process the conferenceData request
    conferenceDataVersion: 1,
    // sendUpdates="all" sends notifications to all attendees (so the client gets an email from Google)
    sendUpdates: "all",
    requestBody: {
      summary: `Schůzka SimCall - ${name}`,
      description: `Tato schůzka pro SimCall Enterprise byla úspěšně naplánována.\n\nKlient: ${name} (${email})`,
      start: {
        dateTime: startDateTime,
        timeZone: "Europe/Prague",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "Europe/Prague",
      },
      attendees: [
        { email },
        // Add the organizer so it appears well for them too, though implicitly they usually are added
        { email: calendarId }
      ],
      // This tells Google to generate a Meet link
      conferenceData: {
        createRequest: {
          requestId,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  const event = response.data;
  
  // Return the auto-generated meet link, or a fallback if it somehow failed
  const defaultMeetLink = "https://meet.google.com/";
  const meetLink = event.hangoutLink || defaultMeetLink;

  return meetLink;
}
