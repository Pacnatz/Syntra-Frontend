import { useEffect, useRef } from "react";

function DynamicChart() {
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
    let isClearing = false;

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
          isClearing = true;
        } else {
          bars[currentBarIndex] = createBar(xLevel, yLevel);
        }
      }
    };

    const clearBars = () => {
      if (bars.length > 0) {
        bars.shift();
      }

      if (bars.length === 0) {
        count = 0;
        currentBarIndex = 0;
        xLevel = 0;
        yLevel = Math.random() * canvas.height;
        bars = [createBar(xLevel, yLevel)];
        isClearing = false;
      }
    };

    const drawBars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const bar of bars) {
        const isRising = bar.barHeight <= bar.startHeight;
        const candleColor = isRising
          ? "rgba(255, 255, 255, 0.6)"
          : "rgba(24, 241, 233, 0.6)";

        // Get the top y position of the bar
        const barTop = Math.min(bar.startHeight, bar.barHeight);
        // Gets how tall the bar should be rendered
        const barHeight = Math.max(
          1,
          Math.abs(bar.barHeight - bar.startHeight),
        );
        const barBottom = barTop + barHeight;
        const wickX = bar.x + barWidth / 2;
        const wickTop = Math.min(bar.high, bar.low);
        const wickBottom = Math.max(bar.high, bar.low);

        // Draw wick above and below the body only so it does not show through transparency.
        ctx.strokeStyle = candleColor;
        ctx.lineWidth = 1;
        if (wickTop < barTop) {
          ctx.beginPath();
          ctx.moveTo(wickX, wickTop);
          ctx.lineTo(wickX, barTop);
          ctx.stroke();
        }

        if (wickBottom > barBottom) {
          ctx.beginPath();
          ctx.moveTo(wickX, barBottom);
          ctx.lineTo(wickX, wickBottom);
          ctx.stroke();
        }

        ctx.fillStyle = candleColor;
        ctx.fillRect(bar.x, barTop, barWidth, barHeight);
      }
    };

    const render = setInterval(() => {
      if (isClearing) {
        clearBars();
      } else {
        updateBars();
      }
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
  return <canvas ref={canvasRef} className="dynamic-chart"></canvas>;
}

export default DynamicChart;
