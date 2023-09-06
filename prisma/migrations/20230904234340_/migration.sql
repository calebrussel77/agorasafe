/*
  Warnings:

  - You are about to drop the column `showcasePhotoOne` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `showcasePhotoThree` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `showcasePhotoTwo` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `photoOne` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `photoThree` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `photoTwo` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_locationId_fkey";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "showcasePhotoOne",
DROP COLUMN "showcasePhotoThree",
DROP COLUMN "showcasePhotoTwo";

-- AlterTable
ALTER TABLE "ServiceRequest" DROP COLUMN "photoOne",
DROP COLUMN "photoThree",
DROP COLUMN "photoTwo";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "locationId";

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "key" TEXT,
    "url" TEXT NOT NULL,
    "serviceRequestId" TEXT,
    "providerId" TEXT,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Photo_key_key" ON "Photo"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
