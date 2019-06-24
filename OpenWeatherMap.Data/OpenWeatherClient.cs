using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using OpenWeatherMap.Data.Models.Forecast;
using OpenWeatherMapCosmosDb.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
#pragma warning disable 1998

namespace OpenWeatherMap.Data
{
    //TODO Donwload icon: check if the icon exists on our client, if not, download it 
       
    public class OpenWeatherClient : IOpenWeatherClient
    {
        private readonly string baseUrl;
        private readonly string apikey;
        private readonly string imagesUrl;
        private readonly string imagesExt;
        private readonly string units;

        List<City> cities = new List<City>();
        private static readonly string _citiesPath = "\\BulkedData\\city.list.json";

        public OpenWeatherClient(IConfiguration configuration)
        {
            baseUrl = configuration.GetSection("OpenWeatherClient:BaseUrl").Value;
            apikey = configuration.GetSection("OpenWeatherClient:ApiKey").Value;
            imagesUrl = configuration.GetSection("OpenWeatherClient:ImagesUrl").Value;
            imagesExt = configuration.GetSection("OpenWeatherClient:ImagesExt").Value;
            units = configuration.GetSection("OpenWeatherClient:Units").Value;
        }

      
        public async Task<List<CalendarForecast>> GetWeatherAsync(string cityId)
        {
            try
            {
                string path = Directory.GetCurrentDirectory() + _citiesPath;

                using (StreamReader r = new StreamReader(path))
                {
                    string json = r.ReadToEnd();
                    cities = JsonConvert.DeserializeObject<List<City>>(json);
                }

                List<CalendarForecast> result = new List<CalendarForecast>();

                string parameters = "forecast?id=" + cityId + "&units=" + units + "&APPID=";
                ForecastResponse forecastResponse = ForecastApiCall(baseUrl, parameters, apikey);

                Forecast forecastBase = DateTime.Now.AddHours(3).Day > DateTime.Now.Day
                    ? forecastResponse.list.Find(x => x.dt_txt <= DateTime.Now)
                    : forecastResponse.list.Find(x => x.dt_txt >= DateTime.Now);

                foreach (Forecast forecast in forecastResponse.list)
                {
                    CalendarForecast calendarForecast = new CalendarForecast
                    {
                        Date = forecast.dt_txt,
                        Temperature = (decimal)forecast.main.temp,
                        Main = forecast.weather[0].main,
                        Description = forecast.weather[0].description,
                        Icon = imagesUrl + forecast.weather[0].icon + imagesExt
                    };
                    result.Add(calendarForecast);
                }
                return result;
            }
            catch (Exception ex)
            {
                throw(ex);
            }            
        }

        private static ForecastResponse ForecastApiCall(string baseUrl, string parameters, string apikey)
        {
            WebRequest req = WebRequest.Create(baseUrl + parameters + apikey);
            req.Method = "GET";
            req.Headers.Add(HttpRequestHeader.Accept, "application/json");

            Task<WebResponse> resp = req.GetResponseAsync();
            StreamReader sr = new StreamReader(resp.Result.GetResponseStream() ?? throw new InvalidOperationException());

            string json = sr.ReadToEnd();
            ForecastResponse forecastResponse = JsonConvert.DeserializeObject<ForecastResponse>(json);
            return forecastResponse;
        }


    }
}
