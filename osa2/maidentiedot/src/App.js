import React, { useState, useEffect } from 'react';
import axios from 'axios'

const Country = (props) => {
  const [showMore, setShowMore] = useState(false);
  const api_key = process.env.REACT_APP_API_KEY
  
  const [weather, setWeather] = useState({});

  const handleClick = () => {
    setShowMore(true);
  }



  const hook = () => {
    if (props.only === 1) {
      setShowMore(true);
    } 
  }

  const weatherHook = () => {
    const params = {
      access_key: api_key,
      query: props.country.capital
    }

    if (showMore) {
      axios.get('http://api.weatherstack.com/current', { params })
        .then(response => {

          
          const newWeather = {
            name: response.data.location.name,
            temperature: response.data.current.temperature,
            wind: response.data.current.wind_speed,
            weather_description: response.data.current.weather_descriptions[0],
            weather_icon: response.data.current.weather_icons[0]
          }

          console.log(newWeather)
          setWeather(newWeather);         
        }).catch(error => {
          console.log(error);
        });
    }

  }

  useEffect(hook);
  useEffect(weatherHook, [showMore]);

  return (
    <div>
      <p>{props.country.name}</p>
      {showMore
        ? <div>
          <p>Capital: {props.country.capital}</p>
          <p>Population: {props.country.population}</p>
          <img src={props.country.flag} alt={props.country.name} width={500} height={300} />
          <h2>Weather in {weather.name}</h2>
          <p>Temperature: {weather.temperature}</p>
          <img src={weather.weather_icon} alt={weather.weather_description} width={100} height={100} />
          <p>Wind: {weather.wind}</p>
          
        </div>
        : <div>
          <button onClick={handleClick}>Show</button>
        </div>
      }
    </div>
  )
}

const CountryList = (props) => {

  return (
    <div>
      <h2>Countries</h2>
      {props.countries.map((country) =>
        <Country key={country.name} country={country} only={props.countries.length} />
      )}

    </div>

  )
}

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [tooMany, setTooMany] = useState(false);

  const hook = () => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }

  useEffect(hook, []);

  const handleFilter = (event) => {
    const filtered = countries.filter(country => country.name.toLowerCase().includes(event.target.value.toLowerCase()));
    setFilteredCountries(filtered);
    if (filtered.length > 10) {
      setTooMany(true);
    } else {
      setTooMany(false);
    }
  }



  return (
    <div>
      <p>Find Countries: </p> <input onChange={handleFilter} />

      {tooMany
        ? <p>Too many results, please specify</p>
        : <CountryList countries={filteredCountries} />
      }

    </div>
  )

}

export default App;
