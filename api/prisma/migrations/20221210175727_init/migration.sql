-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_deadPeopleId_fkey";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "published_at" DROP NOT NULL,
ALTER COLUMN "hashtags" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "articleId" DROP NOT NULL,
ALTER COLUMN "deadPeopleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_deadPeopleId_fkey" FOREIGN KEY ("deadPeopleId") REFERENCES "DeadPeople"("id") ON DELETE SET NULL ON UPDATE CASCADE;
