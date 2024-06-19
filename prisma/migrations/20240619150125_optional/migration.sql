-- DropForeignKey
ALTER TABLE "WaterSource" DROP CONSTRAINT "WaterSource_predictionId_fkey";

-- AlterTable
ALTER TABLE "WaterSource" ALTER COLUMN "predictionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "WaterSource" ADD CONSTRAINT "WaterSource_predictionId_fkey" FOREIGN KEY ("predictionId") REFERENCES "WaterPrediction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
