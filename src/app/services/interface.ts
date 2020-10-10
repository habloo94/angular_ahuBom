export interface Coilprice {
  id: number;
  area: number;
  two_rd: number;
  four_rd: number;
  six_rd: number;
  eight_rd: number;
  header_mat: string;
  circuit_type: string;
}

export interface ItemMaster {
  id: number;
  Code: string;
  Name: string;
  Description: string;
  Unit: string;
  Brand: string;
  Sub_Group: string;
  Item_Group: string;
}
