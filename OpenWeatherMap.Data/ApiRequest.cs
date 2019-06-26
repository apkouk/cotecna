using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Newtonsoft.Json;
using OpenWeatherMap.Data.Models.Forecast;

namespace OpenWeatherMap.Data
{
    public static class ApiRequester
    {
        public static ForecastResponseApi OpenWeatherApiCall(string baseUrl, string parameters, string apikey, string method)
        {
            WebRequest req = WebRequest.Create(baseUrl + parameters + apikey);
            req.Method =  method;
            req.Headers.Add(HttpRequestHeader.Accept, "application/json");

            Task<WebResponse> resp = req.GetResponseAsync();
            StreamReader sr = new StreamReader(resp.Result.GetResponseStream() ?? throw new InvalidOperationException());

            string json = sr.ReadToEnd();
            return JsonConvert.DeserializeObject<ForecastResponseApi>(json);
        }
    }
}