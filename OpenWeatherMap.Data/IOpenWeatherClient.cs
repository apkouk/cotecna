﻿using System.Collections.Generic;
using System.Threading.Tasks;
using OpenWeatherMap.Data.Models.Forecast;

namespace OpenWeatherMap.Data
{
    public interface IOpenWeatherClient
    {
        Task<ForecastResponseClient> GetWeatherAsync(string cityId);
    }
}   