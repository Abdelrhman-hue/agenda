-- Bring the database schema in line with the current Prisma models.
CREATE TYPE "ServiceMode" AS ENUM ('ONSITE', 'ONLINE', 'HOME_VISIT');
CREATE TYPE "BookingSource" AS ENUM ('WEB', 'WHATSAPP');

ALTER TABLE "User"
  ADD COLUMN "image" TEXT;

ALTER TABLE "ProviderProfile"
  ADD COLUMN "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "address" TEXT,
  ADD COLUMN "locationUrl" TEXT,
  ADD COLUMN "whatsappNumber" TEXT;

CREATE UNIQUE INDEX "ProviderProfile_whatsappNumber_key"
  ON "ProviderProfile"("whatsappNumber");

ALTER TABLE "Service"
  ADD COLUMN "mode" "ServiceMode" NOT NULL DEFAULT 'ONLINE',
  ADD COLUMN "meetingUrl" TEXT,
  ADD COLUMN "depositAmount" INTEGER;

ALTER TABLE "Booking"
  ALTER COLUMN "clientId" DROP NOT NULL,
  ADD COLUMN "clientName" TEXT,
  ADD COLUMN "clientPhone" TEXT,
  ADD COLUMN "source" "BookingSource" NOT NULL DEFAULT 'WEB',
  ADD COLUMN "reminderSentAt" TIMESTAMP(3);

-- Availability uses interval overlap checks; duplicate starts are handled there too.
DROP INDEX "Booking_providerId_startsAt_key";
