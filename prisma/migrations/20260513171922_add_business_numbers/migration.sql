/*
  Warnings:

  - A unique constraint covering the columns `[orderNo]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[planningNo]` on the table `ProductionPlanning` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Orders] ADD [orderNo] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[ProductionPlanning] ADD [planningNo] NVARCHAR(1000);

-- CreateIndex
ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [Orders_orderNo_key] UNIQUE NONCLUSTERED ([orderNo]);

-- CreateIndex
ALTER TABLE [dbo].[ProductionPlanning] ADD CONSTRAINT [ProductionPlanning_planningNo_key] UNIQUE NONCLUSTERED ([planningNo]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
