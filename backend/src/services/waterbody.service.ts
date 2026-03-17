import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

export class WaterbodyService {
  /**
   * Search waterbodies by name, state, or type
   */
  async search(query?: string, state?: string, type?: string, page = 1, limit = 20) {
    const where: any = {};

    if (query) {
      where.name = { contains: query, mode: "insensitive" };
    }
    if (state) {
      where.state = state.toUpperCase();
    }
    if (type) {
      where.type = type.toUpperCase();
    }

    const [waterbodies, total] = await Promise.all([
      prisma.waterbody.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.waterbody.count({ where }),
    ]);

    return {
      data: waterbodies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single waterbody by ID
   */
  async getById(id: string) {
    const waterbody = await prisma.waterbody.findUnique({
      where: { id },
    });

    if (!waterbody) {
      throw new AppError("Waterbody not found", 404);
    }

    return waterbody;
  }
}

export const waterbodyService = new WaterbodyService();
