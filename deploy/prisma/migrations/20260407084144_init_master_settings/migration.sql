BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[MaterialDefinition] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [cost] FLOAT(53),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [MaterialDefinition_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [MaterialDefinition_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[BoardDefinition] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [width] FLOAT(53) NOT NULL,
    [height] FLOAT(53) NOT NULL,
    [materialId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [BoardDefinition_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [BoardDefinition_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[BoxType] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [boardDefinitionId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [BoxType_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [BoxType_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[BoxTypeSheet] (
    [id] NVARCHAR(1000) NOT NULL,
    [boxTypeId] NVARCHAR(1000) NOT NULL,
    [sheetKey] NVARCHAR(1000) NOT NULL,
    [width] FLOAT(53) NOT NULL,
    [height] FLOAT(53) NOT NULL,
    [quantity] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [BoxTypeSheet_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [BoxTypeSheet_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [BoxTypeSheet_boxTypeId_sheetKey_key] UNIQUE NONCLUSTERED ([boxTypeId],[sheetKey])
);

-- CreateTable
CREATE TABLE [dbo].[SurfaceSpec] (
    [id] NVARCHAR(1000) NOT NULL,
    [boxTypeSheetId] NVARCHAR(1000) NOT NULL,
    [surfaceName] NVARCHAR(1000) NOT NULL,
    [requiresPrinting] BIT NOT NULL CONSTRAINT [SurfaceSpec_requiresPrinting_df] DEFAULT 0,
    [imageUrl] NVARCHAR(1000),
    [imageColor] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [SurfaceSpec_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [SurfaceSpec_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[BoardDefinition] ADD CONSTRAINT [BoardDefinition_materialId_fkey] FOREIGN KEY ([materialId]) REFERENCES [dbo].[MaterialDefinition]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[BoxType] ADD CONSTRAINT [BoxType_boardDefinitionId_fkey] FOREIGN KEY ([boardDefinitionId]) REFERENCES [dbo].[BoardDefinition]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[BoxTypeSheet] ADD CONSTRAINT [BoxTypeSheet_boxTypeId_fkey] FOREIGN KEY ([boxTypeId]) REFERENCES [dbo].[BoxType]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SurfaceSpec] ADD CONSTRAINT [SurfaceSpec_boxTypeSheetId_fkey] FOREIGN KEY ([boxTypeSheetId]) REFERENCES [dbo].[BoxTypeSheet]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
