import cron from "node-cron";
import { reminderService } from "../services/reminder.service";

/**
 * Initialize all scheduled jobs.
 * Call this once from server.ts after the app starts.
 */
export function startCronJobs() {
  // Run license reminder check daily at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    console.log("[Cron] Running license reminder check...");
    try {
      await reminderService.processDueReminders();
    } catch (error) {
      console.error("[Cron] Reminder job failed:", error);
    }
  });

  console.log("[Cron] Scheduled jobs initialized");
}
