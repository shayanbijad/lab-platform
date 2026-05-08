-- Add preparationBlogId to LabTest and relation to Blog
ALTER TABLE "LabTest" ADD COLUMN "preparationBlogId" TEXT;

ALTER TABLE "LabTest" ADD CONSTRAINT "LabTest_preparationBlogId_fkey" FOREIGN KEY ("preparationBlogId") REFERENCES "Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
