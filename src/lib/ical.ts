import { v4 as uuidv4 } from "uuid";

interface IcsEventParams {
  uid?: string;
  summary: string;
  description: string;
  location?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes?: number;
  organizerEmail: string;
  organizerName: string;
  attendeeEmail: string;
  attendeeName: string;
}

/**
 * Formats a given date/time string to iCalendar date-time format in UTC.
 */
function formatIcsDateTime(dateStr: string, timeStr: string): string {
  // Parsing assuming Europe/Prague as input context (which is UTC+1 or UTC+2).
  // NextJS runs on Node, so we explicitly create a Date and convert to UTC string.
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  
  // Since we want to ensure exact times, a safe approach for basic ICS is 
  // to output localtime but with correct timezone ID. Better yet, standard ICS UTC format:
  const d = new Date(`${dateStr}T${timeStr}:00+01:00`); // Assuming CET/CEST rough fallback, but let's just use Z if we convert.
  
  // Actually, standard ICS prefers TZID for local times.
  // For absolute simplicity without a full tz database, outputting floating time or Z is tricky.
  // Let's use standard local time with TZID.
  return `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}00`;
}

/**
 * Generates an iCalendar (ICS) string for an event.
 */
export function generateIcs({
  uid = uuidv4(),
  summary,
  description,
  location = "",
  date,
  time,
  durationMinutes = 30,
  organizerEmail,
  organizerName,
  attendeeEmail,
  attendeeName,
}: IcsEventParams): string {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  const startTz = `TZID=Europe/Prague:${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}00`;

  // Calculate end time
  const d = new Date(year, month - 1, day, hours, minutes);
  d.setMinutes(d.getMinutes() + durationMinutes);
  const endYear = d.getFullYear();
  const endMonth = String(d.getMonth() + 1).padStart(2, "0");
  const endDay = String(d.getDate()).padStart(2, "0");
  const endHours = String(d.getHours()).padStart(2, "0");
  const endMinutes = String(d.getMinutes()).padStart(2, "0");

  const endTz = `TZID=Europe/Prague:${endYear}${endMonth}${endDay}T${endHours}${endMinutes}00`;

  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  
  // Formatting description to escape newlines
  const formattedDescription = description.replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SimCall//NONSGML Enterprise//CS",
    "METHOD:REQUEST", // Essential to display as an invite in email clients
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;${startTz}`,
    `DTEND;${endTz}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${formattedDescription}`,
    `LOCATION:${location}`,
    `ORGANIZER;CN="${organizerName}":mailto:${organizerEmail}`,
    `ATTENDEE;RSVP=TRUE;CN="${attendeeName}":mailto:${attendeeEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT10M",
    "DESCRIPTION:Připomenutí schůzky",
    "ACTION:DISPLAY",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
