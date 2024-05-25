import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const GeneratorComponent = ({ values: [barcodeValue, color], fileName, zip }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (barcodeValue && canvasRef.current) { // Check if barcodeValue is not empty
      JsBarcode(canvasRef.current, barcodeValue, {
        format: "CODE128",
        lineColor: color,
        width: 4,
        height: 40, 
        displayValue: true,
        margin: 10,
        background: "#ffffff",
        min: 0,
      });
    }
  }, [barcodeValue, color]);

  useEffect(() => {
    // Generate and add barcode image to zip
    if (barcodeValue && canvasRef.current && zip) { // Check if barcodeValue is not empty
      const dataURL = canvasRef.current.toDataURL("image/jpeg");
      zip.file(`${fileName || 'barcode'}.jpg`, dataURL.split(',')[1], { base64: true });
    }
  }, [barcodeValue, color, fileName, zip]);

  return (
    <div>

    </div>
  );
};

export default GeneratorComponent;
