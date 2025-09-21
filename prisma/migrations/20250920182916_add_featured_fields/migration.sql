/*
  Warnings:

  - You are about to drop the column `customerEmail` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentProvider` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentRef` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `waNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to drop the column `isFeatured` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `durationDays` on the `ProductPlan` table. All the data in the column will be lost.
  - You are about to drop the column `originalPrice` on the `ProductPlan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_planId_fkey";

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "customerEmail",
DROP COLUMN "customerPhone",
DROP COLUMN "paymentProvider",
DROP COLUMN "paymentRef",
DROP COLUMN "paymentStatus",
DROP COLUMN "status",
DROP COLUMN "waNumber";

-- AlterTable
ALTER TABLE "public"."OrderItem" DROP COLUMN "planId",
DROP COLUMN "quantity",
ADD COLUMN     "qty" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "isFeatured",
DROP COLUMN "provider",
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "featuredOrder" INTEGER,
ALTER COLUMN "features" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "public"."ProductPlan" DROP COLUMN "durationDays",
DROP COLUMN "originalPrice";
