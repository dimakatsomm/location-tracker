export interface ILocation {
  id: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  city: string;
  zipCode?: string;
  street?: string;
  userId: string;
}
