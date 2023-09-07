/*
  Warnings:

  - You are about to drop the `_CategoryServiceToService` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryServiceToService" DROP CONSTRAINT "_CategoryServiceToService_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryServiceToService" DROP CONSTRAINT "_CategoryServiceToService_B_fkey";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "categoryServiceId" TEXT;

-- DropTable
DROP TABLE "_CategoryServiceToService";

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryServiceId_fkey" FOREIGN KEY ("categoryServiceId") REFERENCES "CategoryService"("id") ON DELETE SET NULL ON UPDATE CASCADE;
