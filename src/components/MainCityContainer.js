import react, { useState } from "react";
import NeighborCityList from "./NeighborCityList";
import MainCityTile from "./MainCityTile";

export default function MainCityContainer(props) {
  const [isNeighborListVisible, toggleIsNeighborListVisible] = useState(false);
  return (
    <li className="main_city_container">
      <MainCityTile
        name={props.name}
        id={props.id}
        temp={props.temp}
        icon={props.icon}
        onDeleteItem={props.onDeleteItem}
        neighborListVisible={() =>
          toggleIsNeighborListVisible(!isNeighborListVisible)
        }
      />

      {isNeighborListVisible && (
        <NeighborCityList neighbors={props.neighbors} />
      )}
    </li>
  );
}
