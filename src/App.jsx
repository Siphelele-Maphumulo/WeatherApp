import "./App.css";
import { useState, useEffect } from "react";
import sun from "./assets/sun.png";
import snow from "./assets/snow.png";
import rain from "./assets/rain.png";
import cloudy from "./assets/cloudy.png";
import wind from "./assets/wind.png";
import { FaWind, FaCloud, FaSearch } from "react-icons/fa";

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;

  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Durban"); // ✅ Default city
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Automatically fetch Durban weather when the app loads
  useEffect(() => {
    getWeatherForCity("Durban");
  }, []);

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <img className="weather-icon" src={sun} alt="sun" />;
      case "clouds":
        return <img className="weather-icon" src={cloudy} alt="cloudy" />;
      case "rain":
        return <img className="weather-icon" src={rain} alt="rain" />;
      case "snow":
        return <img className="weather-icon" src={snow} alt="snow" />;
      case "wind":
        return <img className="weather-icon" src={wind} alt="wind" />;
      default:
        return <FaCloud className="text-6xl text-blue-100" />;
    }
  };

  const getWeatherForCity = async (cityName) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      if (response.ok) {
        const data = await response.json();
        setWeather(data);
      } else {
        throw new Error("City not found");
      }
    } catch (error) {
      setError(error.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeatherForCity(city);
  };

  return (
    <div className="bg-gradient-to-br from-blue-300 to-blue-800 h-screen flex justify-center items-center px-2">
      <div className="backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100/40 h-auto p-4 rounded-lg lg:w-3/5 md:w-4/5 w-full grid gap-3 shadow-lg">
        <h1 className="text-xl font-bold text-blue-800 text-center">
          Weather App
        </h1>

        <form onSubmit={handleSubmit} className="search-box flex flex-row">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            type="text"
            placeholder="Enter city name..."
            className="p-3 w-full bg-white border-0 focus:outline-none focus:ring-0 rounded-l-md"
          />
          <button
            type="submit"
            className="p-3 px-6 bg-blue-800 border-none text-white font-bold hover:bg-blue-900 flex items-center gap-2 rounded-r-md"
          >
            <FaSearch />
          </button>
        </form>

        {loading && (
          <p className="text-blue-800 text-center font-bold">Loading...</p>
        )}

        {error && <p className="error text-white text-center">{error}</p>}

        {weather && (
          <div className="weather-info rounded-lg flex flex-col gap-5 mt-10">
            <h2 className="weather-main text-blue-800 text-lg font-bold text-center p-4 bg-gray-200/20 rounded">
              {weather.name}, {weather.sys.country}
            </h2>

            <div className="weather-main text-white flex flex-col gap-6 font-bold justify-between items-center">
              <span className="text-9xl">
                {getWeatherIcon(weather.weather[0].main)}
              </span>
              <span className="temp text-6xl">
                {Math.round(weather.main.temp)}°C
              </span>
            </div>

            <div className="details flex items-center justify-around text-white">
              <FaWind />
              <span>{weather.wind.speed} m/s</span>
              <FaCloud />
              <p className="description capitalize">
                {weather.weather[0].description}
              </p>
              <span>{weather.clouds.all}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
