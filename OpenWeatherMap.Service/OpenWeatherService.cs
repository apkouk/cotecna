using OpenWeatherMap.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenWeatherMap.Data.Models.Forecast;

namespace OpenWeatherMap.Service
{
    public class OpenWeatherService : IOpenWeatherService
    {
        public IOpenWeatherClient OpenWeatherClient;

        public OpenWeatherService(IOpenWeatherClient openWeatherClient)
        {
            OpenWeatherClient = openWeatherClient;
        }
  
        public async Task<ForecastResponseClient> GetWeatherByZipCodeAsync(string zipCode)
        {
            return await OpenWeatherClient.GetWeatherByZipCodeAsync(zipCode);
        }

        public async Task<ForecastResponseClient> GetWeatherByLocationAsync(string lon, string lat)
        {
            return await OpenWeatherClient.GetWeatherByLocationAsync(lon, lat);
        }
    }
}
