/*
  Warnings:

  - You are about to drop the column `end_date` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_price` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `ServiceRequest` table. All the data in the column will be lost.
  - Added the required column `estimatedPrice` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceRequest" DROP COLUMN "end_date",
DROP COLUMN "estimated_price",
DROP COLUMN "start_date",
ADD COLUMN     "endDate" TEXT,
ADD COLUMN     "estimatedPrice" TEXT NOT NULL,
ADD COLUMN     "startDate" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasBeenOnboarded" BOOLEAN DEFAULT false;
