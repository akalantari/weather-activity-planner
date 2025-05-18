export interface LocationSearchResponse {
    name: string;
    latitude: number;
    longitude: number;
    country_code: string;
}

export interface LocationSearchProvider {
    searchCity(cityName: string): Promise<LocationSearchResponse | null>;
}

export default LocationSearchProvider;