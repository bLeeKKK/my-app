type ParamsType = {
  remark: string;
  sourceDbName: string;
  sourceFlag: boolean;
  sourceIp: string;
  sourceName: string;
  sourcePort: string;
  sourcePwd: string;
  sourceSystem: string;
  sourceType: string;
  sourceUserName: string;
  viewName: string;
  id?: string;
};

type ShowDataType = ParamsType & {
  businessEntityList: any[];
};

export type { ParamsType, ShowDataType };
