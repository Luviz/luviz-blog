export interface Viewer {
  __typename: string;
  name: string;
  homes: Home[];
}

export interface Home {
  __typename: string;
  consumption: Consumption | null;
}

export interface Consumption {
  __typename: string;
  nodes: Node[];
}

export interface Node {
  __typename: Typename;
  unitPrice: number;
  consumption: number | null;
  consumptionUnit: ConsumptionUnit;
  cost: number | null;
  currency: Currency;
  to: string;
  unitPriceVAT: number;
}

export enum Typename {
  Consumption = "Consumption",
}

export enum ConsumptionUnit {
  KWh = "kWh",
}

export enum Currency {
  Sek = "SEK",
}
