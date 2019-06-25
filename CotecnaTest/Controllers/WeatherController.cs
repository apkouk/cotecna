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
        
        [HttpGet("{id}")]
        public async Task<ForecastResponseClient> GetAsync(string id)
        {
            return await _openWeatherService.GetWeatherAsync(id);
        }
    }
}
