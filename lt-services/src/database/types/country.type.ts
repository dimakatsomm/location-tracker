export interface ICountry {
  id: string;
  name: string;
  capital?: string;
  region?: string;
  currency: {
    code: string;
    name: string;
    symbol?: string;
  };
  language: {
    code: string;
    name: string;
    nativeName?: string;
  };
  flag: string;
}
