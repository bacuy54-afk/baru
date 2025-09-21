-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELED', 'FULFILLED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."AccountStatus" AS ENUM ('ACTIVE', 'PAUSED', 'BANNED');

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductPlan" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "originalPrice" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerEmail" TEXT,
    "waNumber" TEXT,
    "total" INTEGER NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "paymentProvider" TEXT,
    "paymentRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InventoryAccount" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "usernameEnc" TEXT NOT NULL,
    "passwordEnc" TEXT NOT NULL,
    "noteEnc" TEXT,
    "seatsTotal" INTEGER NOT NULL DEFAULT 1,
    "seatsUsed" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Seat" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "label" TEXT,
    "isAssigned" BOOLEAN NOT NULL DEFAULT false,
    "assignedAt" TIMESTAMP(3),
    "disabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Assignment" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revealedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RevealToken" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevealToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_orderItemId_key" ON "public"."Assignment"("orderItemId");

-- CreateIndex
CREATE INDEX "Assignment_seatId_idx" ON "public"."Assignment"("seatId");

-- CreateIndex
CREATE UNIQUE INDEX "RevealToken_token_key" ON "public"."RevealToken"("token");

-- AddForeignKey
ALTER TABLE "public"."ProductPlan" ADD CONSTRAINT "ProductPlan_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."ProductPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Seat" ADD CONSTRAINT "Seat_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."InventoryAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "public"."OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "public"."Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RevealToken" ADD CONSTRAINT "RevealToken_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
