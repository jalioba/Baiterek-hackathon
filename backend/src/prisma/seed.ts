import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Очистка таблиц (опционально, если нужно)
  // await prisma.application.deleteMany();
  // await prisma.service.deleteMany();
  // await prisma.user.deleteMany();

  // 2. Создание пользователей
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);
  const authorPassword = await bcrypt.hash('Author123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@baiterek.kz' },
    update: {},
    create: {
      email: 'admin@baiterek.kz',
      password: adminPassword,
      name: 'Администратор системы',
      iin: '000000000000',
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@test.kz' },
    update: {},
    create: {
      email: 'user@test.kz',
      password: userPassword,
      name: 'Алмас Бекенов',
      iin: '850315402361',
      role: 'USER',
      businessType: 'ТОО "КазПром"',
    },
  });

  const author = await prisma.user.upsert({
    where: { email: 'author@brk.kz' },
    update: {},
    create: {
      email: 'author@brk.kz',
      password: authorPassword,
      name: 'Сотрудник БРК',
      iin: '900512301234',
      role: 'AUTHOR',
    },
  });

  // 3. Создание услуг (Пример)
  const brkServices = [
    {
      title: 'Инвестиционный займ',
      description: 'До 20 млрд тенге, до 20 лет, ставка от 3%',
      category: 'Кредитование',
      subsidiaryId: 'brk-1', // Пример ID
    },
    {
      title: 'Лизинговое финансирование',
      description: 'Оборудование и техника',
      category: 'Лизинг',
      subsidiaryId: 'brk-1',
    },
    {
      title: 'Проектное финансирование',
      description: 'Крупные проекты от 5 млрд',
      category: 'Инвестиции',
      subsidiaryId: 'brk-1',
    }
  ];

  const kazAgroServices = [
    {
      title: 'Весенне-полевые работы',
      description: 'Краткосрочные кредиты для фермеров',
      category: 'Кредитование',
      subsidiaryId: 'kaf-1',
    },
    {
      title: 'Лизинг сельхозтехники',
      description: 'Комбайны, тракторы',
      category: 'Лизинг',
      subsidiaryId: 'kaf-1',
    },
    {
      title: 'Переработка продукции',
      description: 'Кредиты пищевой промышленности',
      category: 'Кредитование',
      subsidiaryId: 'kaf-1',
    }
  ];

  // Здесь можно было бы создать услуги через prisma.service.create()

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
