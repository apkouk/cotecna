using System.Collections.Generic;
using System.Runtime.Serialization;
namespace OpenWeatherMap.Data.Models.Forecast
{
    [DataContract]
    public class ForecastResponseClient
    {
        [DataMember]
        public List<CalendarForecast> weather = new List<CalendarForecast>();
        [DataMember]
        public City.City city { get; set; }
    }
}