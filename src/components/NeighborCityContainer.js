import react from "react";
import CityItem from "./CityItem";

const NeighborCityContainer = (props) => (
  <div className="neighbor_city_container">
    <ul className="neighbor_city_list">
      {props.neighbors.map((neighbor) => (
        <CityItem
          name={neighbor.name}
          id={neighbor.id}
          temp={neighbor.temp}
          icon={neighbor.icon}
        />
      ))}
    </ul>
  </div>
);
export default NeighborCityContainer;
