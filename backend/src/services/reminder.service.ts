import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { sendEmail } from "../utils/email";

export class ReminderService {
  /**
   * Get all reminders for a user
   */
  async list(userId: string) {
    return prisma.reminder.findMany({
      where: { userId },
      orderBy: { licenseExpiration: "asc" },
    });
  }

  /**
   * Create a license reminder
   */
  async create(
    userId: string,
    data: {
      state: string;
      licenseExpiration: Date;
      remindDaysBefore: number;
    }
  ) {
    return prisma.reminder.create({
      data: {
        userId,
        state: data.state.toUpperCase(),
        licenseExpiration: data.licenseExpiration,
        remindDaysBefore: data.remindDaysBefore,
      },
    });
  }

  /**
   * Update a reminder (toggle enabled, change schedule)
   */
  async update(
    reminderId: string,
    userId: string,
    data: Partial<{
      state: string;
      licenseExpiration: Date;
      remindDaysBefore: number;
      enabled: boolean;
    }>
  ) {
    const reminder = await prisma.reminder.findUnique({ where: { id: reminderId } });
    if (!reminder) throw new AppError("Reminder not found", 404);
    if (reminder.userId !== userId) throw new AppError("Not authorized", 403);

    return prisma.reminder.update({
      where: { id: reminderId },
      data,
    });
  }

  /**
   * Delete a reminder
   */
  async delete(reminderId: string, userId: string) {
    const reminder = await prisma.reminder.findUnique({ where: { id: reminderId } });
    if (!reminder) throw new AppError("Reminder not found", 404);
    if (reminder.userId !== userId) throw new AppError("Not authorized", 403);

    await prisma.reminder.delete({ where: { id: reminderId } });
  }

  /**
   * Called by cron job — find due reminders and send emails.
   * Idempotent: skips reminders already sent today.
   */
  async processDueReminders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find enabled reminders where:
    // licenseExpiration - remindDaysBefore <= today
    // AND we haven't already sent today
    const reminders = await prisma.reminder.findMany({
      where: {
        enabled: true,
        lastSentAt: {
          // Either never sent, or last sent before today
          lt: today,
        },
      },
      include: {
        user: { select: { email: true, displayName: true } },
      },
    });

    // Also get ones that were never sent
    const neverSent = await prisma.reminder.findMany({
      where: {
        enabled: true,
        lastSentAt: null,
      },
      include: {
        user: { select: { email: true, displayName: true } },
      },
    });

    const allDue = [...reminders, ...neverSent];
    let sentCount = 0;

    for (const reminder of allDue) {
      const expirationDate = new Date(reminder.licenseExpiration);
      const triggerDate = new Date(expirationDate);
      triggerDate.setDate(triggerDate.getDate() - reminder.remindDaysBefore);

      if (today >= triggerDate && today <= expirationDate) {
        const daysLeft = Math.ceil(
          (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        await sendEmail({
          to: reminder.user.email,
          subject: `CastTrack: Your ${reminder.state} fishing license expires in ${daysLeft} days`,
          text: `Hi ${reminder.user.displayName || "angler"},\n\nYour ${reminder.state} fishing license expires on ${expirationDate.toLocaleDateString()}. That's ${daysLeft} day(s) from now.\n\nDon't forget to renew before your next trip!\n\n— CastTrack\n\nNote: This is a convenience reminder. You are responsible for maintaining a valid license.`,
        });

        await prisma.reminder.update({
          where: { id: reminder.id },
          data: { lastSentAt: new Date() },
        });

        sentCount++;
      }
    }

    console.log(`[Reminder Cron] Processed ${allDue.length} reminders, sent ${sentCount} emails`);
  }
}

export const reminderService = new ReminderService();
