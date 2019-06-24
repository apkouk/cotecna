using System;

namespace OpenWeatherMap.Data.Models.Forecast
{
    public class CalendarForecast
    {
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
        public string Main { get; set; }
        public decimal Temperature { get; set; }
    }
}