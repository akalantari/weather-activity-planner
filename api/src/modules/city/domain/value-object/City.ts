import { ValueObject } from "@/domain/value-objects/ValueObject";
import { LocationSearchResponse } from "@/modules/city/application/interfaces/LocationSearchProvider";

export class City extends ValueObject {
    constructor(
        public readonly name: string,
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly country_code: string
    ) {
        super();
    }

    static fromLocationSearchResponse(response: LocationSearchResponse): City {
        return new City(response.name, response.latitude, response.longitude, response.country_code);
    }

}
