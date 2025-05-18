import { LocationSearchProvider, LocationSearchResponse } from "../interfaces/LocationSearchProvider";
import { OpenMeteoAPIService } from "@/infrastructure/services/OpenMeteo/OpenMeteoAPIService";
import { Service } from "typedi";
import { City } from "@/modules/city/domain/value-object/City";

@Service()
export class LocationSearchService implements LocationSearchProvider {
    
    constructor(
        private readonly locationSearchProvider: LocationSearchProvider = new OpenMeteoAPIService()
    ) {

    }

    async searchCity(cityName: string): Promise<LocationSearchResponse | null> {
        const result: LocationSearchResponse | null = await this.locationSearchProvider.searchCity(cityName);
        if (!result) {
            return null;
        }

        const city = City.fromLocationSearchResponse(result);

        return city;
    }

}

export default LocationSearchService;