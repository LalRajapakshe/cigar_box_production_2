import { prisma } from "@/lib/prisma";

const ERP_ERRORS: Record<number, string> = {
  [-2]: "Item Name already exists",
  [-3]: "Item Group not found",
  [-4]: "Unit not found",
  [-5]: "Sales Account not found",
  [-6]: "Purchase Account not found",
  [-7]: "Item Alias already exists",
};

export async function createERPItem(params: {
  description: string;

  groupCode: number;

  controlTableCode: number;

  defaultUnitId: number;

}) {
  const controlRows: any[] =
    await prisma.$queryRawUnsafe(`
      select CTRL_TBL_DESCRIPTION,
             CTRL_TBL_NUMBER
      from CONTROL_TABLE
      where CTRL_TBL_CODE = ${params.controlTableCode}
    `);

  if (!controlRows.length) {
    throw new Error("Control table setup not found.");
  }

  const control = controlRows[0];

const alias =
  `${control.CTRL_TBL_DESCRIPTION}-` +
  String(control.CTRL_TBL_NUMBER).padStart(5, "0");

const resultRows: any[] =
  await prisma.$queryRawUnsafe(`
    declare @p30 dbo.ItemMasterWarehouseUdt
    declare @p31 dbo.ItemMasBonusUdt
    declare @p32 int

    set @p32 = 0

    exec SAVE_ITEM_MASTER
      @IT_CODE=0,
      @GRP_CODE=${params.groupCode},
      @CAT_A=55,
      @CAT_B=NULL,
      @CAT_C=NULL,
      @CAT_D=NULL,
      @CAT_E=NULL,
      @CAT_CODE=1,
      @CLASS_CODE=1,
      @DESCRIPTION=N'${params.description}',
      @ALIAS=N'${alias}',
      @SALE_ACC=29,
      @PUR_ACC=15,
      @SL_DEFAULT=NULL,
      @PUR_DEFAULT=NULL,
      @MAX_ORD_QTY=0,
      @REORDER_LEVEL=0,
      @ORDER_QTY=0,
      @COST_METHOD=1,
      @DEF_UNT_CODE=${params.defaultUnitId},
      @DEACTIVATE=N'N',
      @BIN_NO=NULL,
      @SPECIFICATION=0,
      @ECONOMIC_INDEX=0,
      @UNIT_OF_DURATION=0,
      @DURATION=0,
      @COST_PRICE=0,
      @TRANS_PRICE=0,
      @RETAIL_PRICE=0,
      @ImagePath1=NULL,
      @ImagePath2=NULL,
      @ImagePath3=NULL,
      @ImagePath4=NULL,
      @ImagePath5=NULL,
      @ImagePath6=NULL,        
      @ItemMasWarehouseUdt=@p30,
      @ItemMasBonusUdt=@p31,
      @RES=@p32 output;
  `);

//console.log("ERP ALIAS:", alias);
//console.log("ERP DESCRIPTION:", params.description);  

const itemRows: any[] =
  await prisma.$queryRawUnsafe(`
    SELECT TOP 1 IT_MST_CODE
    FROM ITEM_MASTER
    WHERE IT_MST_ALIAS = '${alias}'
    ORDER BY IT_MST_CODE DESC
  `);


 //console.log("ERP ITEM:", itemRows);
//SELECT result = @p32;
const result = Number(itemRows[0]?.IT_MST_CODE ?? 0);

  if (result <= 0) {
    throw new Error(
      ERP_ERRORS[result] ??
        `ERP response is ${result}. Save not success`
    );
  }

  await prisma.$executeRawUnsafe(`
    update CONTROL_TABLE
    set CTRL_TBL_NUMBER = CTRL_TBL_NUMBER + 1
    where CTRL_TBL_CODE = ${params.controlTableCode}
  `);

  return {
    erpItemRefId: result,
    alias,
  };
}