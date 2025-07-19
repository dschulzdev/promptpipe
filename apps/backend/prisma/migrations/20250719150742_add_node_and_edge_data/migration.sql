-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "edgeData" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "nodeData" JSONB NOT NULL DEFAULT '{}';
