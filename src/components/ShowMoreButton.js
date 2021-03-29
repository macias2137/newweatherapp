import react from "react";

const ShowMoreButton = (props) => {
  return (
    <button className="show_more_button" onClick={props.neighborListVisible}>
      Pokaż więcej
    </button>
  );
};
export default ShowMoreButton;
