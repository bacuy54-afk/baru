/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Order` table. All the data in the column will be lost.
  - Added the required column `buyerContact` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerName` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "updatedAt",
ADD COLUMN     "buyerContact" TEXT NOT NULL,
ADD COLUMN     "buyerName" TEXT NOT NULL,
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "public"."OrderItem" ALTER COLUMN "qty" DROP DEFAULT;
