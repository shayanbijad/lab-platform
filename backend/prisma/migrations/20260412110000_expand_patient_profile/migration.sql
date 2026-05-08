-- CreateEnum
CREATE TYPE "InsuranceType" AS ENUM (
    'SOCIAL_SECURITY',
    'SELF_PAY',
    'ARMED_FORCES',
    'HEALTH_INSURANCE'
);

-- AlterTable
ALTER TABLE "Patient"
    ALTER COLUMN "firstName" DROP NOT NULL,
    ALTER COLUMN "lastName" DROP NOT NULL,
    ALTER COLUMN "nationalId" DROP NOT NULL,
    ALTER COLUMN "birthDate" DROP NOT NULL,
    ALTER COLUMN "gender" DROP NOT NULL,
    ADD COLUMN "age" INTEGER,
    ADD COLUMN "insuranceType" "InsuranceType",
    ADD COLUMN "medicalConditions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN "profileCompleted" BOOLEAN NOT NULL DEFAULT false;
