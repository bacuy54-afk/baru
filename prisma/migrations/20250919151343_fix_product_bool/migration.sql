/*
  Warnings:

  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "category" TEXT,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "originalPrice" INTEGER,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "provider" SET DEFAULT '';
