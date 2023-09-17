/*
  Warnings:

  - You are about to drop the column `customerAuthorId` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the `ProviderServiceRequestResponse` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Made the column `numberOfProviderNeeded` on table `ServiceRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ProviderServiceRequestResponse" DROP CONSTRAINT "ProviderServiceRequestResponse_providerAuthorId_fkey";

-- DropForeignKey
ALTER TABLE "ProviderServiceRequestResponse" DROP CONSTRAINT "ProviderServiceRequestResponse_serviceRequestId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_customerAuthorId_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ServiceRequest" DROP COLUMN "customerAuthorId",
ADD COLUMN     "authorId" TEXT NOT NULL,
ALTER COLUMN "numberOfProviderNeeded" SET NOT NULL;

-- DropTable
DROP TABLE "ProviderServiceRequestResponse";

-- CreateTable
CREATE TABLE "ServiceRequestOffer" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "proposedPrice" TEXT,
    "authorId" TEXT NOT NULL,
    "serviceRequestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequestOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequestProvider" (
    "id" TEXT NOT NULL,
    "note" TEXT,
    "providerId" TEXT NOT NULL,
    "serviceRequestId" TEXT NOT NULL,
    "removedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceRequestProvider_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestOffer" ADD CONSTRAINT "ServiceRequestOffer_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestOffer" ADD CONSTRAINT "ServiceRequestOffer_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestProvider" ADD CONSTRAINT "ServiceRequestProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestProvider" ADD CONSTRAINT "ServiceRequestProvider_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
