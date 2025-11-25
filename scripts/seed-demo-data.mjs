import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo user (no password - use Supabase auth)
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@astracommerce.com" },
    update: {},
    create: {
      email: "demo@astracommerce.com",
      name: "Demo User",
      emailVerified: true,
    },
  });
  console.log("✅ Demo user created:", demoUser.email);

  // Create ACME Commerce organization
  const acmeOrg = await prisma.organization.upsert({
    where: { slug: "acme-commerce" },
    update: {},
    create: {
      name: "ACME Commerce",
      slug: "acme-commerce",
      ownerId: demoUser.id,
      plan: "enterprise",
      planStatus: "active",
    },
  });
  console.log("✅ Organization created:", acmeOrg.name);

  // Create membership
  await prisma.membership.upsert({
    where: {
      orgId_userId: {
        orgId: acmeOrg.id,
        userId: demoUser.id,
      },
    },
    update: {},
    create: {
      orgId: acmeOrg.id,
      userId: demoUser.id,
      role: "owner",
    },
  });
  console.log("✅ Membership created");

  // Create super admin if env vars are set
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (superAdminEmail && superAdminPassword) {
    const superAdmin = await prisma.user.upsert({
      where: { email: superAdminEmail },
      update: {},
      create: {
        email: superAdminEmail,
        name: "Super Admin",
        emailVerified: true,
      },
    });
    console.log("✅ Super admin created:", superAdmin.email);

    // Create super admin org
    const superAdminOrg = await prisma.organization.upsert({
      where: { slug: "super-admin" },
      update: {},
      create: {
        name: "Super Admin Workspace",
        slug: "super-admin",
        ownerId: superAdmin.id,
        plan: "enterprise",
        planStatus: "active",
      },
    });
    console.log("✅ Super admin organization created");

    // Create super admin membership
    await prisma.membership.upsert({
      where: {
        orgId_userId: {
          orgId: superAdminOrg.id,
          userId: superAdmin.id,
        },
      },
      update: {},
      create: {
        orgId: superAdminOrg.id,
        userId: superAdmin.id,
        role: "owner",
      },
    });
    console.log("✅ Super admin membership created");
  }

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
