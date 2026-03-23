import { google } from "googleapis";

// Parse the private key properly if it contains stringified newlines
function getPrivateKey() {
  const key = process.env.GOOGLE_PRIVATE_KEY || "";
  return key.replace(/\\n/g, "\n");
}

export const getGoogleAuth = () => {
  const options: Record<string, any> = {
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: getPrivateKey(),
    },
    scopes: ["https://www.googleapis.com/auth/calendar"],
  };

  // If the user upgrades to Google Workspace, they can use domain-wide delegation
  // by specifying the email they want to impersonate.
  if (process.env.GOOGLE_WORKSPACE_EMAIL) {
    options.clientOptions = {
      subject: process.env.GOOGLE_WORKSPACE_EMAIL,
    };
  }

  return new google.auth.GoogleAuth(options);
};

export const createMeetingEvent = async ({
  guestName,
  guestEmail,
  startTime,
  endTime,
  description,
}: {
  guestName: string;
  guestEmail: string;
  startTime: Date;
  endTime: Date;
  description: string;
}) => {
  try {
    const auth = getGoogleAuth();
    // Use Workspace email if available, otherwise fallback to the service account string or legacy calendar ID
    const calendarId = process.env.GOOGLE_WORKSPACE_EMAIL || process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      throw new Error("Missing GOOGLE_WORKSPACE_EMAIL or GOOGLE_CALENDAR_ID in .env");
    }

    const calendar = google.calendar({ version: "v3", auth });

    const meetLink = process.env.STATIC_MEET_LINK || "https://meet.google.com/xxx-xxxx-xxx";

    const event = {
      summary: `Schůzka s ${guestName} (SimCall)`,
      description: `${description}\n\nOdkaz na videohovor (Google Meet): ${meetLink}`,
      location: meetLink,
      start: {
        dateTime: startTime.toISOString(),
      },
      end: {
        dateTime: endTime.toISOString(),
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      sendUpdates: "none", // We will send our own custom Resend email instead of the generic Google one
      requestBody: event,
    });

    const eventData = response.data;

    return {
      eventId: eventData.id,
      meetLink: meetLink,
      htmlLink: eventData.htmlLink,
    };
  } catch (error) {
    console.error("[google-calendar] Failed to create event:", error);
    throw error;
  }
};

