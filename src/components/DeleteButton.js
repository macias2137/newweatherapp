import react from "react";

const DeleteButton = (props) => {
  return (
    <button
      className="delete_button"
      onClick={props.onDeleteItem}
      // onMouseEnter={props.onMouseEnter}
      // onMouseLeave={props.onMouseLeave}
    ></button>
  );
};

export default DeleteButton;
