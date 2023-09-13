/*
  Warnings:

  - You are about to drop the column `authorId` on the `ProviderServiceRequestResponse` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `ServiceRequest` table. All the data in the column will be lost.
  - The `estimatedPrice` column on the `ServiceRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `providerAuthorId` to the `ProviderServiceRequestResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerAuthorId` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startHour` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_providerId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_serviceRequestId_fkey";

-- DropForeignKey
ALTER TABLE "ProviderServiceRequestResponse" DROP CONSTRAINT "ProviderServiceRequestResponse_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_authorId_fkey";

-- AlterTable
ALTER TABLE "ProviderServiceRequestResponse" DROP COLUMN "authorId",
ADD COLUMN     "providerAuthorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServiceRequest" DROP COLUMN "authorId",
DROP COLUMN "duration",
DROP COLUMN "endDate",
DROP COLUMN "location",
DROP COLUMN "startDate",
ADD COLUMN     "customerAuthorId" TEXT NOT NULL,
ADD COLUMN     "date" DATE NOT NULL,
ADD COLUMN     "locationId" TEXT NOT NULL,
ADD COLUMN     "nbOfHours" DOUBLE PRECISION,
ADD COLUMN     "willWantProposal" BOOLEAN DEFAULT false,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "numberOfProviderNeeded" DROP NOT NULL,
DROP COLUMN "startHour",
ADD COLUMN     "startHour" DOUBLE PRECISION NOT NULL,
DROP COLUMN "estimatedPrice",
ADD COLUMN     "estimatedPrice" DOUBLE PRECISION;

-- DropTable
DROP TABLE "Photo";

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT,
    "serviceRequestId" TEXT,
    "providerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_key_key" ON "File"("key");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_customerAuthorId_fkey" FOREIGN KEY ("customerAuthorId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderServiceRequestResponse" ADD CONSTRAINT "ProviderServiceRequestResponse_providerAuthorId_fkey" FOREIGN KEY ("providerAuthorId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
