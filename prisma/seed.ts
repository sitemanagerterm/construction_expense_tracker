import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Database...')

  // Create Super Admin Tenant (Required because User belongs to Tenant)
  const saTenant = await prisma.tenant.upsert({
    where: { id: 'super-admin-tenant' },
    update: {},
    create: {
      id: 'super-admin-tenant',
      name: 'System Admin',
      subscriptionTier: 'ACTIVE',
    },
  })

  // Create Super Admin User
  const saEmail = 'admin@mysitebook.com'
  const saPassword = await bcrypt.hash('supersecret123', 10)

  const superAdmin = await prisma.user.upsert({
    where: { email: saEmail },
    update: {},
    create: {
      email: saEmail,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      tenantId: saTenant.id,
    },
  })

  console.log('Super Admin Created:', superAdmin.email)

  // You would ideally handle password seeding securely or via OAuth
  // Since we are using NextAuth OAuth by default in the schema (no password field), 
  // We'll just seed the record. The admin will log in via the matching OAuth provider.
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
