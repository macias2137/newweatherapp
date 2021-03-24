import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Input from "./components/Input";
import MainCityContainer from "./components/MainCityContainer";
import DeleteButton from "./components/DeleteButton";

function App() {
  const [query, setQuery] = useState("");
  const [cityData, setCityData] = useState({ cityDataArray: [] });
  const [url, setUrl] = useState(
    `http://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=0f93316aa7be9b531c476732c3bfbd9a`
  );

  function makeCityObject(obj) {
    return {
      name: obj.name,
      id: obj.id,
      lat: obj.coord.lat,
      lon: obj.coord.lon,
      weather: obj.weather[0].main,
      icon: obj.weather[0].icon,
      temp: obj.main.temp,
      neighbors: {},
    };
  }

  useEffect(() => {
    const fetchData = async () => {
      const cityResponse = await axios(url);
      console.log(cityResponse);
      const neighborResponse = await axios(
        `http://api.openweathermap.org/data/2.5/find?lat=${cityResponse.data.coord.lat}&lon=${cityResponse.data.coord.lon}&cnt=10&units=metric&appid=0f93316aa7be9b531c476732c3bfbd9a`
      );
      console.log(neighborResponse);

      let newCity = makeCityObject(cityResponse.data);
      const filteredNeighbors = neighborResponse.data.list.filter(
        (neighbor) => !neighbor.name.split(" ").includes(query)
      );
      console.log(filteredNeighbors);
      newCity.neighbors = filteredNeighbors.map((neighbor) =>
        makeCityObject(neighbor)
      );
      const cityDataArray = cityData.cityDataArray;
      cityDataArray.push(newCity);
      setCityData({ cityDataArray: cityDataArray });
      console.log(cityData.cityDataArray);
    };
    fetchData();
  }, [url]);

  function handleDelete(num) {
    const citiesAfterRemove = cityData.cityDataArray.filter(
      (city) => city.id !== num
    );
    setCityData({ cityDataArray: citiesAfterRemove });
  }

  return (
    <div>
      <Input value={query} onChange={(event) => setQuery(event.target.value)} />
      <button
        type="button"
        onClick={() =>
          setUrl(
            `http://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=0f93316aa7be9b531c476732c3bfbd9a`
          )
        }
      >
        Wyślij
      </button>
      <ul>
        {cityData.cityDataArray.map((city) => (
          <div>
            <MainCityContainer
              name={city.name}
              id={city.id}
              temp={city.temp}
              neighbors={city.neighbors}
            />
            <DeleteButton id={city.id} onDelete={handleDelete} />
          </div>
        ))}
      </ul>

      {/* {this.state.cityInfo && (
          <div>
            {this.state.cityInfo.map((city) => (
              <p id={city.id} key={city.name}>
                {city.name}
              </p>
            ))}
          </div>
        )}
        <button onDelete={this.handleDelete}>Kasuj</button> */}
    </div>
  );
}

export default App;
