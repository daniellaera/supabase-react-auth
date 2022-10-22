-- CreateTable
CREATE TABLE "ProgrammingLanguages" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "ProgrammingLanguages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProgrammingLanguages" ADD CONSTRAINT "ProgrammingLanguages_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
