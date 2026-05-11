import React from "react";

const FormGroup = ({ placeholder, value, onChange }) => {
  return (
    <div>
      <input
        value={value}
        onChange={onChange}
        type="text"
        placeholder={placeholder}
        className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default FormGroup;
