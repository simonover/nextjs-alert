/*
  Warnings:

  - A unique constraint covering the columns `[urlname]` on the table `DeadPeople` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DeadPeople_urlname_key" ON "DeadPeople"("urlname");
