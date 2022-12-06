-- CreateEnum
CREATE TYPE "ThirdPartyType" AS ENUM ('DISCORD', 'GOOGLE', 'APPLE', 'FACEBOOK');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "thirdPartyAuthId" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ThirdPartyAuth" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "id" TEXT NOT NULL,
    "uid" VARCHAR(64) NOT NULL,
    "email" VARCHAR(320),
    "firstName" VARCHAR(64),
    "lastName" VARCHAR(64),
    "avatar" TEXT,
    "type" "ThirdPartyType" NOT NULL,

    CONSTRAINT "ThirdPartyAuth_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_thirdPartyAuthId_fkey" FOREIGN KEY ("thirdPartyAuthId") REFERENCES "ThirdPartyAuth"("id") ON DELETE SET NULL ON UPDATE CASCADE;
