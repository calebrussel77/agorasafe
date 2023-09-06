import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

import { formatDateToString } from '../src/lib/date-fns';

const prisma = new PrismaClient();

// import fs from 'fs'
// import { faker } from '@faker-js/faker'
// import { createPassword, createUser } from 'tests/db-utils.ts'
// import { prisma } from '~/utils/db.server.ts'
// import { deleteAllData } from 'tests/setup/utils.ts'
// import { getPasswordHash } from '~/utils/auth.server.ts'

// async function seed() {
// 	console.log('🌱 Seeding...')
// 	console.time(`🌱 Database has been seeded`)

// 	console.time('🧹 Cleaned up the database...')
// 	deleteAllData()
// 	console.timeEnd('🧹 Cleaned up the database...')

// 	console.time(`👑 Created admin role/permission...`)
// 	const adminRole = await prisma.role.create({
// 		data: {
// 			name: 'admin',
// 			permissions: {
// 				create: { name: 'admin' },
// 			},
// 		},
// 	})
// 	console.timeEnd(`👑 Created admin role/permission...`)
// 	const totalUsers = 40
// 	console.time(`👤 Created ${totalUsers} users...`)
// 	const users = await Promise.all(
// 		Array.from({ length: totalUsers }, async (_, index) => {
// 			const userData = createUser()
// 			const user = await prisma.user.create({
// 				data: {
// 					...userData,
// 					password: {
// 						create: createPassword(userData.username),
// 					},
// 					image: {
// 						create: {
// 							contentType: 'image/jpeg',
// 							file: {
// 								create: {
// 									blob: await fs.promises.readFile(
// 										`./tests/fixtures/images/user/${index % 10}.jpg`,
// 									),
// 								},
// 							},
// 						},
// 					},
// 					notes: {
// 						create: Array.from({
// 							length: faker.number.int({ min: 0, max: 10 }),
// 						}).map(() => ({
// 							title: faker.lorem.sentence(),
// 							content: faker.lorem.paragraphs(),
// 						})),
// 					},
// 				},
// 			})
// 			return user
// 		}),
// 	)
// 	console.timeEnd(`👤 Created ${totalUsers} users...`)

// 	console.time(
// 		`🐨 Created user "kody" with the password "kodylovesyou" and admin role`,
// 	)
// 	await prisma.user.create({
// 		data: {
// 			email: 'kody@kcd.dev',
// 			username: 'kody',
// 			name: 'Kody',
// 			roles: { connect: { id: adminRole.id } },
// 			image: {
// 				create: {
// 					contentType: 'image/png',
// 					file: {
// 						create: {
// 							blob: await fs.promises.readFile(
// 								'./tests/fixtures/images/user/kody.png',
// 							),
// 						},
// 					},
// 				},
// 			},
// 			password: {
// 				create: {
// 					hash: await getPasswordHash('kodylovesyou'),
// 				},
// 			},
// 			notes: {
// 				create: [
// 					{
// 						title: 'Basic Koala Facts',
// 						content:
// 							'Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!',
// 					},
// 					{
// 						title: 'Koalas like to cuddle',
// 						content:
// 							'Cuddly critters, koalas measure about 60cm to 85cm long, and weigh about 14kg.',
// 					},
// 					{
// 						title: 'Not bears',
// 						content:
// 							"Although you may have heard people call them koala 'bears', these awesome animals aren’t bears at all – they are in fact marsupials. A group of mammals, most marsupials have pouches where their newborns develop.",
// 					},
// 				],
// 			},
// 		},
// 	})
// 	console.timeEnd(
// 		`🐨 Created user "kody" with the password "kodylovesyou" and admin role`,
// 	)

// 	console.timeEnd(`🌱 Database has been seeded`)
// }

// seed()
// 	.catch(e => {
// 		console.error(e)
// 		process.exit(1)
// 	})
// 	.finally(async () => {
// 		await prisma.$disconnect()
// 	})

const createLocation = async () => {
  return prisma.location.create({
    data: {
      lat: faker.location.latitude().toFixed(),
      long: faker.location.longitude().toFixed(),
      name: `✈️ ${faker.location.city()}`,
    },
  });
};

const createUserWithAdminRoleAndProfiles = async () => {
  const { id: locationId } = await createLocation();

  await prisma.user.create({
    data: {
      email: 'calebrussel77@gmail.com',
      firstName: 'Caleb',
      fullName: 'Caleb Admin',
      lastName: 'Admin',
      birthdate: formatDateToString(faker.date.birthdate({ mode: 'year' })),
      sex: 'MALE',
      hasBeenOnboarded: true,
      role: 'ADMIN',
      picture: faker.image.avatar(),
      profiles: {
        createMany: {
          data: [
            {
              name: 'Admin Prestataire',
              phone: faker.phone.number('+2376########'),
              bio: faker.lorem.paragraph(2),
              avatar: faker.image.avatar(),
              slug: 'admin-provider',
              type: 'PROVIDER',
              locationId,
            },
            {
              name: 'Admin Client',
              bio: faker.lorem.paragraph(2),
              avatar: faker.image.avatar(),
              phone: faker.phone.number('+2376########'),
              slug: 'admin-customer',
              type: 'CUSTOMER',
              locationId,
            },
          ],
        },
      },
    },
  });
};

const destroyData = async () => {
  try {
    console.log('🌱 Cleaned up the database...');

    console.log('🧹 Deleting profiles...');
    await prisma.profile.deleteMany();

    console.log('🧹 Deleting locations...');
    await prisma.location.deleteMany();

    console.log('🧹 Deleting accounts...');
    await prisma.account.deleteMany();

    console.log('🧹 Deleting users...');
    await prisma.user.deleteMany();

    console.log(`🌱 Database has been cleaned up`);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    console.log('🌱 Seeding...');

    console.log(
      `🧹 Creating user "Caleb Admin" with "ADMIN" role and 02 profiles...`
    );
    await createUserWithAdminRoleAndProfiles();

    console.log(`🌱 Database has been seeded`);

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
      await destroyData();
    } else {
      await importData();
    }
  } catch (e) {
    console.log(e);
  } finally {
    await prisma.$disconnect();
  }
};

void load();
