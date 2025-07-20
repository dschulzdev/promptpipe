/*
  Warnings:

  - You are about to drop the column `edgeData` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `nodeData` on the `Workflow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "edgeData",
DROP COLUMN "nodeData",
ADD COLUMN     "edges" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "nodes" JSONB NOT NULL DEFAULT '{}';
