/*
  Warnings:

  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `want_to_be_customer` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `want_to_be_provider` on the `User` table. All the data in the column will be lost.
  - Added the required column `location_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "is_face_to_face" BOOLEAN DEFAULT true,
ADD COLUMN     "is_remote" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "location",
DROP COLUMN "want_to_be_customer",
DROP COLUMN "want_to_be_provider",
ADD COLUMN     "location_id" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "long" TEXT NOT NULL,
    "wikidata" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
