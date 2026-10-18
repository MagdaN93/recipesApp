-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('breakfast', 'dinner', 'dessert', 'supper');

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "prepTimeMinutes" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "mealType" "MealType" NOT NULL,
    "steps" TEXT[],

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);
