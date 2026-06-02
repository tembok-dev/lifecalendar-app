-- AlterTable
ALTER TABLE "LifeEvent" ADD COLUMN "isRecurring" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "LifeEvent" ADD COLUMN "recurrenceType" TEXT;

