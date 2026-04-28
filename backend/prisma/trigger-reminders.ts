// One-off script that runs the reminder cron job immediately.
// Useful for demo prep and for verifying that SMTP is wired up correctly
// without waiting until 8 AM.
//
// Usage: npm run trigger-reminders
//
// Sends emails for any reminder where today is between
// (licenseExpiration - remindDaysBefore) and licenseExpiration,
// and that has not already been sent today.

import { reminderService } from "../src/services/reminder.service";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Running reminder check...");
  await reminderService.processDueReminders();
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
