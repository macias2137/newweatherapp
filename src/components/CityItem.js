import react from "react";
import DeleteButton from "./DeleteButton";

const CityItem = (props) => (
  <div className="city_item">
    <ul className="city_prop_list">
      <li>{props.name}</li>
      <li>
        <img
          src={`http://openweathermap.org/img/wn/${props.icon}@2x.png`}
          alt="pogoda"
        />
      </li>
      <li>{Math.round(props.temp)}&#176;C</li>
      <DeleteButton id={props.id} onDeleteItem={props.onDeleteItem} />
    </ul>
  </div>
);
export default CityItem;
