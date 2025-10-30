
import { PrismaClient, TransactionType, BudgetRole, RecurringFrequency } from '@prisma/client';
import bcrypt from 'bcrypt';
import { program } from 'commander';

const prisma = new PrismaClient();

program.option('--lang <language>', 'Language for seed data', 'en');
program.parse(process.argv);

const options = program.opts();
const lang: string = options.lang;

const USER_COUNT = 5;
const MAX_BUDGETS_PER_USER = 3;
const MAX_TRANSACTIONS_PER_BUDGET = 50;
const MAX_GOALS_PER_USER = 5;
const MAX_RECURRING_TRANSACTIONS_PER_BUDGET = 5;

interface SeedData {
    transactionDescriptions: string[];
    categories: string[];
    budgetName: (name: string, i: number) => string;
    goalName: (name: string, i: number) => string;
    recurringDescription: (desc: string) => string;
}

const data: { [key: string]: SeedData } = {
  en: {
    transactionDescriptions: [
      'Groceries', 'Salary', 'Gasoline', 'Rent', 'Utilities', 'Internet', 'Phone Bill', 'Dinner Out',
      'Coffee', 'Gym Membership', 'Netflix', 'Spotify', 'Books', 'Clothing', 'Public Transport',
      'Taxi', 'Flight Tickets', 'Hotel', 'Car Insurance', 'Health Insurance', 'Pharmacy', 'Doctor Visit',
      'Freelance Income', 'Dividends', 'Stock Purchase', 'Savings Deposit', 'Loan Payment', 'Credit Card Payment'
    ],
    categories: [
      'Food & Drinks', 'Shopping', 'Housing', 'Transportation', 'Vehicle', 'Life & Entertainment',
      'Communication, PC', 'Financial expenses', 'Investments', 'Income', 'Other'
    ],
    budgetName: (name: string, i: number) => `${name}'s Budget #${i + 1}`,
    goalName: (name: string, i: number) => `Goal #${i + 1} for ${name}`,
    recurringDescription: (desc: string) => `Recurring ${desc}`,
  },
  es: {
    transactionDescriptions: [
      'Supermercado', 'Salario', 'Gasolina', 'Alquiler', 'Servicios', 'Internet', 'Factura de teléfono', 'Cena fuera',
      'Café', 'Membresía de gimnasio', 'Netflix', 'Spotify', 'Libros', 'Ropa', 'Transporte público',
      'Taxi', 'Billetes de avión', 'Hotel', 'Seguro de coche', 'Seguro de salud', 'Farmacia', 'Visita al médico',
      'Ingresos freelance', 'Dividendos', 'Compra de acciones', 'Depósito de ahorros', 'Pago de préstamo', 'Pago de tarjeta de crédito'
    ],
    categories: [
      'Comida y Bebida', 'Compras', 'Vivienda', 'Transporte', 'Vehículo', 'Vida y Entretenimiento',
      'Comunicación, PC', 'Gastos financieros', 'Inversiones', 'Ingresos', 'Otros'
    ],
    budgetName: (name: string, i: number) => `Presupuesto #${i + 1} de ${name}`,
    goalName: (name: string, i: number) => `Meta #${i + 1} para ${name}`,
    recurringDescription: (desc: string) => `Recurrente ${desc}`,
  }
};

const selectedData = data[lang] || data.en;

async function main() {
  console.log(`Seeding database with ${lang} data...`);

  // 1. Clear existing data
  await prisma.recurringTransaction.deleteMany({});
  await prisma.financialGoal.deleteMany({});
  await prisma.budgetMember.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.budget.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleared existing data.');

  // 2. Create categories
  const createdCategories = await Promise.all(
    selectedData.categories.map(name => prisma.category.create({ data: { name } }))
  );
  console.log(`Created ${createdCategories.length} categories.`);

  // 3. Create users
  const users = [];
  const hashedPassword = await bcrypt.hash('password123', 10);
  for (let i = 1; i <= USER_COUNT; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: hashedPassword,
        name: `User ${i}`,
      },
    });
    users.push(user);
  }
  console.log(`Created ${users.length} users.`);
  console.log('Default password for all users: password123');


  for (const user of users) {
    // 4. Create budgets for each user
    const numBudgets = Math.floor(Math.random() * MAX_BUDGETS_PER_USER) + 1;
    for (let i = 0; i < numBudgets; i++) {
      const budget = await prisma.budget.create({
        data: {
          name: selectedData.budgetName(user.name as string, i),
          ownerId: user.id,
        },
      });
      console.log(`Created budget: ${budget.name}`);

      // 5. Create transactions for each budget
      const numTransactions = Math.floor(Math.random() * MAX_TRANSACTIONS_PER_BUDGET) + 10;
      const transactionsData = [];
      for (let j = 0; j < numTransactions; j++) {
        const type = Math.random() > 0.3 ? TransactionType.EXPENSE : TransactionType.INCOME;
        transactionsData.push({
          description: selectedData.transactionDescriptions[Math.floor(Math.random() * selectedData.transactionDescriptions.length)],
          amount: parseFloat((Math.random() * (type === TransactionType.INCOME ? 5000 : 500)).toFixed(2)),
          type,
          date: new Date(new Date().getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Transactions in the last 30 days
          budgetId: budget.id,
          userId: user.id,
          categoryId: createdCategories[Math.floor(Math.random() * createdCategories.length)].id,
        });
      }
      await prisma.transaction.createMany({ data: transactionsData });
      console.log(`  - Created ${numTransactions} transactions.`);

      // 6. Create recurring transactions for each budget
      const numRecurring = Math.floor(Math.random() * MAX_RECURRING_TRANSACTIONS_PER_BUDGET) + 1;
      for (let k = 0; k < numRecurring; k++) {
        await prisma.recurringTransaction.create({
          data: {
            description: selectedData.recurringDescription(selectedData.transactionDescriptions[Math.floor(Math.random() * selectedData.transactionDescriptions.length)]),
            amount: parseFloat((Math.random() * 200).toFixed(2)),
            type: TransactionType.EXPENSE,
            frequency: Object.values(RecurringFrequency)[Math.floor(Math.random() * 4)],
            startDate: new Date(),
            budgetId: budget.id,
            userId: user.id,
            categoryId: createdCategories[Math.floor(Math.random() * createdCategories.length)].id,
          },
        });
      }
      console.log(`  - Created ${numRecurring} recurring transactions.`);
    }

    // 7. Create financial goals for each user
    const numGoals = Math.floor(Math.random() * MAX_GOALS_PER_USER) + 1;
    for (let i = 0; i < numGoals; i++) {
      const targetAmount = parseFloat((Math.random() * 10000 + 500).toFixed(2));
      await prisma.financialGoal.create({
        data: {
          name: selectedData.goalName(user.name as string, i),
          targetAmount,
          currentAmount: parseFloat((Math.random() * targetAmount).toFixed(2)),
          userId: user.id,
        },
      });
    }
    console.log(`Created ${numGoals} financial goals for ${user.name}.`);
  }

  // 8. Share budgets between users
  const user1 = users[0];
  const user2 = users[1];
  const user3 = users[2];

  const user1Budgets = await prisma.budget.findMany({ where: { ownerId: user1.id } });

  if (user1Budgets.length > 0) {
    await prisma.budgetMember.create({
      data: {
        budgetId: user1Budgets[0].id,
        userId: user2.id,
        role: BudgetRole.EDITOR,
      },
    });
    console.log(`Shared '${user1Budgets[0].name}' from ${user1.name} with ${user2.name} as EDITOR.`);
  }

  if (user1Budgets.length > 1) {
    await prisma.budgetMember.create({
      data: {
        budgetId: user1Budgets[1].id,
        userId: user3.id,
        role: BudgetRole.VIEWER,
      },
    });
    console.log(`Shared '${user1Budgets[1].name}' from ${user1.name} with ${user3.name} as VIEWER.`);
  }


  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
