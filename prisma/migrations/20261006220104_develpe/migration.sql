-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('INSTAPAY', 'VODAFONE_CASH', 'CARD', 'CASH');

-- AlterEnum
ALTER TYPE "ProviderCategory" ADD VALUE 'CRAFTSMAN';

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_providerId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "ProviderProfile" DROP CONSTRAINT "ProviderProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_providerId_fkey";

-- DropForeignKey
ALTER TABLE "WorkingHours" DROP CONSTRAINT "WorkingHours_providerId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "address" TEXT,
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "clientNotes" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "method" "PaymentMethod" NOT NULL DEFAULT 'INSTAPAY';

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "requiresAddress" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CLIENT';

-- CreateTable
CREATE TABLE "ProviderAbsence" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" TEXT,

    CONSTRAINT "ProviderAbsence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProviderAbsence_providerId_date_key" ON "ProviderAbsence"("providerId", "date");

-- CreateIndex
CREATE INDEX "Booking_providerId_status_idx" ON "Booking"("providerId", "status");

-- AddForeignKey
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderAbsence" ADD CONSTRAINT "ProviderAbsence_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkingHours" ADD CONSTRAINT "WorkingHours_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
