import react from "react";

const DeleteButton = (props) => {
  return <button onClick={props.onDelete(props.id)}>Usuń</button>;
};

export default DeleteButton;
