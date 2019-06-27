using System.Collections.Generic;
using System.Threading.Tasks;
using OpenWeatherMap.Data.Models.Forecast;

namespace OpenWeatherMap.Service
{
    public interface IOpenWeatherService
    {
        Task<ForecastResponseClient> GetWeatherByZipCodeAsync(string zipCode);
        Task<ForecastResponseClient> GetWeatherByLocationAsync(string lon, string lat);
    }
}