import { env } from '@/env.mjs';
import cloudinary from 'cloudinary';

const cloudinaryConfig = cloudinary.v2;

cloudinaryConfig.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_SECRET,
});

export { cloudinaryConfig };
