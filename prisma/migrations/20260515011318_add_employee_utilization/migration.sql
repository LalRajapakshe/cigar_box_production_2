BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[EmployeeMaster] (
    [empId] INT NOT NULL IDENTITY(1,1),
    [empCode] NVARCHAR(1000) NOT NULL,
    [empName] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [EmployeeMaster_pkey] PRIMARY KEY CLUSTERED ([empId]),
    CONSTRAINT [EmployeeMaster_empCode_key] UNIQUE NONCLUSTERED ([empCode])
);

-- CreateTable
CREATE TABLE [dbo].[ProductionEmployeeUtilization] (
    [id] INT NOT NULL IDENTITY(1,1),
    [planningId] INT NOT NULL,
    [employeeId] INT NOT NULL,
    [workingHours] FLOAT(53) NOT NULL,
    [workDate] DATETIME2 NOT NULL CONSTRAINT [ProductionEmployeeUtilization_workDate_df] DEFAULT CURRENT_TIMESTAMP,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ProductionEmployeeUtilization_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ProductionEmployeeUtilization_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProductionEmployeeUtilization] ADD CONSTRAINT [ProductionEmployeeUtilization_planningId_fkey] FOREIGN KEY ([planningId]) REFERENCES [dbo].[ProductionPlanning]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProductionEmployeeUtilization] ADD CONSTRAINT [ProductionEmployeeUtilization_employeeId_fkey] FOREIGN KEY ([employeeId]) REFERENCES [dbo].[EmployeeMaster]([empId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
