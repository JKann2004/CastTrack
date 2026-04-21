import { bcrypt } from 'bcrypt';
import { PrismaClient, WaterbodyType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Seed Waterbodies (California) ──────────────────

  const waterbodies = [
    {
      name: "Big Bear Lake",
      type: WaterbodyType.LAKE,
      state: "CA",
      latitude: 34.2439,
      longitude: -116.9114,
      source: "curated",
    },
    {
      name: "Lake Perris",
      type: WaterbodyType.RESERVOIR,
      state: "CA",
      latitude: 33.8631,
      longitude: -117.1681,
      source: "curated",
    },
    {
      name: "Irvine Lake",
      type: WaterbodyType.LAKE,
      state: "CA",
      latitude: 33.7872,
      longitude: -117.7361,
      source: "curated",
    },
    {
      name: "Santa Ana River",
      type: WaterbodyType.RIVER,
      state: "CA",
      latitude: 33.8675,
      longitude: -117.7514,
      source: "curated",
    },
    {
      name: "Lake Castaic",
      type: WaterbodyType.RESERVOIR,
      state: "CA",
      latitude: 34.5308,
      longitude: -118.6106,
      source: "curated",
    },
    {
      name: "Diamond Valley Lake",
      type: WaterbodyType.RESERVOIR,
      state: "CA",
      latitude: 33.6942,
      longitude: -117.1792,
      source: "curated",
    },
    {
      name: "Lake Elsinore",
      type: WaterbodyType.LAKE,
      state: "CA",
      latitude: 33.668,
      longitude: -117.3473,
      source: "curated",
    },
    {
      name: "Puddingstone Reservoir",
      type: WaterbodyType.RESERVOIR,
      state: "CA",
      latitude: 34.0825,
      longitude: -117.7778,
      source: "curated",
    },
    {
      name: "Lake Tahoe",
      type: WaterbodyType.RESERVOIR,
      state: "CA",
      latitude: 39.0968,
      longitude: -120.032349,
      source: "curated",
    },
    {
      name: "Sacremento River",
      type: WaterbodyType.RIVER,
      state: "CA",
      latitude: 38.5816,
      longitude: -121.4944,
      source: "curated",
    },
  ];

  for (const wb of waterbodies) {
    await prisma.waterbody.upsert({
      where: {
        id: wb.name.toLowerCase().replace(/\s+/g, "-"),
      },
      update: {},
      create: wb,
    });
  }

  console.log(`Seeded ${waterbodies.length} waterbodies`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
