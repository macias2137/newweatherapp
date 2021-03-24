import React from "react";

const Input = (props) => (
  <form>
    <label>Wpisz nazwę miasta</label>
    <input type="text" value={props.value} onChange={props.onChange} />
  </form>
);

export default Input;
