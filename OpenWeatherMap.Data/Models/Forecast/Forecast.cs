using System;
using System.Collections.Generic;

namespace OpenWeatherMap.Data.Models.Forecast
{
    public class Forecast
    {
        public int dt { get; set; }
        public Main main { get; set; }
        public List<Weather> weather { get; set; }
        public Clouds clouds { get; set; }
        public Wind wind { get; set; }
        public Sys sys { get; set; }
        public DateTime dt_txt { get; set; }
    }
}