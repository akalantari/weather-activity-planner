export interface OpenMeteoGeocodingResponse {
    results?: {
        name: string;
        latitude: number;
        longitude: number;
        country_code: string;
    }[];
}