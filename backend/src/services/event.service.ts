import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { EventCategory } from "@prisma/client";

export class EventService {
  /**
   * List events for a waterbody or region
   */
  async list(waterbodyId?: string, region?: string, includeExpired = false) {
    const where: any = {};

    if (waterbodyId) where.waterbodyId = waterbodyId;
    if (region) where.region = { contains: region, mode: "insensitive" };

    // By default, only show current/future events
    if (!includeExpired) {
      where.OR = [
        { endDate: null },
        { endDate: { gte: new Date() } },
      ];
    }

    return prisma.event.findMany({
      where,
      orderBy: { startDate: "asc" },
      include: {
        creator: {
          select: { id: true, displayName: true },
        },
      },
    });
  }

  /**
   * Create an event (admin/moderator)
   */
  async create(
    userId: string,
    data: {
      waterbodyId?: string;
      region?: string;
      category: EventCategory;
      title: string;
      description: string;
      startDate: Date;
      endDate?: Date;
      sourceUrl?: string;
    }
  ) {
    return prisma.event.create({
      data: {
        ...data,
        createdBy: userId,
      },
    });
  }

  /**
   * Update an event
   */
  async update(eventId: string, data: Partial<{
    category: EventCategory;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    sourceUrl: string;
  }>) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new AppError("Event not found", 404);

    return prisma.event.update({
      where: { id: eventId },
      data,
    });
  }

  /**
   * Delete an event
   */
  async delete(eventId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new AppError("Event not found", 404);

    await prisma.event.delete({ where: { id: eventId } });
  }
}

export const eventService = new EventService();
