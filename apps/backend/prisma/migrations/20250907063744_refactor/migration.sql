-- DropForeignKey
ALTER TABLE "public"."Workflow" DROP CONSTRAINT "Workflow_applicationUserId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Workflow" ADD CONSTRAINT "Workflow_applicationUserId_fkey" FOREIGN KEY ("applicationUserId") REFERENCES "public"."ApplicationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
