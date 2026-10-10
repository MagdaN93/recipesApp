-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'viewer');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'viewer';
