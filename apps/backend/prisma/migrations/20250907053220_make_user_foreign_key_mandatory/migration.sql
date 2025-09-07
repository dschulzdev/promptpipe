/*
  Warnings:

  - Made the column `applicationUserId` on table `Workflow` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Workflow" ALTER COLUMN "applicationUserId" SET NOT NULL;
