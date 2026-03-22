-- AlterTable
ALTER TABLE "CrawlSession" ADD COLUMN     "robotsTxt" TEXT,
ADD COLUMN     "sitemapXml" TEXT,
ALTER COLUMN "status" DROP DEFAULT;
