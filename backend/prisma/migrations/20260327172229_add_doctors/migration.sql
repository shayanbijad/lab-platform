-- CreateTable
CREATE TABLE "Doctor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "Categories" TEXT NOT NULL,
    "Experience" INTEGER NOT NULL,
    "Address" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);
