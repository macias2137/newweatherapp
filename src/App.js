import React, { useState, useEffect } from "react";
import axios from "axios";
import Diacritic from "diacritic";
import "./App.css";
import InputSection from "./components/InputSection";
import MainCityList from "./components/MainCityList";
import "./styles/app.sass";

function App() {
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("ready for new search");
  const [cityData, setCityData] = useState({ cityDataArray: [] });
  const [timerCount, setTimerCount] = useState(30);

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
      isUpdated: false,
      updateSwitch: true,
      neighbors: {},
    };
  }

  function getNeighbors(response, city, query) {
    const filteredNeighbors = response.data.list.filter(
      (neighbor) =>
        !neighbor.name
          .toUpperCase()
          .split(" ")
          .includes(city.name.toUpperCase()) &&
        !neighbor.name
          .toUpperCase()
          .split(" ")
          .includes(city.queriedName.toUpperCase()) &&
        !neighbor.name
          .toUpperCase()
          .split(" ")
          .includes(city.nameWithNoDiacritics.toUpperCase()) &&
        !neighbor.name
          .toUpperCase()
          .split(" ")
          .includes(city.queriedNameWithNoDiacritics.toUpperCase())
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
        (neighbor) => Diacritic.clean(neighbor.name) === Diacritic.clean(name)
      )
    );
    console.log(uniqueNeighborData);

    //assign "neighbors" object to main city object
    let neighbors = uniqueNeighborData.map((neighbor) =>
      makeCityObject(neighbor, query)
    );
    neighbors.map((neighbor) => {
      neighbor.isNeighbor = true;
      neighbor.isUpdated = city.isUpdated;
    });

    city.neighbors = neighbors;
    console.log(city.neighbors);
  }

  useEffect(() => {
    let countdown = setInterval(() => {
      setTimerCount((count) => count - 1);
      timerCount === 0 && setTimerCount(30);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timerCount]);

  useEffect(() => {
    if (timerCount === 0 && cityIdList.length !== 0) {
      const fetchOnUpdate = async () => {
        for (let i = 0; i < cityIdList.length; i++) {
          const cityUpdateResponse = await axios(
            `http://api.openweathermap.org/data/2.5/weather?id=${cityIdList[i]}&units=metric&lang=pl&appid=0f93316aa7be9b531c476732c3bfbd9a`
          );
          const neighborUpdateResponse = await axios(
            `http://api.openweathermap.org/data/2.5/find?lat=${cityUpdateResponse.data.coord.lat}&lon=${cityUpdateResponse.data.coord.lon}&cnt=10&units=metric&lang=pl&appid=0f93316aa7be9b531c476732c3bfbd9a`
          );
          let newCityUpdate = [makeCityObject(cityUpdateResponse.data)];
          newCityUpdate[0].queriedName = cityData.cityDataArray.find(
            (city) => newCityUpdate[0].id === city.id
          ).queriedName;
          newCityUpdate[0].queriedNameWithNoDiacritics = cityData.cityDataArray.find(
            (city) => newCityUpdate[0].id === city.id
          ).queriedNameWithNoDiacritics;
          newCityUpdate[0].isUpdated = true;

          newCityUpdate[0].updateSwitch = !cityData.cityDataArray.find(
            (city) => city.id === newCityUpdate[0].id
          ).updateSwitch;
          getNeighbors(
            neighborUpdateResponse,
            newCityUpdate[0],
            newCityUpdate[0].query
          );
          for (let i = 0; i < newCityUpdate[0].neighbors.length; i++) {
            newCityUpdate[0].neighbors[i].queriedName =
              newCityUpdate[0].queriedName;
            newCityUpdate[0].neighbors[i].queriedNameWithNoDiacritics =
              newCityUpdate[0].queriedNameWithNoDiacritics;
          }
          console.log(newCityUpdate[0]);

          setCityData((prevState) => ({
            cityDataArray: prevState.cityDataArray.filter(
              (city) => city.id !== newCityUpdate[0].id
            ),
          }));
          setCityData((prevState) => ({
            cityDataArray: prevState.cityDataArray.concat(newCityUpdate[0]),
          }));
          console.log(cityData.cityDataArray);
        }
      };
      fetchOnUpdate();
    }
  }, [timerCount]);

  useEffect(() => {
    //check if city is already shown (by returned name and queried name), fetch data
    const fetchOnClick = async () => {
      if (
        (cityNameList.length === 0 && url !== "ready for new search") ||
        (query !== "" &&
          url !== "ready for new search" &&
          !cityNameList
            .map((city) => Diacritic.clean(city))
            .includes(Diacritic.clean(query).toUpperCase()) &&
          !cityQueriedNameList
            .map((q) => Diacritic.clean(q))
            .includes(Diacritic.clean(query).toUpperCase()))
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
        console.log(newCity[0]);

        getNeighbors(neighborResponse, newCity[0], query);
        setCityData((prevState) => ({
          cityDataArray: prevState.cityDataArray.concat(newCity),
        }));
        setUrl("ready for new search");
      }
    };
    fetchOnClick();
    console.log(cityData.cityDataArray);
  }, [url]);

  function handleDelete(num) {
    const cityDataArray = [...cityData.cityDataArray];
    setCityData({
      cityDataArray: cityDataArray.filter((city) => city.id !== num),
    });
    setUrl("ready for new search");
  }

  return (
    <div className="main_view">
      <div className="main_view_header">
        <InputSection
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onSubmit={() => {
            setUrl(
              `http://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&&lang=pl&appid=0f93316aa7be9b531c476732c3bfbd9a`
            );
          }}
        />
      </div>
      <h1>{timerCount}</h1>
      <MainCityList data={cityData.cityDataArray} onDeleteItem={handleDelete} />
    </div>
  );
}

export default App;
