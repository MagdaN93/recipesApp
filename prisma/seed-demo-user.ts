import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../app/lib/prisma";
import { DEMO_EMAIL, DEMO_PASSWORD } from "../app/auth/demo";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { passwordHash, role: "viewer" },
    create: { email: DEMO_EMAIL, passwordHash, role: "viewer" },
  });

  console.log(`Demo user ready: ${DEMO_EMAIL}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
