import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

export class FavoriteService {
  /**
   * List all favorites for a user
   */
  async list(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        waterbody: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Add a waterbody to favorites
   */
  async add(userId: string, waterbodyId: string) {
    // Verify waterbody exists
    const wb = await prisma.waterbody.findUnique({ where: { id: waterbodyId } });
    if (!wb) throw new AppError("Waterbody not found", 404);

    // Check for duplicate
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_waterbodyId: { userId, waterbodyId },
      },
    });

    if (existing) {
      throw new AppError("Already in favorites", 409);
    }

    return prisma.favorite.create({
      data: { userId, waterbodyId },
      include: { waterbody: true },
    });
  }

  /**
   * Remove a waterbody from favorites
   */
  async remove(userId: string, waterbodyId: string) {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_waterbodyId: { userId, waterbodyId },
      },
    });

    if (!existing) {
      throw new AppError("Favorite not found", 404);
    }

    await prisma.favorite.delete({
      where: {
        userId_waterbodyId: { userId, waterbodyId },
      },
    });
  }
}

export const favoriteService = new FavoriteService();
