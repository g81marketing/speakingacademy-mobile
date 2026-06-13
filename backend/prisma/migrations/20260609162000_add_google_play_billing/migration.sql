-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('mercadopago', 'google_play', 'apple');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "payment_provider" "PaymentProvider",
ADD COLUMN     "google_purchase_token" TEXT,
ADD COLUMN     "google_product_id" TEXT,
ADD COLUMN     "google_order_id" TEXT;
