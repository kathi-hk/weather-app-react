import React, { useState } from "react";
import axios from "axios";
import Weather from "./Weather";
import "./searchForm.css";

export default function SearchForm(props) {
  const [info, setInfo] = useState({ loaded: false });
  const [city, setCity] = useState(props.defaultCity);

  function showInfo(response) {
    setInfo({
      loaded: true,
      city: response.data.name,
      country: response.data.sys.country,
      date: new Date(response.data.dt * 1000),
      temp: Math.round(response.data.main.temp),
      tempMin: Math.round(response.data.main.temp_min),
      tempMax: Math.round(response.data.main.temp_max),
      icon: response.data.weather[0].icon,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      wind: Math.round(response.data.wind.speed * 3.6),
      clouds: response.data.clouds.all,
      coordinates: response.data.coord,
    });
  }

  function updateCity(event) {
    setCity(event.target.value);
  }

  function search() {
    let apiKey = "3b805b8ea6935d84ecc7cdd3c562894e";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(url).then(showInfo);
  }

  function handleSubmit(event) {
    event.preventDefault();
    search();
  }

  function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiKey = "3b805b8ea6935d84ecc7cdd3c562894e";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(showInfo);
    let reverseApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    axios.get(reverseApiUrl).then(updateCity);
  }

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert(
        "Sorry, we couldn't find your current position. Please type your city, instead."
      );
    }
  }

  if (info.loaded) {
    return (
      <div className="SearchForm">
        <span>
          <form onSubmit={handleSubmit}>
            <input
              type="search"
              placeholder="Enter a city"
              className="form-control search-bar"
              autoFocus="on"
              onChange={updateCity}
            />
            <input type="submit" value="Search" className="btn" />
          </form>
          <button className="btn" onClick={getCurrentLocation}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-geo-alt"
              viewBox="0 0 16 16"
            >
              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
          </button>
        </span>
        <Weather data={info} />
      </div>
    );
  } else {
    search();
    return "The App is loading";
  }
}
