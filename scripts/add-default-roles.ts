import { prisma } from '../src/lib/prisma';

const DEFAULT_ROLES = [
  {
    name: 'Basic Control',
    description: 'Can view projects and add expenses, but cannot edit or delete.',
    permissions: JSON.stringify([
      'project.view',
      'expense.view',
      'expense.add',
      'credit.view',
      'party.view'
    ]),
    isDefault: true
  },
  {
    name: 'Advanced Control',
    description: 'Can view and add all records, plus edit existing expenses and credits.',
    permissions: JSON.stringify([
      'project.view',
      'expense.view',
      'expense.add',
      'expense.edit',
      'credit.view',
      'credit.add',
      'credit.edit',
      'party.view',
      'party.add',
      'party.edit'
    ]),
    isDefault: true
  },
  {
    name: 'Full Control',
    description: 'Has full access to all modules including deletion, staff, and settings.',
    permissions: JSON.stringify([
      'project.view',
      'project.add',
      'project.edit',
      'project.delete',
      'expense.view',
      'expense.add',
      'expense.edit',
      'expense.delete',
      'credit.view',
      'credit.add',
      'credit.edit',
      'credit.delete',
      'party.view',
      'party.add',
      'party.edit',
      'party.delete',
      'staff.view',
      'staff.add',
      'staff.edit',
      'staff.delete',
      'audit_log.view',
      'settings.view',
      'settings.edit'
    ]),
    isDefault: true
  }
];

async function main() {
  console.log('Starting default roles migration...');
  
  const tenants = await prisma.tenant.findMany();
  console.log(`Found ${tenants.length} tenants.`);
  
  let addedCount = 0;
  
  for (const tenant of tenants) {
    for (const defaultRole of DEFAULT_ROLES) {
      // Check if role already exists for this tenant
      const existingRole = await prisma.tenantRole.findFirst({
        where: {
          tenantId: tenant.id,
          name: defaultRole.name
        }
      });
      
      if (!existingRole) {
        await prisma.tenantRole.create({
          data: {
            ...defaultRole,
            tenantId: tenant.id
          }
        });
        addedCount++;
        console.log(`Added "${defaultRole.name}" for tenant ${tenant.id}`);
      }
    }
  }
  
  console.log(`Migration complete. Added ${addedCount} default roles.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
