import react from "react";

const CityItem = (props) => (
  <li className="city_item">
    <ul className="city_item_list">
      <li>{props.name}</li>
      <li>{props.icon}</li>
      <li>{props.temp}</li>
    </ul>
  </li>
);
export default CityItem;
