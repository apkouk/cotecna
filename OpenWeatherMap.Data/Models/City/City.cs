using System.Runtime.Serialization;

namespace OpenWeatherMap.Data.Models.City
{
    [DataContract]
    public class City
    {
        [DataMember]
        public int id { get; set; }
        [DataMember]
        public string name { get; set; }
        [DataMember]
        public string country { get; set; }
        [DataMember]
        public Coord coord { get; set; }
    }
}