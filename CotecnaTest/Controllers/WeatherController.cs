using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenWeatherMap.Data.Models.Forecast;
using OpenWeatherMap.Service;

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
        public async Task<List<CalendarForecast>> GetAsync(string id)
        {
            return await _openWeatherService.GetWeatherAsync(id);
        }
    }
}
