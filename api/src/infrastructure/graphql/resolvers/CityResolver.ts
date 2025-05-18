import { Resolver, Query, Args, FieldResolver, Root, ResolverInterface } from 'type-graphql';
import { City } from '@/infrastructure/graphql/schemas/types/city/City';
import { CityArgs } from '@/infrastructure/graphql/schemas/inputs/CityArgs';
import { LocationSearchService } from '@/modules/city/application/services/LocationSearchService';
import { Inject, Service } from 'typedi';
import { WeatherDataService } from '@/modules/weather/application/services/WeatherDataService';
import { CurrentWeather } from '@/infrastructure/graphql/schemas/types/weather/CurrentWeather';

@Resolver(of => City)
@Service()
export class CityResolver implements ResolverInterface<City> {
  
  constructor(
    @Inject()
    private readonly locationSearchService: LocationSearchService,
    @Inject()
    private readonly weatherDataService: WeatherDataService
  ) {
  }

  @Query(() => City)
  async city(@Args() args: CityArgs): Promise<City> {
    const city = await this.locationSearchService.searchCity(args.city);
    if (!city) {
        throw new Error('City not found');
    }
    return {
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        country_code: city.country_code
    }
  }

  @FieldResolver()
  name(@Root() root: City): string {
    return root.name;
  }

  @FieldResolver()
  async current_weather(@Root() root: City): Promise<CurrentWeather> {
    const weatherData = await this.weatherDataService.getCurrentWeather(root.name, root.latitude, root.longitude, root.country_code);

    if (!weatherData || !weatherData.current_weather) {
        throw new Error('Weather data not found');
    }

    const result: CurrentWeather = {
        date: weatherData.current_weather.date.toISOString(),
        temperature: weatherData.current_weather.temperature.avg,
        precipitation: weatherData.current_weather.precipitation,
        snowDepth: weatherData.current_weather.snowDepth,
        windSpeed: weatherData.current_weather.windSpeed,
        cloudCover: weatherData.current_weather.cloudCover,
        visibility: weatherData.current_weather.visibility,
        waveHeight: 0
    }

    return result;
  }

}