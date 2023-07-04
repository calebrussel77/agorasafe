import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const importData = async () => {
  try {
    // delete all presents data
    // await prisma.user.deleteMany();

    // Create fresh data
    // await createUsers();

    console.log('Data imported !');
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await prisma.profile.deleteMany();
    await prisma.location.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    
    // await prisma.pageSetting.deleteMany();
    // await prisma.subscriber.deleteMany();
    // await prisma.subscription.deleteMany();

    console.log('Data destroyed !');
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const load = async () => {
  try {
    //check the flag of the script and
    //run function according to the flag
    if (process.argv[2] === '-d') {
      destroyData();
    } else {
      importData();
    }
  } catch (e) {
    console.log(e);
  } finally {
    await prisma.$disconnect();
  }
};

load();
