/*
  Warnings:

  - You are about to drop the column `category_service_id` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `ServiceRequest` table. All the data in the column will be lost.
  - Added the required column `description` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_id` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_category_service_id_fkey";

-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "profession" TEXT;

-- AlterTable
ALTER TABLE "ServiceRequest" DROP COLUMN "category_service_id",
DROP COLUMN "content",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "service_id" TEXT NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryServiceToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryServiceToService_AB_unique" ON "_CategoryServiceToService"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryServiceToService_B_index" ON "_CategoryServiceToService"("B");

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryServiceToService" ADD CONSTRAINT "_CategoryServiceToService_A_fkey" FOREIGN KEY ("A") REFERENCES "CategoryService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryServiceToService" ADD CONSTRAINT "_CategoryServiceToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
