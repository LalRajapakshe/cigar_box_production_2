BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ProductionPlanning] (
    [id] INT NOT NULL IDENTITY(1,1),
    [orderId] INT NOT NULL,
    [plannedQuantity] INT NOT NULL,
    [totalParts] INT NOT NULL,
    [totalPiecesRequired] INT NOT NULL,
    [totalSlatsRequired] INT NOT NULL,
    [totalBoardsRequired] INT NOT NULL,
    [totalProductionTimeMinutes] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [ProductionPlanning_status_df] DEFAULT 'PLANNING',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ProductionPlanning_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [ProductionPlanning_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ProductionPlanning_orderId_key] UNIQUE NONCLUSTERED ([orderId])
);

-- CreateTable
CREATE TABLE [dbo].[ProductionPlanningPart] (
    [id] INT NOT NULL IDENTITY(1,1),
    [planningId] INT NOT NULL,
    [sheetKey] NVARCHAR(1000) NOT NULL,
    [sheetLabel] NVARCHAR(1000) NOT NULL,
    [pieceWidth] FLOAT(53) NOT NULL,
    [pieceHeight] FLOAT(53) NOT NULL,
    [quantityPerBox] INT NOT NULL,
    [totalPiecesRequired] INT NOT NULL,
    [boardWidth] FLOAT(53) NOT NULL,
    [boardHeight] FLOAT(53) NOT NULL,
    [cuttingWidth] FLOAT(53) NOT NULL,
    [cuttingHeight] FLOAT(53) NOT NULL,
    [orientation] NVARCHAR(1000) NOT NULL,
    [piecesPerSlat] INT NOT NULL,
    [slatsPerBoard] INT NOT NULL,
    [piecesPerBoard] INT NOT NULL,
    [totalSlatsRequired] INT NOT NULL,
    [totalBoardsRequired] INT NOT NULL,
    [remainingBoardWidth] FLOAT(53) NOT NULL,
    [remainingBoardHeight] FLOAT(53) NOT NULL,
    [productionTimeMinutesPerPiece] INT NOT NULL,
    [totalProductionTimeMinutes] INT NOT NULL,
    [polyBagWidthMm] FLOAT(53) NOT NULL CONSTRAINT [ProductionPlanningPart_polyBagWidthMm_df] DEFAULT 0,
    [polyBagHeightMm] FLOAT(53) NOT NULL CONSTRAINT [ProductionPlanningPart_polyBagHeightMm_df] DEFAULT 0,
    [polyethyleneWeightPer1000] FLOAT(53) NOT NULL CONSTRAINT [ProductionPlanningPart_polyethyleneWeightPer1000_df] DEFAULT 0,
    [totalPolyethyleneRequirementKg] FLOAT(53) NOT NULL CONSTRAINT [ProductionPlanningPart_totalPolyethyleneRequirementKg_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ProductionPlanningPart_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ProductionPlanningPart_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProductionPlanning] ADD CONSTRAINT [ProductionPlanning_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Orders]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProductionPlanningPart] ADD CONSTRAINT [ProductionPlanningPart_planningId_fkey] FOREIGN KEY ([planningId]) REFERENCES [dbo].[ProductionPlanning]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
