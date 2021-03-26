import react from "react";

const DeleteButton = (props) => {
  return (
    <button
      className="delete_button"
      onClick={() => {
        props.onDelete(props.id);
      }}
    >
      Usuń
    </button>
  );
};

export default DeleteButton;
