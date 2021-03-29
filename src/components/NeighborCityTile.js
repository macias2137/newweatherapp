import react, { useState } from "react";
import CityPropList from "./CityPropList";

const NeighborCityTile = (props) => {
  //const [isNeighborVisible, toggleIsNeighborVisible] = useState(true);
  return (
    <li className="neighbor_city_tile">
      {
        <CityPropList
          name={props.name}
          id={props.id}
          temp={props.temp}
          icon={props.icon}
        />
      }
    </li>
  );
};

export default NeighborCityTile;
