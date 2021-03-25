import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Input from "./components/Input";
import MainCityContainer from "./components/MainCityContainer";
import DeleteButton from "./components/DeleteButton";

function App() {
  const [query, setQuery] = useState("");
  const [cityData, setCityData] = useState({ cityDataArray: [] });
  const [url, setUrl] = useState("perform new search");
  // const [queryList, setQueryList] = useState({ queryListArray: [] });

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

  let cityNameList = cityData.cityDataArray.map((city) =>
    city.name.toUpperCase()
  );

  let cityQueriedNameList = cityData.cityDataArray.map((city) =>
    city.queriedName.toUpperCase()
  );

  let cityIdList = cityData.cityDataArray.map((city) => city.id);

  useEffect(() => {
    //check if city is already shown (by returned name and queried name), fetch data
    const fetchData = async () => {
      if (
        url !== "perform new search" &&
        !cityNameList.includes(query) &&
        !cityQueriedNameList.includes(query)
      ) {
        const cityResponse = await axios(url);
        console.log(cityResponse);
        const neighborResponse = await axios(
          `http://api.openweathermap.org/data/2.5/find?lat=${cityResponse.data.coord.lat}&lon=${cityResponse.data.coord.lon}&cnt=10&units=metric&appid=0f93316aa7be9b531c476732c3bfbd9a&lang=pl`
        );
        console.log(neighborResponse);

        //check if city is already shown (by id) create new city object
        let newCity = [];
        if (
          cityIdList.length === 0 ||
          !cityIdList.includes(cityResponse.data.id)
        ) {
          newCity = [makeCityObject(cityResponse.data, query)];
          //newCity[0].id = cityResponse.data.id;
        } else {
          return;
        }
        console.log(newCity);
        //check neighbors object for queried city duplicates
        const filteredNeighbors = neighborResponse.data.list.filter(
          (neighbor) =>
            !neighbor.name.split(" ").includes(query) &&
            !neighbor.name.split(" ").includes(cityResponse.data.name)
        );

        // );
        //console.log(filteredNeighbors);
        newCity[0].neighbors = filteredNeighbors.map((neighbor) =>
          makeCityObject(neighbor, query)
        );

        console.log(newCity[0].neighbors);
        setCityData((prevState) => ({
          cityDataArray: prevState.cityDataArray.concat(newCity),
        }));
        setUrl("perform new search");
        //console.log(cityData.cityDataArray);
      }
    };
    fetchData();
  }, [url]);

  function handleDelete(num) {
    setCityData((prevData) => ({
      cityDataArray: prevData.cityDataArray.filter((city) => city.id !== num),
    }));
  }

  function resetQuery() {
    setQuery("");
  }

  // function checkForDuplicates(q) {
  //   queryList.queryListArray.includes(q)
  //     ? () => {
  //         setQueryList((prevState) => ({
  //           queryListArray: prevState.queryListArray.filter(
  //             (item) => q !== item
  //           ),
  //         }));
  //         setUrl(
  //           `http://api.openweathermap.org/data/2.5/weather?q=${q}&units=metric&appid=0f93316aa7be9b531c476732c3bfbd9a`
  //         );
  //       }
  //     : () => {
  //         setQueryList((prevState) => ({
  //           queryListArray: prevState.queryListArray.concat(q.split())
  //         }))}}

  return (
    <div>
      <Input value={query} onChange={(event) => setQuery(event.target.value)} />
      <button
        type="button"
        onClick={() => {
          // checkForDuplicates(query);
          setUrl(
            `http://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=0f93316aa7be9b531c476732c3bfbd9a&lang=pl`
          );
        }}
        // addToQueryList((prevState) => !queryListArray.includes(query) ?
        //   queryListArray: prevState.queryListArray.concat(query.split()),
        // ;
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
              <DeleteButton
                id={city.id}
                onDelete={handleDelete}
                resetQuery={resetQuery}
              />
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
