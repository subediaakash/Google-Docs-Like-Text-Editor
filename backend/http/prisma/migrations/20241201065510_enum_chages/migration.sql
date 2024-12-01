/*
  Warnings:

  - Changed the type of `accessType` on the `DocumentPermission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('READ', 'EDIT', 'COMMENT');

-- AlterTable
ALTER TABLE "DocumentPermission" DROP COLUMN "accessType",
ADD COLUMN     "accessType" "AccessType" NOT NULL;
