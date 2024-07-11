import React from "react";

const FormatSelector = ({ formats, onSelectFormat }) => {
  return (
    <div className="format-list">
      {formats.map((format) => (
        <div key={format.format} className="format-item">
          <h3>{format.qualityLabel}</h3>
          <p>
            <strong>Format Type:{format.type}</strong>
          </p>
          <p>
            <strong>Container:</strong> {format.container}
          </p>
          <p>
            <strong>Size:</strong> {format.size}
          </p>
          <button
            onClick={() => onSelectFormat(format.format)}
            className="btn-download"
          >
            Download
          </button>
        </div>
      ))}
    </div>
  );
};

export default FormatSelector;
