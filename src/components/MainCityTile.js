import react from "react";
import CityPropList from "./CityPropList";

const MainCityTile = (props) => (
  <div className="main_city_tile" onClick={props.neighborListVisible}>
    <CityPropList
      name={props.name}
      id={props.id}
      temp={props.temp}
      icon={props.icon}
      onDeleteItem={() => {
        props.onDeleteItem(props.id);
      }}
    />
  </div>
);

export default MainCityTile;
