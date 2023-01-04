/*
  Warnings:

  - You are about to drop the column `authorEmail` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authorEmail]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorEmail",
ADD COLUMN     "profileId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_authorEmail_key" ON "Profile"("authorEmail");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
