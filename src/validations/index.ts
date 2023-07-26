import { z } from 'zod';

export const phoneSchema = z
  .custom<`${number}px`>(val => {
    return /(\+237|237)(6|2)(2|3|[5-9])[0-9]{7}/gm.test(val as string);
  }, 'Veuillez renseigner un numéro de téléphone valide.')
  .or(z.string());
