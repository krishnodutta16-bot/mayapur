import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email1 = process.env.ALLOWED_EMAIL_1?.trim().toLowerCase();
  const email2 = process.env.ALLOWED_EMAIL_2?.trim().toLowerCase();
  const name1 = process.env.PARTNER_1_NAME?.trim() || "Partner one";
  const name2 = process.env.PARTNER_2_NAME?.trim() || "Partner two";
  const pass1 = process.env.PARTNER_1_PASSWORD;
  const pass2 = process.env.PARTNER_2_PASSWORD;

  if (!email1 || !email2 || !pass1 || !pass2) {
    throw new Error("Set ALLOWED_EMAIL_1, ALLOWED_EMAIL_2, PARTNER_1_PASSWORD, PARTNER_2_PASSWORD in .env");
  }
  if (email1 === email2) {
    throw new Error("The two allowed emails must be different.");
  }

  const hash1 = await bcrypt.hash(pass1, 12);
  const hash2 = await bcrypt.hash(pass2, 12);

  await prisma.user.upsert({
    where: { email: email1 },
    update: { name: name1, passwordHash: hash1 },
    create: { email: email1, name: name1, passwordHash: hash1 },
  });
  await prisma.user.upsert({
    where: { email: email2 },
    update: { name: name2, passwordHash: hash2 },
    create: { email: email2, name: name2, passwordHash: hash2 },
  });

  await prisma.user.deleteMany({
    where: { email: { notIn: [email1, email2] } },
  });

  const together = process.env.TOGETHER_SINCE || "2024-02-14";
  await prisma.setting.upsert({
    where: { id: "couple" },
    update: { togetherSince: new Date(together) },
    create: { id: "couple", togetherSince: new Date(together) },
  });

  console.log("Seeded two private accounts and couple settings.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
