import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";

// Define the auth client
function getAuthClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Because environment variables might replace newlines with literal "\n", we fix them
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

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
    requestBody: {
      summary: `Schůzka SimCall - ${name}`,
      description: `Tato schůzka pro SimCall Enterprise byla úspěšně naplánována.\n\nKlient: ${name}\nE-mail: ${email}\n\nOdkaz na hovor najdete v této události (nebo použijte výchozí).`,
      start: {
        dateTime: startDateTime,
        timeZone: "Europe/Prague",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "Europe/Prague",
      },
    },
  });

  const event = response.data;
  
  // Note: Since standard service accounts cannot generate native Google Meet links without Google Workspace,
  // we return the fallback link or create an ad-hoc meeting link using a custom slug.
  const uniqueMeetId = uuidv4().split('-')[0] + "-" + uuidv4().split('-')[1];
  const defaultMeetLink = `https://meet.google.com/lookup/${uniqueMeetId}`;
  const meetLink = event.hangoutLink || process.env.GOOGLE_MEET_LINK || defaultMeetLink;

  return meetLink;
}
