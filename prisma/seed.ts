import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

import { engagementSkills, serviceCategories, services } from '../src/data';
import { formatYearMonthDay } from '../src/lib/date-fns';
import { slugit } from '../src/utils/strings';

const prisma = new PrismaClient({ log: ['warn', 'error'] });

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

const createPhoto = async () => {
  return prisma.file.create({
    data: {
      name: faker.person.firstName(),
      url: faker.image.urlLoremFlickr({
        category: 'food',
        height: 500,
        width: 500,
      }),
    },
  });
};
const createLocation = async () => {
  return prisma.location.create({
    data: {
      lat: faker.location.latitude().toFixed(),
      long: faker.location.longitude().toFixed(),
      name: `${faker.location.streetAddress()}`,
    },
  });
};

const groupedServices = serviceCategories.map(category => {
  const categoryServices = services
    .filter(service => service.category === category.name)
    .map(service => service.name);
  return {
    id: category.id,
    categoryName: category.name,
    services: categoryServices,
  };
});

const createUserWithAdminRoleAndProfiles = async () => {
  console.log('🧹👮 Creation of the user locations...');
  const { id: locationId } = await createLocation();
  const { id: locationId2 } = await createLocation();

  console.log('🧹👮 Creation of the user service requests photos...');
  const { id: photoId } = await createPhoto();
  const { id: photoId2 } = await createPhoto();

  console.log('🧹👮 Creation of the user with profiles...');
  const { profiles } = await prisma.user.create({
    data: {
      // email: 'calebrussel77@gmail.com',
      email: 'fake.email@gmail.fr',
      firstName: faker.person.firstName(),
      fullName: faker.person.fullName(),
      lastName: faker.person.lastName(),
      birthdate: formatYearMonthDay(faker.date.birthdate({ mode: 'year' })),
      sex: 'MALE',
      hasBeenOnboarded: true,
      role: 'ADMIN',
      picture: faker.image.avatar(),
      profiles: {
        createMany: {
          data: [
            {
              name: 'Cesar Kamdem J.',
              websiteUrl: faker.internet.url(),
              aboutMe: faker.lorem.paragraph(4),
              facebookUrl: `https://facebook.com/${faker.internet.userName()}`,
              linkedinUrl: `https://linkedin.com/${faker.internet.userName()}`,
              XUrl: `https://x.com/${faker.internet.userName()}`,
              avatar: faker.image.avatar(),
              bio: faker.person.bio(),
              phone: faker.phone.number('+23769#######'),
              slug: 'cesar-kamdem-20029',
              type: 'PROVIDER',
              locationId,
            },
            {
              name: 'Jules Masango K.',
              websiteUrl: faker.internet.url(),
              bio: faker.person.bio(),
              aboutMe: faker.lorem.paragraph(4),
              facebookUrl: `https://facebook.com/${faker.internet.userName()}`,
              linkedinUrl: `https://linkedin.com/${faker.internet.userName()}`,
              XUrl: `https://x.com/${faker.internet.userName()}`,
              avatar: faker.image.avatar(),
              phone: faker.phone.number('+23765#######'),
              slug: 'jules-masango-keneth-20030',
              type: 'CUSTOMER',
              locationId: locationId2,
            },
          ],
        },
      },
    },
    select: { profiles: true },
  });

  for (const profile of profiles) {
    if (profile?.type === 'CUSTOMER') {
      console.log(
        '🧹👮 Updating the CUSTOMER profile with details and create 02 service requests...'
      );
      await prisma.profile.update({
        where: { id: profile.id },
        data: {
          customerInfo: {
            create: {
              serviceRequests: {
                create: [
                  {
                    date: faker.date.past(),
                    title: faker.lorem.lines(5),
                    description: faker.lorem.paragraph(4),
                    estimatedPrice: +faker.commerce.price(),
                    numberOfProviderNeeded: faker.number.int({
                      min: 1,
                      max: 5,
                    }),
                    nbOfHours: faker.number.int({ min: 1, max: 5 }),
                    phoneToContact: faker.phone.number('+23769#######'),
                    service: {
                      connect: {
                        name: faker.helpers.shuffle(services)[0]?.name,
                      },
                    },
                    slug: slugit(faker.lorem.lines(2)),
                    startHour: 8,
                    location: {
                      connectOrCreate: {
                        where: { name: faker.location.streetAddress() },
                        create: {
                          lat: faker.location.latitude().toFixed(),
                          long: faker.location.longitude().toFixed(),
                          name: faker.location.streetAddress(),
                        },
                      },
                    },
                  },
                  {
                    date: faker.date.past(),
                    title: faker.lorem.lines(2),
                    description: faker.lorem.paragraph(4),
                    estimatedPrice: +faker.commerce.price(),
                    numberOfProviderNeeded: faker.number.int({
                      min: 1,
                      max: 5,
                    }),
                    nbOfHours: faker.number.int({ min: 1, max: 5 }),
                    phoneToContact: faker.phone.number('+23765#######'),
                    service: {
                      connect: {
                        name: faker.helpers.shuffle(services)[0]?.name,
                      },
                    },
                    slug: slugit(faker.lorem.lines(2)),
                    startHour: 15,
                    location: {
                      connectOrCreate: {
                        where: { name: faker.location.streetAddress() },
                        create: {
                          lat: faker.location.latitude().toFixed(),
                          long: faker.location.longitude().toFixed(),
                          name: faker.location.streetAddress(),
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      });
    } else {
      console.log('🧹👮 Updating the PROVIDER profile with details...');
      await prisma.profile.update({
        where: { id: profile.id },
        data: {
          providerInfo: {
            create: {
              isFaceToFace: true,
              profession: faker.person.jobTitle(),
              isRemote: false,
              skills: {
                connect: [
                  { name: faker.helpers.shuffle(engagementSkills)[3]?.name },
                  { name: faker.helpers.shuffle(engagementSkills)[6]?.name },
                ],
              },
              showCaseProjects: {
                createMany: {
                  data: [
                    {
                      photoId: photoId,
                      title: faker.lorem.sentence(),
                      description: faker.lorem.sentence(3),
                    },
                    {
                      photoId: photoId2,
                      title: faker.lorem.sentence(),
                      description: faker.lorem.sentence(4),
                    },
                  ],
                },
              },
            },
          },
        },
      });
    }
  }
};

const createEngamentSkills = async () => {
  await prisma.skill.createMany({
    data: engagementSkills?.map(skill => ({ name: skill.name })),
  });
};

const createCategoriesWithServices = async () => {
  for (const el of groupedServices) {
    await prisma.categoryService.create({
      data: {
        name: el.categoryName,
        slug: slugit(el.categoryName),
        services: {
          connectOrCreate: el.services.map(name => ({
            create: { name, slug: slugit(name) },
            where: { name },
          })),
        },
      },
    });
  }
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

    console.log('🧹 Deleting sessions...');
    await prisma.session.deleteMany();

    console.log('🧹 Deleting services...');
    await prisma.service.deleteMany();

    console.log('🧹 Deleting service categories...');
    await prisma.categoryService.deleteMany();

    console.log('🧹 Deleting service requests...');
    await prisma.serviceRequest.deleteMany();

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

    console.log(`🧹 Creating categories with services...`);
    await createCategoriesWithServices();

    // console.log(`🧹 Creating engagement skills...`);
    // await createEngamentSkills();

    // console.log(
    //   `🧹 Creating 01 user with 02 complete profiles with details...`
    // );
    // await createUserWithAdminRoleAndProfiles();

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
