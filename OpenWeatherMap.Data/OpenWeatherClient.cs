using Microsoft.Extensions.Configuration;
using OpenWeatherMap.Data.Models.Forecast;
using System;
using System.Threading.Tasks;

#pragma warning disable 1998

namespace OpenWeatherMap.Data
{
    //TODO Download icon: check if the icon exists on our client, if not, download it 
    //TODO Read cities file and create a function to filter them
    //TODO Improve exceptions
    public class OpenWeatherClient : IOpenWeatherClient
    {
        private readonly string _baseUrl;
        private readonly string _apikey;
        private readonly string _imagesUrl;
        private readonly string _imagesExt;
        private readonly string _units;
        
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
                ForecastResponseClient response = new ForecastResponseClient();
                string parameters = "forecast?zip=" + zipCode + ",es" + "&units=" + _units + "&APPID=";
                ForecastResponseApi forecastResponseApi = ApiRequester.OpenWeatherApiCall(_baseUrl, parameters, _apikey, "GET");
                return LoadWeatherCol(response, forecastResponseApi);
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }

        public async Task<ForecastResponseClient> GetWeatherByLocationAsync(string lon, string lat)
        {
            try
            {
                ForecastResponseClient response = new ForecastResponseClient();
                string parameters = "forecast?lat=" + lat + "&lon=" + lon + "&units=" + _units + "&APPID=";
                ForecastResponseApi forecastResponseApi = ApiRequester.OpenWeatherApiCall(_baseUrl, parameters, _apikey, "GET");
                return LoadWeatherCol(response, forecastResponseApi);
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }

        private ForecastResponseClient LoadWeatherCol(ForecastResponseClient response, ForecastResponseApi forecastResponseApi)
        {
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

    }
}
