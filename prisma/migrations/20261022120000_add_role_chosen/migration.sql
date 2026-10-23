-- Existing users already have a role, so keep them chosen. New OAuth users
-- explicitly set this flag to false during account creation.
ALTER TABLE "User" ADD COLUMN "roleChosen" BOOLEAN NOT NULL DEFAULT true;
