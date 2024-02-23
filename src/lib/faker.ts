import { Faker, fr, fr_CA } from '@faker-js/faker';

export const faker = new Faker({
  locale: [fr, fr_CA],
});
