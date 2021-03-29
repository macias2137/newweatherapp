import react, { useState } from "react";
import DeleteButton from "./DeleteButton";

const CityPropList = (props) => {
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  return (
    <ul
      className="city_prop_list"
      onMouseEnter={() => setIsDeleteVisible(true)}
      onMouseLeave={() => setIsDeleteVisible(false)}
    >
      <li>{props.name}</li>
      <li>
        <div className="weather_image_container">
          <img
            src={`http://openweathermap.org/img/wn/${props.icon}@2x.png`}
            alt="pogoda"
          />
        </div>
      </li>
      <li>{Math.round(props.temp)}&#176;C</li>
      {isDeleteVisible && (
        <li>
          <DeleteButton id={props.id} onDeleteItem={props.onDeleteItem} />
        </li>
      )}
    </ul>
  );
};
export default CityPropList;
