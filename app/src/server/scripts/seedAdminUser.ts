import type { PrismaClient } from '@prisma/client';
import { hash } from '@node-rs/bcrypt';
import { randomUUID } from 'crypto';

/**
 * Creates or updates an admin user when the project starts.
 * Uses ADMIN_EMAIL and ADMIN_PASSWORD environment variables from .env.server
 * 
 * If variables are not set, the function skips admin creation.
 */
export async function seedAdminUser(prismaClient: PrismaClient) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // If environment variables are not set, skip admin creation
  if (!adminEmail || !adminPassword) {
    console.log('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env.server. Skipping admin user creation.');
    return;
  }

  console.log(`🔐 Creating/updating admin user: ${adminEmail}`);

  try {
    // Check if user exists
    let user = await prismaClient.user.findUnique({
      where: { email: adminEmail },
    });

    // Hash the password
    const passwordHash = await hash(adminPassword, 10);

    if (user) {
      // User exists - update them
      console.log('📝 User exists, updating...');
      
      // Update admin privileges
      await prismaClient.user.update({
        where: { id: user.id },
        data: { isAdmin: true },
      });

      // Update or create Auth record
      let auth = await prismaClient.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM "Auth" WHERE "userId" = ${user.id} LIMIT 1
      `;

      if (!auth || auth.length === 0) {
        // Create Auth record
        const authId = randomUUID();
        await prismaClient.$executeRaw`
          INSERT INTO "Auth" (id, "userId") VALUES (${authId}, ${user.id})
        `;
        auth = [{ id: authId }];
      }

      const authId = auth[0].id;

      // Update or create AuthIdentity for email provider
      const existingIdentity = await prismaClient.$queryRaw<Array<{ providerData: string }>>`
        SELECT "providerData" FROM "AuthIdentity" 
        WHERE "authId" = ${authId} AND "providerName" = 'email' 
        LIMIT 1
      `;

      const providerData = {
        hashedPassword: passwordHash,
        isEmailVerified: true,
      };

      if (existingIdentity && existingIdentity.length > 0) {
        // Update existing record
        const currentData = JSON.parse(existingIdentity[0].providerData);
        await prismaClient.$executeRaw`
          UPDATE "AuthIdentity"
          SET "providerData" = ${JSON.stringify({ ...currentData, ...providerData })}
          WHERE "authId" = ${authId} AND "providerName" = 'email'
        `;
      } else {
        // Create new record
        await prismaClient.$executeRaw`
          INSERT INTO "AuthIdentity" ("providerName", "providerUserId", "providerData", "authId")
          VALUES ('email', ${adminEmail}, ${JSON.stringify(providerData)}, ${authId})
        `;
      }

      console.log(`✅ Admin user updated: ${adminEmail}`);
    } else {
      // Create new user
      console.log('✨ Creating new admin user...');
      
      const userId = randomUUID();
      const authId = randomUUID();

      // Create User
      user = await prismaClient.user.create({
        data: {
          id: userId,
          email: adminEmail,
          username: adminEmail,
          isAdmin: true,
          credits: 100, // Give admin more credits for testing
        },
      });

      // Create Auth record
      await prismaClient.$executeRaw`
        INSERT INTO "Auth" (id, "userId") VALUES (${authId}, ${userId})
      `;

      // Create AuthIdentity for email provider
      const providerData = {
        hashedPassword: passwordHash,
        isEmailVerified: true,
      };

      await prismaClient.$executeRaw`
        INSERT INTO "AuthIdentity" ("providerName", "providerUserId", "providerData", "authId")
        VALUES ('email', ${adminEmail}, ${JSON.stringify(providerData)}, ${authId})
      `;

      console.log(`✅ Admin user created: ${adminEmail}`);
      console.log(`🔑 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword} (use this to log in)`);
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

