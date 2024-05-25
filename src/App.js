import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import GeneratorComponent from './GeneratorComponent';
import ColorPaletteInput from './ColorPaletteInput';
import JSZip from 'jszip';
import JsBarcode from 'jsbarcode';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [countValue, setCountValue] = useState(0);
  const [color, setColor] = useState('#000');
  const [submitted, setSubmitted] = useState(false);
  const [zip, setZip] = useState(null);

  const handleColorChange = (newColor) => {
    setColor(newColor);
  }
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleCountChange = (event) => {
    setCountValue(parseInt(event.target.value));
  };

  const handleGenerateClick = () => {
    setSubmitted(true);
    const newZip = new JSZip();
    setZip(newZip);
  };
  useEffect(() => {
    // Generate and add barcode images to zip
    if (zip && submitted) {
      const promises = [];
      for (let i = 0; i < countValue; i++) {
        promises.push(
          new Promise((resolve) => {
            const barcodeValue = `${inputValue}${i + 1}`;
            const canvas = document.createElement('canvas');
            JsBarcode(canvas, barcodeValue, {
              format: "CODE128",
              lineColor: color,
              width: 4,
              height: 40, 
              displayValue: true,
              margin: 10,
              background: "#ffffff",
              min: 0,
            });
            canvas.toBlob((blob) => {
              zip.file(`barcode${i + 1}.jpg`, blob);
              resolve();
            }, 'image/jpeg');
          })
        );
      }
      Promise.all(promises).then(() => {
        // After all barcodes are added, initiate download
        zip.generateAsync({ type: 'blob' }).then((content) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = 'barcodes.zip';
          document.body.appendChild(link);
          link.click();
        });
      });
    }
  }, [zip, inputValue, countValue, color, submitted]);

  return (
    <div className="App">
      <h1>Barcode Generator</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Start Value.."
        />
      </div>
      <div className="input-container">
        <input
          type="number"
          value={countValue}
          onChange={handleCountChange}
          placeholder="Number of codes.."
        />
      </div>
      <div className="color-picker-container">
        <ColorPaletteInput value={color} onChange={handleColorChange} />
      </div>
      <button className="generate-button" onClick={handleGenerateClick}>Generate</button>
      
      {submitted && Array.from({ length: countValue }, (_, index) => (
        <GeneratorComponent key={index} values={[`${inputValue}${index + 1}`, color, inputValue]} />
      ))}
      {zip && submitted && <h2 className='success'>Generated Successfully</h2>}
    </div>
  );
}

export default App;
