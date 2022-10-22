/*
  Warnings:

  - Added the required column `language` to the `ProgrammingLanguages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProgrammingLanguages" ADD COLUMN     "language" TEXT NOT NULL;
