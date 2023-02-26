import { useState, useEffect } from "react";
import Header from "./header";
import Image from "next/image";
import CityNameInput from "@/components/cityNameInput";
import TodayWeather from "./todayWeather";
import s from "../styles/main.module.css";

import { textAlign } from "@mui/system";

// TODO: CHANGE VARIABLES TO USE useState()
// TODO: VARIABLE IMAGE DEPENDING ON WEATHER

export default function Main() {
  //converts unix time to GMT
  function getCurrentHour(unixTime) {
    const gmtTime = new Date(unixTime * 1000);
    const hour = gmtTime.getHours();
    return hour;
  }

  //returns current time
  function currentTime() {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minutes}`;
  }

  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("Milan");
  const [backGroundColor, setBackGroundColor] = useState("");
  const [image, setImage] = useState("");

  function handleCityNameChange(newCityName) {
    setCityName(newCityName);
  }

  let apiCityName = cityName ? cityName : "Milan";

  let API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${apiCityName}&appid=9f83fc78fec54524b03472e33f9fdaf8&units=metric&lang=it`;

  async function fetchData() {
    const response = await fetch(API_URL);
    const data = await response.json();
    const name = data.city.name;
    const time = data.list[0].dt;
    const tempNow = data.list[0].main.temp;
    const weatherDescription = data.list[0].weather[0].description;
    console.log(weatherDescription);

    // const { speed } = data.wind;
    setWeatherData({ name, tempNow, time, weatherDescription });

    const currentHour = new Date(time * 1000).getHours();
    const dayTime = currentHour > 5 && currentHour < 19 ? true : false;

    switch (weatherDescription) {
      case "cielo sereno":
        dayTime ? setImage("DaySun") : setImage("NightMoon");
        break;
      case "pioggia moderata":
        dayTime ? setImage("DayRain") : setImage("NightRain");
        break;
      default:
        setImage("DaySun");
    }
  }

  const currentHour = new Date().getHours();
  let sunnyBackground = "linear-gradient(to top, #60efff, #0061ff)";
  let nightBackground = "linear-gradient(to bottom, #08203e, #557c93)";

  useEffect(() => {
    fetchData();
    // sets background based on hour of day
    if (currentHour > 5 && currentHour < 19) {
      setBackGroundColor(sunnyBackground);
    } else {
      setBackGroundColor(nightBackground);
    }
  }, [cityName]);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const location = weatherData.name;
  const tempNow = Math.round(weatherData.tempNow);
  const weatherDescription = weatherData.weatherDescription;
  const weatherDescriptionCapitalized =
    weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
  const currentHourMinute = currentTime();

  return (
    <div
      className={s.main}
      style={{
        backgroundImage: backGroundColor,
      }}
    >
      <Header>
        <CityNameInput onCityNameChange={handleCityNameChange} />
      </Header>
      <TodayWeather
        cityName={location}
        temp={tempNow}
        image={image}
        weatherDescription={weatherDescriptionCapitalized}
        currentHourMinute={currentHourMinute}
      />

      {/* <p>City: {weatherData.name}</p> */}
      {/* <p>Time: {currentTime()}</p> */}
      {/* <p>Temp: {Math.round(weatherData.tempNow)}</p> */}
    </div>
  );
}
