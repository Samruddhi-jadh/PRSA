-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlSession" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "crawlabilityScore" DOUBLE PRECISION,
    "indexabilityScore" DOUBLE PRECISION,
    "onPageScore" DOUBLE PRECISION,
    "contentScore" DOUBLE PRECISION,
    "programmaticScore" DOUBLE PRECISION,
    "overallScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrawlSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "crawlSessionId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "metaDescription" TEXT,
    "statusCode" INTEGER,
    "wordCount" INTEGER,
    "loadTimeMs" INTEGER,
    "crawlDepth" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParameterResult" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "parameterName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParameterResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalLink" (
    "id" TEXT NOT NULL,
    "crawlSessionId" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,

    CONSTRAINT "InternalLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Website_domain_key" ON "Website"("domain");

-- CreateIndex
CREATE INDEX "Page_url_idx" ON "Page"("url");

-- CreateIndex
CREATE INDEX "ParameterResult_parameterName_idx" ON "ParameterResult"("parameterName");

-- CreateIndex
CREATE INDEX "InternalLink_sourceUrl_idx" ON "InternalLink"("sourceUrl");

-- CreateIndex
CREATE INDEX "InternalLink_targetUrl_idx" ON "InternalLink"("targetUrl");

-- AddForeignKey
ALTER TABLE "CrawlSession" ADD CONSTRAINT "CrawlSession_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_crawlSessionId_fkey" FOREIGN KEY ("crawlSessionId") REFERENCES "CrawlSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParameterResult" ADD CONSTRAINT "ParameterResult_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalLink" ADD CONSTRAINT "InternalLink_crawlSessionId_fkey" FOREIGN KEY ("crawlSessionId") REFERENCES "CrawlSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
