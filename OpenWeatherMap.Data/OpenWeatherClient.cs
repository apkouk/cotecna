using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using OpenWeatherMap.Data.Models.Forecast;
using OpenWeatherMap.Data.Models.City;
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
        private readonly string _baseUrl;
        private readonly string _apikey;
        private readonly string _imagesUrl;
        private readonly string _imagesExt;
        private readonly string _units;

        List<City> _cities = new List<City>();
        private static readonly string CitiesPath = "\\BulkedData\\city.list.json";

        public OpenWeatherClient(IConfiguration configuration)
        {
            _baseUrl = configuration.GetSection("OpenWeatherClient:BaseUrl").Value;
            _apikey = configuration.GetSection("OpenWeatherClient:ApiKey").Value;
            _imagesUrl = configuration.GetSection("OpenWeatherClient:ImagesUrl").Value;
            _imagesExt = configuration.GetSection("OpenWeatherClient:ImagesExt").Value;
            _units = configuration.GetSection("OpenWeatherClient:Units").Value;
        }

      
        public async Task<ForecastResponseClient> GetWeatherByZipCodeAsync(string zipCode)
        {
            try
            {
                //string path = Directory.GetCurrentDirectory() + _citiesPath;

                //using (StreamReader r = new StreamReader(path))
                //{
                //    string json = r.ReadToEnd();
                //    cities = JsonConvert.DeserializeObject<List<City>>(json);
                //}

                ForecastResponseClient response = new ForecastResponseClient();

                string parameters = "forecast?zip=" + zipCode + ",es" + "&units=" + _units + "&APPID=";
                ForecastResponseApi forecastResponseApi = ApiRequester.OpenWeatherApiCall(_baseUrl, parameters, _apikey, "GET");

                response.city = forecastResponseApi.city;

                foreach (Forecast forecast in forecastResponseApi.list)
                {
                    CalendarForecast calendarForecast = new CalendarForecast
                    {
                        Date = forecast.dt_txt,
                        Temperature = (decimal)forecast.main.temp,
                        Main = forecast.weather[0].main,
                        Description = forecast.weather[0].description,
                        Icon = _imagesUrl + forecast.weather[0].icon + _imagesExt
                    };
                    response.weather.Add(calendarForecast);
                }
                return response;
            }
            catch (Exception ex)
            {
                throw(ex);
            }            
        }

        public async Task<ForecastResponseClient> GetWeatherByLocationAsync(string lon, string lat)
        {
            try
            {
                //string path = Directory.GetCurrentDirectory() + _citiesPath;

                //using (StreamReader r = new StreamReader(path))
                //{
                //    string json = r.ReadToEnd();
                //    cities = JsonConvert.DeserializeObject<List<City>>(json);
                //}

                ForecastResponseClient response = new ForecastResponseClient();

                string parameters = "forecast?lat=" + lat + "&lon=" + lon + "&units=" + _units + "&APPID=";
                ForecastResponseApi forecastResponseApi = ApiRequester.OpenWeatherApiCall(_baseUrl, parameters, _apikey, "GET");

                response.city = forecastResponseApi.city;

                foreach (Forecast forecast in forecastResponseApi.list)
                {
                    CalendarForecast calendarForecast = new CalendarForecast
                    {
                        Date = forecast.dt_txt,
                        Temperature = (decimal)forecast.main.temp,
                        Main = forecast.weather[0].main,
                        Description = forecast.weather[0].description,
                        Icon = _imagesUrl + forecast.weather[0].icon + _imagesExt
                    };
                    response.weather.Add(calendarForecast);
                }
                return response;
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }
    }
}
