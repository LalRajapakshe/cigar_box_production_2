BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[BoxTypeSheet] ADD [polyBagHeightMm] FLOAT(53) NOT NULL CONSTRAINT [BoxTypeSheet_polyBagHeightMm_df] DEFAULT 0,
[polyBagWidthMm] FLOAT(53) NOT NULL CONSTRAINT [BoxTypeSheet_polyBagWidthMm_df] DEFAULT 0,
[polyethyleneWeightPer1000] FLOAT(53) NOT NULL CONSTRAINT [BoxTypeSheet_polyethyleneWeightPer1000_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
