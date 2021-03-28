import react, { useState } from "react";
import CityItem from "./CityItem";

const NeighborCityList = (props) => {
  return (
    <ul className="neighbor_city_list">
      {props.neighbors.map((neighbor) => (
        <CityItem
          name={neighbor.name}
          id={neighbor.id}
          temp={neighbor.temp}
          icon={neighbor.icon}
        />
      ))}
      )
    </ul>
  );
};

export default NeighborCityList;
