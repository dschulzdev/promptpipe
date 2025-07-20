/*
  Warnings:

  - You are about to drop the column `edges` on the `Workflow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "edges",
ADD COLUMN     "connections" JSONB NOT NULL DEFAULT '{}';
