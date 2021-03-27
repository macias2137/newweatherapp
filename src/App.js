import React, { useState, useEffect } from "react";
import axios from "axios";
import Diacritic from "diacritic";
import "./App.css";
import Input from "./components/Input";
import MainCityContainer from "./components/MainCityContainer";
import DeleteButton from "./components/DeleteButton";
import SubmitButton from "./components/SubmitButton";
import MainCityList from "./components/MainCityList";
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
      nameWithNoDiacritics: Diacritic.clean(obj.name),
      queriedNameWithNoDiacritics: Diacritic.clean(query),
      id: obj.id,
      lat: obj.coord.lat,
      lon: obj.coord.lon,
      weather: obj.weather[0].main,
      icon: obj.weather[0].icon,
      temp: obj.main.temp,
      isNeighbor: false,
      neighbors: {},
    };
  }

  useEffect(() => {
    //check if city is already shown (by returned name and queried name), fetch data
    const fetchData = async () => {
      if (
        query !== "" &&
        url !== "ready for new search" &&
        !cityNameList
          .map((city) => Diacritic.clean(city))
          .includes(Diacritic.clean(query).toUpperCase()) &&
        !cityQueriedNameList
          .map((q) => Diacritic.clean(q))
          .includes(Diacritic.clean(query).toUpperCase())
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
            !neighbor.name
              .toUpperCase()
              .split(" ")
              .includes(newCity[0].name.toUpperCase()) &&
            !neighbor.name
              .toUpperCase()
              .split(" ")
              .includes(newCity[0].queriedName.toUpperCase()) &&
            !neighbor.name
              .toUpperCase()
              .split(" ")
              .includes(newCity[0].nameWithNoDiacritics.toUpperCase()) &&
            !neighbor.name
              .toUpperCase()
              .split(" ")
              .includes(newCity[0].queriedNameWithNoDiacritics.toUpperCase())
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
          filteredNeighbors.find(
            (neighbor) =>
              Diacritic.clean(neighbor.name) === Diacritic.clean(name)
          )
        );
        console.log(uniqueNeighborData);

        //assign "neighbors" object to main city object
        let neighbors = uniqueNeighborData.map((neighbor) =>
          makeCityObject(neighbor, query)
        );
        neighbors.map((neighbor) => (neighbor.isNeighbor = true));
        newCity[0].neighbors = neighbors;
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
    <div className="main_view">
      <div className="main_view_header">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <SubmitButton
          onClick={() => {
            addToQueryList(query);
            setUrl(
              `http://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&&lang=pl&appid=0f93316aa7be9b531c476732c3bfbd9a`
            );
          }}
        />
      </div>
      <MainCityList data={cityData.cityDataArray} onDeleteItem={handleDelete} />
    </div>
  );
}

export default App;
