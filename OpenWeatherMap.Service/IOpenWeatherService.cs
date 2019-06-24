using System.Collections.Generic;
using System.Threading.Tasks;
using OpenWeatherMap.Data.Models.Forecast;

namespace OpenWeatherMap.Service
{
    public interface IOpenWeatherService
    {
        Task<List<CalendarForecast>> GetWeatherAsync(string cityId);
    }
}