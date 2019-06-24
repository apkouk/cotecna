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

        public async Task<List<CalendarForecast>> GetWeatherAsync(string cityId)
        {
            return await OpenWeatherClient.GetWeatherAsync(cityId);
        }
    }
}
