export interface ILocation {
    id: string,
    altitude?: number,
    latitude: number,
    longitude: number,
    country: string,
    countryCode: string,
    city: string,
    zipCode?: string,
    street?: string,
}