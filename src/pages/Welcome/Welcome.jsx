import { useEffect, useRef } from "react";
import "./Welcome.css";

function Welcome() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderInterval = 50;
    const barWidth = 20;
    const barGap = 5;
    const amplitude = 250;
    const ticksPerBar = 2;

    let maxBars = 1;
    let xLevel = 0;
    let yLevel = Math.random() * canvas.height;
    let bars = [createBar(xLevel, yLevel)];
    let count = 0;
    let currentBarIndex = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      maxBars = Math.max(1, Math.floor(canvas.width / (barWidth + barGap)));
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const updateBars = () => {
      count++;
      // Randomly move up or down within amplitude range
      yLevel += Math.random() * amplitude - amplitude / 2;
      // Clamp yLevel to canvas bounds
      yLevel = Math.max(0, Math.min(canvas.height, yLevel));

      if (!bars[currentBarIndex]) {
        bars[currentBarIndex] = createBar(xLevel, yLevel);
      }
      bars[currentBarIndex].barHeight = yLevel;
      bars[currentBarIndex].high = Math.max(bars[currentBarIndex].high, yLevel);
      bars[currentBarIndex].low = Math.min(bars[currentBarIndex].low, yLevel);

      if (count >= ticksPerBar) {
        count = 0;
        currentBarIndex++;
        xLevel += barWidth + barGap;

        if (currentBarIndex >= maxBars) {
          currentBarIndex = 0;
          xLevel = 0;
          yLevel = Math.random() * canvas.height;
          bars = [createBar(xLevel, yLevel)];
        } else {
          bars[currentBarIndex] = createBar(xLevel, yLevel);
        }
      }
    };

    const drawBars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const bar of bars) {
        const isRising = bar.barHeight <= bar.startHeight;
        const candleColor = isRising ? "#0f0" : "#f00";

        // Draw wick
        ctx.strokeStyle = candleColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bar.x + barWidth / 2, bar.high);
        ctx.lineTo(bar.x + barWidth / 2, bar.low);
        ctx.stroke();

        // Get the top y position of the bar
        const barTop = Math.min(bar.startHeight, bar.barHeight);
        // Gets how tall the bar should be rendered
        const barHeight = Math.max(
          1,
          Math.abs(bar.barHeight - bar.startHeight),
        );
        ctx.fillStyle = candleColor;
        ctx.fillRect(bar.x, barTop, barWidth, barHeight);
      }
    };

    const render = setInterval(() => {
      updateBars();
      drawBars();
    }, renderInterval);

    // On component unmount
    return () => {
      clearInterval(render);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Bar Factory
  function createBar(x, y) {
    return { x, y, startHeight: y, barHeight: y, high: y, low: y };
  }
  return (
    <div className="welcome">
      <canvas ref={canvasRef} className="canvas"></canvas>
    </div>
  );
}

export default Welcome;
