-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "expectedLifespanYears" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LifeEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "weekIndex" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "emotionalTone" TEXT NOT NULL,
    "iconKey" TEXT NOT NULL,
    "colorKey" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "showOnExport" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LifeEvent_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "gridDensity" TEXT NOT NULL DEFAULT 'comfortable',
    "showYearMarkers" BOOLEAN NOT NULL DEFAULT true,
    "showWeekNumbers" BOOLEAN NOT NULL DEFAULT false,
    "showEventIcons" BOOLEAN NOT NULL DEFAULT true,
    "exportTheme" TEXT NOT NULL DEFAULT 'night',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AppSettings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "LifeEvent_profileId_date_idx" ON "LifeEvent"("profileId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AppSettings_profileId_key" ON "AppSettings"("profileId");
