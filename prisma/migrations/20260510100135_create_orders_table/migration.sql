BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Orders] (
    [id] INT NOT NULL IDENTITY(1,1),
    [boxTypeId] NVARCHAR(1000) NOT NULL,
    [boardTypeId] NVARCHAR(1000) NOT NULL,
    [quantity] INT NOT NULL,
    [orderDate] DATETIME2 NOT NULL,
    [deliveryDate] DATETIME2 NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Orders_status_df] DEFAULT 'PENDING',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Orders_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Orders_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [Orders_boxTypeId_fkey] FOREIGN KEY ([boxTypeId]) REFERENCES [dbo].[BoxType]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [Orders_boardTypeId_fkey] FOREIGN KEY ([boardTypeId]) REFERENCES [dbo].[BoardDefinition]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
