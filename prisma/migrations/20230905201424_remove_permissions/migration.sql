/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PermissionToProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PermissionToProfile" DROP CONSTRAINT "_PermissionToProfile_A_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionToProfile" DROP CONSTRAINT "_PermissionToProfile_B_fkey";

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN     "startHour" TEXT,
ALTER COLUMN "numberOfProviderNeeded" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "_PermissionToProfile";
