import React, { useState, useRef, useEffect } from "react";

const ImageCropView = ({
  src,
  containerWidth = 800,
  containerHeight = 400,
  isEditing,
}) => {
  const [position, setPosition] = useState({ y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const aspectRatio = image.width / image.height;
      let width = containerWidth;
      let height = containerWidth / aspectRatio;


      if (height < containerHeight) {
        height = containerHeight;
        width = containerHeight * aspectRatio;
      }

      setImageSize({ width, height });
      setPosition({ y: (containerHeight - height) / 2 });
    };
  }, [src, containerWidth, containerHeight]);

  const handleMouseDown = (e) => {
    if (!isEditing) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY - position.y);
  };

  const handleMouseMove = (e) => {
    if (!isEditing || !isDragging) {
      return;
    }

    const minY = containerHeight - imageSize.height;
    const maxY = 0;
    let newY = e.clientY - startY;
    newY = Math.min(maxY, Math.max(minY, newY));
    setPosition({ y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: containerWidth,
        height: containerHeight,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#f0f0f0",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <img
        ref={imageRef}
        src={src}
        style={{
          width: imageSize.width,
          height: imageSize.height,
          position: "absolute",
          left: "50%",
          transform: `translateX(-50%) translateY(${position.y}px)`,
          transition: isDragging ? "none" : "transform 0.1s ease",
          userSelect: "none",
          objectFit: "cover",
          pointerEvents: isEditing ? "auto" : "none", // Add this line
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        draggable={false}
      />
    </div>
  );
};

export default ImageCropView;
