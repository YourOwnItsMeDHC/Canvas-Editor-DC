import React, { useState, useRef, useEffect } from "react";

const CanvasEditor = ({ templateData }) => {
  const canvasRef = useRef(null);
  const [captionText, setCaptionText] = useState(templateData.caption.text);
  const [ctaText, setCtaText] = useState(templateData.cta.text);
  const [bgColor, setBgColor] = useState("#0369A1");
  const [colorHistory, setColorHistory] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = templateData.urls.mask + "?random=" + Math.random();

    image.onload = () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pattern = new Image();
      pattern.src =
        templateData.urls.design_pattern + "?random=" + Math.random();
      pattern.onload = () => {
        ctx.drawImage(pattern, 0, 0, canvas.width, canvas.height);

        ctx.drawImage(
          image,
          templateData.image_mask.x,
          templateData.image_mask.y,
          templateData.image_mask.width,
          templateData.image_mask.height
        );

        const stroke = new Image();
        stroke.src = templateData.urls.stroke + "?random=" + Math.random();
        stroke.onload = () => {
          ctx.drawImage(
            stroke,
            templateData.image_mask.x,
            templateData.image_mask.y,
            templateData.image_mask.width,
            templateData.image_mask.height
          );

          ctx.fillStyle = templateData.caption.text_color;
          ctx.font = `${Math.floor(
            templateData.caption.font_size * 0.5
          )}px Arial`;
          const lines = getLines(
            ctx,
            captionText,
            templateData.caption.max_characters_per_line
          );
          let xPos = templateData.caption.position.x;
          let yPos = templateData.caption.position.y;
          lines.forEach((line) => {
            ctx.fillText(line, xPos, yPos);
            yPos += templateData.caption.font_size * 0.5 + 5;
          });

          const ctaWidth = 100;
          const ctaHeight = 25;
          ctx.fillStyle = templateData.cta.background_color;
          ctx.fillRect(
            templateData.cta.position.x,
            templateData.cta.position.y,
            ctaWidth,
            ctaHeight
          );

          ctx.fillStyle = templateData.cta.text_color;
          ctx.font = `${
            Math.floor(templateData.cta.font_size * 0.5) || 15
          }px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            ctaText,
            templateData.cta.position.x + ctaWidth / 2,
            templateData.cta.position.y + ctaHeight / 2
          );
        };
      };
    };
  }, [captionText, ctaText, bgColor]);

  const getLines = (ctx, text, maxCharsPerLine) => {
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";
    words.forEach((word) => {
      if ((currentLine + word).length > maxCharsPerLine) {
        lines.push(currentLine);
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    });
    lines.push(currentLine.trim());
    return lines;
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setColorHistory((prevColors) => {
      const updatedColors = [color, ...prevColors.filter((c) => c !== color)];
      return updatedColors.slice(0, 5);
    });
    setBgColor(color);
  };

  const handlePickerToggle = () => {
    setShowPicker(!showPicker);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <canvas
        ref={canvasRef}
        height={400}
        width={400}
        style={{
          display: "block",
          margin: "0 auto",
          border: "1px solid black",
        }}
      ></canvas>
      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label>Background Color: </label>
          {colorHistory.map((color, index) => (
            <div
              key={index}
              onClick={() => handleColorChange(color)}
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: color,
                marginRight: "5px",
                cursor: "pointer",
              }}
            ></div>
          ))}
          <button onClick={handlePickerToggle}>+</button>
        </div>
        {showPicker && (
          <div style={{ position: "relative", marginTop: "10px" }}>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
            />
          </div>
        )}
      </div>
      <div style={{ marginTop: "10px" }}>
        {" "}
        <label>Caption Text: </label>
        <input
          type="text"
          value={captionText}
          onChange={(e) => setCaptionText(e.target.value)}
        />
      </div>
      <div style={{ marginTop: "5px" }}>
        {" "}
        <label>CTA Text: </label>
        <input
          type="text"
          value={ctaText}
          onChange={(e) => setCtaText(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CanvasEditor;
