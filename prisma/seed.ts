/* eslint-disable @typescript-eslint/no-non-null-assertion */

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from '@prisma/client';

import { serviceCategories, services, skills } from '../src/data';
import { formatYearMonthDay, increaseDate } from '../src/lib/date-fns';
import { faker } from '../src/lib/faker';
import { shuffle } from '../src/utils/arrays';
import { makeRandomId } from '../src/utils/misc';
import { slugit } from '../src/utils/strings';

const prisma = new PrismaClient({ log: ['warn', 'error'] });

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

const createSkills = async () => {
  const skillsCount = skills.length;

  console.log(`🧹 Creating ${skillsCount} new skills...`);
  return Promise.all(
    skills.map(skill =>
      prisma.skill.create({
        data: { name: skill.name },
      })
    )
  );
};

const destroyData = async () => {
  try {
    console.log('🌱 Cleaned up the database...');

    // await prisma.$transaction(
    //   async (prisma): Promise<void> => {

    // console.log('🧹 Deleting skills...');
    // await prisma.skill.deleteMany();

    console.log('🧹 Deleting accounts...');
    await prisma.account.deleteMany();

    console.log('🧹 Deleting sessions...');
    await prisma.session.deleteMany();

    console.log('🧹 Deleting providers...');
    await prisma.provider.deleteMany();

    console.log('🧹 Deleting customers...');
    await prisma.customer.deleteMany();

    console.log('🧹 Deleting services...');
    await prisma.service.deleteMany();

    console.log('🧹 Deleting service categories...');
    await prisma.categoryService.deleteMany();

    console.log('🧹 Deleting service requests...');
    await prisma.serviceRequest.deleteMany();

    console.log('🧹 Deleting show case projects...');
    await prisma.showCaseProject.deleteMany();

    console.log('🧹 Deleting conversations...');
    await prisma.conversation.deleteMany();

    console.log('🧹 Deleting messages...');
    await prisma.directMessage.deleteMany();

    console.log('🧹 Deleting proposals...');
    await prisma.proposal.deleteMany();

    console.log('🧹 Deleting service request reservations...');
    await prisma.serviceRequestReservation.deleteMany();

    console.log('🧹 Deleting notifications...');
    await prisma.notification.deleteMany();

    console.log('🧹 Deleting reviews...');
    await prisma.review.deleteMany();

    console.log('🧹 Deleting comments...');
    await prisma.comment.deleteMany();

    console.log('🧹 Deleting locations...');
    await prisma.location.deleteMany();

    console.log('🧹 Deleting profiles...');
    await prisma.profile.deleteMany();

    console.log('🧹 Deleting users...');
    await prisma.user.deleteMany();
    //   },
    //   { timeout: 200_000 }
    // );

    console.log(`🌱 Database has been cleaned up.`);

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    console.log('🌱 Seeding the database..');

    const locationsCount = 10;
    const photosCount = 10;
    const usersCount = 10;
    const categorySevicesCount = groupedServices.length;

    // await prisma.$transaction(
    //   async prisma => {
    // console.log(`🧹 Creating ${skillsCount} new skills...`);
    // const createdSkills = await Promise.all(
    //   skills.map(skill =>
    //     prisma.skill.create({
    //       data: { name: skill.name },
    //     })
    //   )
    // );

    console.log(`🧹 Creating ${locationsCount} new locations...`);
    const createdLocations = await Promise.all(
      new Array(locationsCount).fill(null).map(() =>
        prisma.location.create({
          data: {
            lat: faker.location.latitude(),
            long: faker.location.longitude(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            country: faker.location.country(),
            placeId: makeRandomId(),
          },
        })
      )
    );

    console.log(`🧹 Creating ${categorySevicesCount} new category services...`);
    const createdCategoryServices = await Promise.all(
      groupedServices.map(group =>
        prisma.categoryService.create({
          data: {
            name: group.categoryName,
            slug: slugit(group.categoryName),
            services: {
              connectOrCreate: group.services.map(name => ({
                create: { name, slug: slugit(name) },
                where: { name },
              })),
            },
          },
          include: { services: { select: { slug: true, id: true } } },
        })
      )
    );

    console.log(`🧹 Creating ${photosCount} new photos...`);
    const createdPhotos = await Promise.all(
      new Array(photosCount).fill(null).map(() =>
        prisma.file.create({
          data: {
            name: faker.person.firstName(),
            url: faker.image.urlLoremFlickr({
              category: 'food',
              height: 500,
              width: 500,
            }),
            key: makeRandomId(),
          },
        })
      )
    );

    // Création des utilisateurs et des profils en parallèle
    console.log(`👷🏿‍♂️👦🏽 Creating ${usersCount} new users...`);
    await Promise.all(
      new Array(usersCount).fill(null).map(async (_, i) => {
        const fullName = `${faker.person.firstName()} ${faker.person.lastName()}`;
        const PROFILE_TYPE = i % 2 === 0 ? 'CUSTOMER' : 'PROVIDER';

        console.log(`🚀 Creating new user ${i} with name : ${fullName}...`);
        const user = await prisma.user.create({
          data: {
            email: faker.internet.email(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            onboardingComplete: true,
            tos: true,
            sex: i % 2 === 0 ? 'MALE' : 'FEMALE',
            picture: faker.image.urlLoremFlickr({
              category: 'person',
              height: 500,
              width: 500,
            }),
            fullName,
            role: 'MEMBER',
            version: parseFloat(process.env.NEXT_PUBLIC_SESSION_VERSION || '1'),
            birthdate: formatYearMonthDay(faker.date.past({ years: 20 })),
          },
        });

        console.log(
          `🚀 Creating new profile for ${fullName} of type ${PROFILE_TYPE}...`
        );
        const profile = await prisma.profile.create({
          data: {
            userId: user.id,
            name: user.fullName,
            slug: slugit(user.fullName),
            locationId: shuffle(
              createdLocations.map(location => location.id)
            )[0],
            websiteUrl: faker.internet.url(),
            bio: faker.person.bio(),
            aboutMe: faker.lorem.paragraph(),
            facebookUrl: `https://facebook.com/${slugit(user.fullName)}`,
            linkedinUrl: `https://linkedin.com/${slugit(user.fullName)}`,
            XUrl: `https://x.com/${slugit(user.fullName)}`,
            avatar: faker.image.urlLoremFlickr({
              category: 'person',
              height: 500,
              width: 500,
            }),
            phone: faker.phone.number(),
            type: PROFILE_TYPE,
          },
        });

        // Logique pour les prestataires
        if (profile.type === 'PROVIDER') {
          console.log(
            `🚀 Complete ${PROFILE_TYPE} profile infos for ${fullName}...`
          );
          const provider = await prisma.provider.create({
            data: {
              profileId: profile.id,
              isFaceToFace: i % 2 === 0,
              isRemote: i % 2 !== 0,
              profession: faker.person.jobTitle(),
              skills: {
                connect: shuffle(
                  skills.map(skill => ({ name: skill.name }))
                )!.slice(0, 2),
              },
            },
          });

          // Création de projets vitrine pour les prestataires
          console.log(`🚀 Creating 3 show case projects for ${fullName}...`);
          await Promise.all(
            new Array(3).fill(null).map(async () => {
              await prisma.showCaseProject.create({
                data: {
                  title: faker.commerce.productName(),
                  description: faker.commerce.productDescription(),
                  photo: {
                    connect: {
                      id: shuffle(createdPhotos.map(photo => photo.id))[0],
                    },
                  },
                  providerId: provider.id,
                },
              });
            })
          );
        }

        // Logique pour les clients
        if (profile.type === 'CUSTOMER') {
          console.log(
            `🚀 Complete ${PROFILE_TYPE} profile infos for ${fullName}...`
          );
          const customer = await prisma.customer.create({
            data: {
              profileId: profile.id,
            },
          });

          // Création des demandes de service pour les clients
          console.log(`🚀 Creating 3 service requests for ${fullName}...`);
          await Promise.all(
            new Array(3).fill(null).map(async () => {
              const serviceCategory = shuffle(createdCategoryServices)[0]!;
              const service = shuffle(serviceCategory.services)[0]!;

              await prisma.serviceRequest.create({
                data: {
                  title: faker.commerce.productName(),
                  slug: slugit(faker.commerce.productName()),
                  description: faker.lorem.paragraph(5),
                  phoneToContact: faker.phone.number(),
                  locationId: shuffle(
                    createdLocations.map(location => location.id)
                  )[0]!,
                  authorId: customer.id,
                  serviceId: service.id,
                  date: increaseDate(new Date(), { days: 2 }),
                  photos: {
                    connect: shuffle(
                      createdPhotos.map(photo => ({ id: photo.id }))
                    ).slice(0, 3),
                  },
                  estimatedPrice: parseFloat(
                    faker.commerce.price({ min: 6000, max: 25000 })
                  ),
                  numberOfProviderNeeded: faker.number.int({
                    min: 1,
                    max: 5,
                  }),
                  nbOfHours: faker.number.int({ min: 1, max: 8 }),
                  startHour: faker.number.int({ min: 8, max: 16 }),
                },
              });
            })
          );
        }
      })
    );

    // ...
    console.log(`🚀🤗 ${usersCount} users created.`);
    console.log('🌱 Database has been seeded');
    // }
  } catch (error) {
    console.error(error);
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
