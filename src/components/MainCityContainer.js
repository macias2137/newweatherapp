import react, { useState } from "react";
import NeighborCityContainer from "./NeighborCityContainer";
import ShowMoreButton from "./ShowMoreButton";
import CityItem from "./CityItem";

export default function MainCityContainer(props) {
  const [isSecondaryVisible, toggleSecondaryVisible] = useState(false);
  return (
    <li className="main_city_container">
      <CityItem
        name={props.name}
        id={props.id}
        temp={props.temp}
        icon={props.icon}
      />

      <ShowMoreButton
        toggleSecondary={() => toggleSecondaryVisible(!isSecondaryVisible)}
      />
      {isSecondaryVisible && (
        <NeighborCityContainer neighbors={props.neighbors} />
      )}
    </li>
  );
}
