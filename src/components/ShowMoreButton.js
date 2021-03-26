import react from "react";

const ShowMoreButton = (props) => {
  return (
    <button className="show_more_button" onClick={props.toggleSecondary}>
      Pokaż więcej
    </button>
  );
};
export default ShowMoreButton;
