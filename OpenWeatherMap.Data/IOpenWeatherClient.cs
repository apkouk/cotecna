using System.Collections.Generic;
using System.Threading.Tasks;
using OpenWeatherMap.Data.Models.Forecast;

namespace OpenWeatherMap.Data
{
    public interface IOpenWeatherClient
    {
        Task<ForecastResponseClient> GetWeatherByZipCodeAsync(string zipCode);
        Task<ForecastResponseClient> GetWeatherByLocationAsync(string lon, string lat);
    }
}   