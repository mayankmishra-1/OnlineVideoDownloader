import React from "react";

const FormatSelector = ({ formats, onSelectFormat }) => {
  return (
    <div className="dropdown">
      <button className="dropbtn">Select Format</button>
      <div className="dropdown-content">
        {formats.map((format) => (
          <div
            key={format.format}
            onClick={() => onSelectFormat(format.format)}
            className="dropdown-item"
          >
            {format.qualityLabel} - {format.container} - {format.type}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormatSelector;
