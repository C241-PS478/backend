-- DropForeignKey
ALTER TABLE "WaterSourceComment" DROP CONSTRAINT "WaterSourceComment_waterSourceId_fkey";

-- DropForeignKey
ALTER TABLE "WaterSourcesLike" DROP CONSTRAINT "WaterSourcesLike_waterSourceId_fkey";

-- AlterTable
ALTER TABLE "WaterSource" 
DROP COLUMN "state",
ADD COLUMN "predictionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WaterSourceComment"
RENAME COLUMN "waterSourceId" TO "sourceId";

-- AlterTable
ALTER TABLE "WaterSourcesLike" DROP CONSTRAINT "WaterSourcesLike_pkey";

ALTER TABLE "WaterSourcesLike" 
RENAME COLUMN "waterSourceId" TO "sourceId";

ALTER TABLE "WaterSourcesLike" ADD CONSTRAINT "WaterSourcesLike_pkey" PRIMARY KEY ("sourceId", "userId");

-- AddForeignKey
ALTER TABLE "WaterSource" ADD CONSTRAINT "WaterSource_predictionId_fkey" FOREIGN KEY ("predictionId") REFERENCES "WaterPrediction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterSourcesLike" ADD CONSTRAINT "WaterSourcesLike_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "WaterSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterSourceComment" ADD CONSTRAINT "WaterSourceComment_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "WaterSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
