-- CreateTable
CREATE TABLE "volunteers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "organization" VARCHAR(200),
    "translations" BOOLEAN NOT NULL DEFAULT false,
    "recordings" BOOLEAN NOT NULL DEFAULT false,
    "boards" BOOLEAN NOT NULL DEFAULT false,
    "installations" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "volunteers_pkey" PRIMARY KEY ("id")
);
