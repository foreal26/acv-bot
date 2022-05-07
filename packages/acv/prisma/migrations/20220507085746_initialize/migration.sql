-- CreateTable
CREATE TABLE "keyv" (
    "key" TEXT PRIMARY KEY,
    "value" TEXT
);

-- CreateTable
CREATE TABLE "quotes" (
    "timestamp" TEXT NOT NULL PRIMARY KEY,
    "quote" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "link" TEXT
);
