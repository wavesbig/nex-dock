-- CreateTable
CREATE TABLE "SearchEngine" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SearchSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "selectedEngineKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SearchSetting_selectedEngineKey_fkey" FOREIGN KEY ("selectedEngineKey") REFERENCES "SearchEngine" ("key") ON DELETE SET NULL ON UPDATE CASCADE
);
