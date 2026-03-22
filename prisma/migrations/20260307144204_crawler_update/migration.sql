/*
  Warnings:

  - A unique constraint covering the columns `[crawlSessionId,url]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Page_crawlSessionId_url_key" ON "Page"("crawlSessionId", "url");
