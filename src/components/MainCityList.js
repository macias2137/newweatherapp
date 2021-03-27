import react from "react";
import MainCityContainer from "./MainCityContainer";
import DeleteButton from "./DeleteButton";

const MainCityList = (props) => (
  <ul className="main_city_list">
    {props.data.length >= 1 ? (
      props.data.map((city) => (
        <MainCityContainer
          name={city.name}
          id={city.id}
          temp={city.temp}
          icon={city.icon}
          neighbors={city.neighbors}
          onDeleteItem={props.onDeleteItem}
        />
      ))
    ) : (
      <li>wpisz miasto</li>
    )}
  </ul>
);

export default MainCityList;
