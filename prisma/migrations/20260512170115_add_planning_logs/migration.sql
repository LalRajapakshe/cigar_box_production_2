BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ProductionPlanningLog] (
    [id] INT NOT NULL IDENTITY(1,1),
    [planningId] INT NOT NULL,
    [orderId] INT NOT NULL,
    [logDate] DATETIME2 NOT NULL CONSTRAINT [ProductionPlanningLog_logDate_df] DEFAULT CURRENT_TIMESTAMP,
    [userId] INT NOT NULL CONSTRAINT [ProductionPlanningLog_userId_df] DEFAULT 0,
    [status] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ProductionPlanningLog_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProductionPlanningLog] ADD CONSTRAINT [ProductionPlanningLog_planningId_fkey] FOREIGN KEY ([planningId]) REFERENCES [dbo].[ProductionPlanning]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
