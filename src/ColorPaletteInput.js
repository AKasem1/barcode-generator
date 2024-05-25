import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

const ColorPaletteInput = ({ value, onChange }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (color) => {
    onChange(color.hex);
  };

  return (
    <div>
    <h3 className='pickColorTag'>Pick a color..</h3>
      <div
        className="color-preview"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: value,
          cursor: 'pointer',
        }}
        onClick={() => setShowColorPicker(!showColorPicker)}
      />
      {showColorPicker && (
        <div className="color-picker">
          <ChromePicker color={value} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPaletteInput;
