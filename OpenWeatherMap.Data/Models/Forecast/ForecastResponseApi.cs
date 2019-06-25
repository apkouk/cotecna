using System.Collections.Generic;
using System.Runtime.Serialization;

namespace OpenWeatherMap.Data.Models.Forecast
{
    [DataContract]
    public class ForecastResponseApi
    {
        [DataMember]
        public string cod { get; set; }
        [DataMember]
        public double message { get; set; }
        [DataMember]
        public int cnt { get; set; }
        [DataMember]
        public List<Forecast> list { get; set; }
        [DataMember]
        public City.City city { get; set; }
    }
}