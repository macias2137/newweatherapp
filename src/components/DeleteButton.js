import react from "react";

const DeleteButton = (props) => {
  return (
    <button
      onClick={() => {
        props.onDelete(props.id);
        props.resetQuery();
      }}
    >
      Usuń
    </button>
  );
};

export default DeleteButton;
