using Microsoft.AspNetCore.Mvc;
using OpenWeatherMap.Data.Models.Forecast;
using OpenWeatherMap.Service;
using System.Threading.Tasks;

namespace CotecnaTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly IOpenWeatherService _openWeatherService;

        public WeatherController(IOpenWeatherService openWeatherService)
        {
            _openWeatherService = openWeatherService;
        }
        
        [HttpGet("{zipCode}")]
        public async Task<ForecastResponseClient> GetAsync(string zipCode)
        {
            return await _openWeatherService.GetWeatherByZipCodeAsync(zipCode);
        }

        [HttpGet]
        public async Task<ForecastResponseClient> GetByLocation([FromQuery]string lon, [FromQuery]string lat)
        {
            return await _openWeatherService.GetWeatherByLocationAsync(lon, lat);
        }
    }
}
