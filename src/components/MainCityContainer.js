import react, { useState } from "react";
import SecondaryCityContainer from "./SecondaryCityContainer";
import ShowMoreButton from "./ShowMoreButton";

export default function MainCityContainer(props) {
  const [isSecondaryVisible, toggleSecondaryVisible] = useState(false);
  return (
    <li>
      <ul>
        <li>{props.name}</li>
        <li>{props.id}</li>
        <li>{props.temp}</li>
      </ul>
      <ShowMoreButton
        toggleSecondary={() => toggleSecondaryVisible(!isSecondaryVisible)}
      />
      {isSecondaryVisible && (
        <SecondaryCityContainer neighbors={props.neighbors} />
      )}
    </li>
  );
}
