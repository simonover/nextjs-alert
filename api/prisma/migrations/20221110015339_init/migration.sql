-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeadPeople" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "birthplace" TEXT NOT NULL,
    "deadDay" TIMESTAMP(3) NOT NULL,
    "deadPlace" TEXT NOT NULL,
    "description" TEXT,
    "career" TEXT,
    "death" TEXT,
    "reason" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,

    CONSTRAINT "DeadPeople_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeadPeople_fullname_key" ON "DeadPeople"("fullname");
