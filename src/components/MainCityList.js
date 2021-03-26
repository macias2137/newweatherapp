import react from "react";
import MainCityContainer from "./MainCityContainer";
import DeleteButton from "./DeleteButton";

const MainCityList = (props) => (
  <ul className="main_city_list">
    {props.data.length >= 1 ? (
      props.data.map((city) => (
        <li>
          <ul className="city_container_list">
            <MainCityContainer
              name={city.name}
              id={city.id}
              temp={city.temp}
              icon={city.icon}
              neighbors={city.neighbors}
            />
          </ul>
          <DeleteButton id={city.id} onDeleteItem={props.onDeleteItem} />
        </li>
      ))
    ) : (
      <div>wpisz miasto</div>
    )}
  </ul>
);

export default MainCityList;
