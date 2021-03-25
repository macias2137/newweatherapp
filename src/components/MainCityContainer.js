import react, { useState } from "react";
import SecondaryCityContainer from "./SecondaryCityContainer";
// import DeleteButton from "./DeleteButton";

export default function MainCityContainer(props) {
  const [isSecondaryVisible, toggleSecondaryVisible] = useState(false);
  return (
    <li>
      <ul>
        <li>{props.name}</li>
        <li>{props.id}</li>
        <li>{props.temp}</li>
      </ul>
      <button onClick={() => toggleSecondaryVisible(!isSecondaryVisible)}>
        Pokaż więcej{" "}
      </button>

      {isSecondaryVisible && (
        <SecondaryCityContainer neighbors={props.neighbors} />
      )}
    </li>
  );
}
