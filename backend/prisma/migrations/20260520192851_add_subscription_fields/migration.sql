-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('none', 'pending', 'active', 'cancelled', 'expired', 'payment_failed');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "payment_customer_id" TEXT,
ADD COLUMN     "payment_subscription_id" TEXT,
ADD COLUMN     "subscription_expires_at" TIMESTAMP(3),
ADD COLUMN     "subscription_status" "SubscriptionStatus" NOT NULL DEFAULT 'none';
