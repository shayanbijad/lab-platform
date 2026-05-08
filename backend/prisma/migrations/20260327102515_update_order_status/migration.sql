/*
  Warnings:

  - You are about to drop the column `lat` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `SamplerMission` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `SamplerMission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CREATED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('PENDING', 'COLLECTED', 'PROCESSING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "lat",
DROP COLUMN "lng",
DROP COLUMN "title",
ADD COLUMN     "building" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "unit" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE "OrderTest" ADD COLUMN     "status" "TestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "SamplerMission" DROP COLUMN "address",
ADD COLUMN     "addressId" TEXT NOT NULL,
ADD COLUMN     "collectedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Order_patientId_idx" ON "Order"("patientId");

-- CreateIndex
CREATE INDEX "OrderTest_orderId_idx" ON "OrderTest"("orderId");

-- CreateIndex
CREATE INDEX "SamplerMission_samplerId_idx" ON "SamplerMission"("samplerId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SamplerMission" ADD CONSTRAINT "SamplerMission_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
