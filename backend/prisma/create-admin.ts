import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [email, password, displayNameArg] = process.argv.slice(2);

  if (!email || !password) {
    console.error(
      "Usage: npm run create-admin -- <email> <password> [displayName]"
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const displayName = displayNameArg || null;

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "ADMIN",
      displayName: displayName ?? undefined,
    },
    create: {
      email,
      passwordHash,
      role: "ADMIN",
      displayName,
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      createdAt: true,
    },
  });

  console.log("Admin account ready:");
  console.log(JSON.stringify(user, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
