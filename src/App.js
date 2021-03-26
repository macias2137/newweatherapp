import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Input from "./components/Input";
import MainCityContainer from "./components/MainCityContainer";
import DeleteButton from "./components/DeleteButton";
import "./styles/app.sass";

function App() {
  const [query, setQuery] = useState("");
  const [cityData, setCityData] = useState({ cityDataArray: [] });
  const [url, setUrl] = useState("ready for new search");
  const [queryList, setQueryList] = useState({ queryListArray: [] });

  let cityNameList = cityData.cityDataArray.map((city) =>
    city.name.toUpperCase()
  );

  let cityQueriedNameList = cityData.cityDataArray.map((city) =>
    city.queriedName.toUpperCase()
  );

  let cityIdList = cityData.cityDataArray.map((city) => city.id);

  function makeCityObject(obj, query) {
    return {
      name: obj.name,
      queriedName: query,
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
    //check if city is already shown (by returned name and queried name), fetch data
    const fetchData = async () => {
      if (
        url !== "ready for new search" &&
        !cityNameList.includes(query.toUpperCase()) &&
        !cityQueriedNameList.includes(query.toUpperCase())
      ) {
        const cityResponse = await axios(url);
        const neighborResponse = await axios(
          `http://api.openweathermap.org/data/2.5/find?lat=${cityResponse.data.coord.lat}&lon=${cityResponse.data.coord.lon}&cnt=10&units=metric&lang=pl&appid=0f93316aa7be9b531c476732c3bfbd9a`
        );

        console.log(cityResponse);
        console.log(neighborResponse);

        //check if queried city is already shown (by id), create new city object
        let newCity = [];
        if (
          cityIdList.length === 0 ||
          !cityIdList.includes(cityResponse.data.id)
        ) {
          newCity = [makeCityObject(cityResponse.data, query)];
        } else {
          return;
        }
        console.log(newCity);

        //check queried neighbor cities for queried main city duplicates
        const filteredNeighbors = neighborResponse.data.list.filter(
          (neighbor) =>
            !neighbor.name.split(" ").includes(query) &&
            !neighbor.name.split(" ").includes(cityResponse.data.name)
        );

        const filteredNeighborNames = filteredNeighbors.map(
          (neighbor) => neighbor.name
        );
        console.log(filteredNeighborNames);

        //remove duplicates among queried neighbors if multiple stations
        const uniqueNeighborSet = [...new Set(filteredNeighborNames)];
        const uniqueNeighborNames = Array.from(uniqueNeighborSet);
        console.log(uniqueNeighborNames);

        const uniqueNeighborData = uniqueNeighborNames.map((name) =>
          filteredNeighbors.find((neighbor) => neighbor.name === name)
        );
        console.log(uniqueNeighborData);

        //assign "neighbors" object to main city object
        newCity[0].neighbors = uniqueNeighborData.map((neighbor) =>
          makeCityObject(neighbor, query)
        );
        console.log(newCity[0].neighbors);

        setCityData((prevState) => ({
          cityDataArray: prevState.cityDataArray.concat(newCity),
        }));
        setUrl("ready for new search");
      }
    };
    fetchData();
    console.log(cityData.cityDataArray);
  }, [url]);

  // alternative handleDelete function
  // function handleDelete(num) {
  //   setCityData((prevState) => ({
  //     cityDataArray: prevState.cityDataArray.filter((city) => city.id !== num),
  //   }));
  // }

  function handleDelete(num) {
    const cityDataArray = [...cityData.cityDataArray];
    setCityData({
      cityDataArray: cityDataArray.filter((city) => city.id !== num),
    });
    setUrl("ready for new search");
  }

  function addToQueryList(q) {
    setQueryList((prevState) => ({
      queryListArray: prevState.queryListArray.concat(q.split()),
    }));
    console.log(queryList);
  }

  return (
    <div>
      <Input value={query} onChange={(event) => setQuery(event.target.value)} />
      <button
        type="button"
        onClick={() => {
          addToQueryList(query);
          setUrl(
            `http://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&&lang=pl&appid=0f93316aa7be9b531c476732c3bfbd9a`
          );
        }}
      >
        Wyślij
      </button>
      <ul>
        {cityData.cityDataArray.length >= 1 ? (
          cityData.cityDataArray.map((city) => (
            <div>
              <MainCityContainer
                name={city.name}
                id={city.id}
                temp={city.temp}
                neighbors={city.neighbors}
              />
              <DeleteButton id={city.id} onDelete={handleDelete} />
            </div>
          ))
        ) : (
          <div>wpisz miasto</div>
        )}
      </ul>
    </div>
  );
}

export default App;
