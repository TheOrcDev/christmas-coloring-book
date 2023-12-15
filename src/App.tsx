import { useEffect, useRef, useState } from "react";
import "./App.css";

type BrushElement = {
  x: number;
  y: number;
  color: string;
  size: number;
};

const backgrounds = ["book", "gift-sweater", "house-cookie", "snowman", "tree"];

// Canvas
// Draw function
// Undo
// Redo
// Change background
// Settings (brush size, colors)
// Style it Christmasy

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState<BrushElement[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [undoedDrawings, setUndoedDrawings] = useState<BrushElement[]>([]);

  const [background, setBackground] = useState<string>("book");
  const [color, setColor] = useState<string>("#242424");
  const [brushSize, setBrushSize] = useState<number>(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements on canvas
    drawing.forEach((element) => {
      drawElement(element, context);
    });
  });

  const drawElement = (
    element: BrushElement,
    context: CanvasRenderingContext2D
  ) => {
    context.beginPath();
    context.arc(element.x, element.y, element.size / 2, 0, Math.PI * 2);
    context.fillStyle = element.color;
    context.fill();
    context.closePath();
  };

  const handleUndo = () => {
    const newDrawings = [...drawing];
    const newUndoedDrawing = newDrawings.pop();
    if (!newUndoedDrawing) return;
    setUndoedDrawings([...undoedDrawings, newUndoedDrawing]);
    setDrawing(newDrawings);
  };

  const handleRedo = () => {
    const newUndoedDrawings = [...undoedDrawings];
    const newDrawings = newUndoedDrawings.pop();
    if (!newDrawings) return;
    setDrawing([...drawing, newDrawings]);
    setUndoedDrawings(newUndoedDrawings);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setIsDrawing(true);

    const brushElement = {
      x: offsetX,
      y: offsetY,
      color: color,
      size: brushSize,
    };

    setDrawing([...drawing, brushElement]);
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (isDrawing) {
      const { offsetX, offsetY } = event.nativeEvent;

      const brushElement = {
        x: offsetX,
        y: offsetY,
        color: color,
        size: brushSize,
      };

      setDrawing([...drawing, brushElement]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const changeBackground = () => {
    const currentBackgroundIndex = backgrounds.findIndex(
      (b: string) => b === background
    );

    if (backgrounds[currentBackgroundIndex + 1]) {
      setBackground(backgrounds[currentBackgroundIndex + 1]);
    } else {
      setBackground(backgrounds[0]);
    }
  };

  const clear = () => {
    setDrawing([]);
  };

  return (
    <>
      <canvas
        width={800}
        height={600}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="drawing-board"
        style={{ background: `url(/backgrounds/${background}.png)` }}
      />
      <div className="festive-tools">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="range"
          min={1}
          max={20}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleRedo}>Redo</button>
        <button onClick={changeBackground}>Change Background</button>
        <button onClick={clear}>Clear</button>
      </div>
    </>
  );
}

export default App;
