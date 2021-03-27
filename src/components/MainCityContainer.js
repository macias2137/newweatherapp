import react, { useState } from "react";
import NeighborCityList from "./NeighborCityList";
import ShowMoreButton from "./ShowMoreButton";
import CityItem from "./CityItem";

export default function MainCityContainer(props) {
  const [isSecondaryVisible, toggleSecondaryVisible] = useState(false);
  return (
    <li className="main_city_container">
      <div>
        <CityItem
          name={props.name}
          id={props.id}
          temp={props.temp}
          icon={props.icon}
          onDeleteItem={props.onDeleteItem}
        />
      </div>
      <ShowMoreButton
        toggleSecondary={() => toggleSecondaryVisible(!isSecondaryVisible)}
      />
      {isSecondaryVisible && <NeighborCityList neighbors={props.neighbors} />}
    </li>
  );
}
