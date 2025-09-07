-- AlterTable
ALTER TABLE "public"."Workflow" ADD COLUMN     "applicationUserId" TEXT;

-- CreateTable
CREATE TABLE "public"."ApplicationUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationUser_userId_key" ON "public"."ApplicationUser"("userId");

-- AddForeignKey
ALTER TABLE "public"."Workflow" ADD CONSTRAINT "Workflow_applicationUserId_fkey" FOREIGN KEY ("applicationUserId") REFERENCES "public"."ApplicationUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationUser" ADD CONSTRAINT "ApplicationUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
