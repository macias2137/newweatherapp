import React from "react";

const Input = (props) => (
  <form id="input">
    <label className="city_input_label" for="input">
      Wpisz nazwę miasta
    </label>
    <input
      className="city_input"
      type="text"
      value={props.value}
      onChange={props.onChange}
    />
  </form>
);

export default Input;
