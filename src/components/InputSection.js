import React from "react";
import SubmitButton from "./SubmitButton";

const InputSection = (props) => (
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
    <SubmitButton onClick={props.onSubmit} />
  </form>
);

export default InputSection;
