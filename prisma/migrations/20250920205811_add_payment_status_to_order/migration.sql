/*
  Warnings:

  - Added the required column `orderStatus` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "orderStatus" "public"."OrderStatus" NOT NULL,
ADD COLUMN     "paymentStatus" "public"."PaymentStatus" NOT NULL;
