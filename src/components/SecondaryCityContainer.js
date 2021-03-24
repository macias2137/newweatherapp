import react, { useState } from "react";

export default function SecondaryCityContainer(props) {
  return (
    <div>
      <ul>
        {props.neighbors.map((neighbor) => {
          return <li>{neighbor.name}</li>;
        })}
      </ul>
    </div>
  );
}
