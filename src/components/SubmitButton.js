import react from "react";

const SubmitButton = (props) => {
  return (
    <button className="submit_button" type="button" onClick={props.onClick}>
      Wyślij
    </button>
  );
};

export default SubmitButton;
