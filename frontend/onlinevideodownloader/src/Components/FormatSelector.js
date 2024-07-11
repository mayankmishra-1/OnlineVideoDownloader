import React from "react";

const FormatSelector = ({ formats, onSelectFormat, thumbnail, title }) => {
  return (
    <div className="format-selector">
      <div className="video-info">
        <img src={thumbnail} alt={title} />
        <h3>{title}</h3>
      </div>
      <div className="format-list">
        {formats.map((format) => (
          <div key={format.format} className="format-item">
            <h3>{format.qualityLabel}</h3>
            <p>
              <strong>Format Type: {format.type}</strong>
            </p>
            <p>
              <strong>Container: </strong> {format.container}
            </p>
            <p>
              <strong>Size: </strong> {format.size}
            </p>
            <button
              onClick={() => onSelectFormat(format)}
              className="btn-download"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormatSelector;
