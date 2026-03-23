import * as fs from 'fs';
import * as path from 'path';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
});

import { createMeetingEvent } from '../lib/google-calendar';

async function test() {
  try {
    console.log("Testing Google Calendar...");
    const now = new Date();
    const event = await createMeetingEvent({
      guestName: "Test User",
      guestEmail: "simcallcz@gmail.com", // testing my own email
      startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // in 2 hours
      endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000), // in 3 hours
      description: "Tohle je automaticky vytvořená testovací schůzka pro SimCall."
    });
    
    console.log("Success! Event details:");
    console.log(event);
  } catch (e) {
    console.error("Failed:", e);
  }
}

test();
