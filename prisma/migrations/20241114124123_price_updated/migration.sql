/*
  Warnings:

  - Added the required column `unitPrice` to the `PurchaseOrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PurchaseOrderItem" ADD COLUMN     "unitPrice" INTEGER NOT NULL;
