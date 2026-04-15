import { useRef, useEffect, useState } from "react";
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";
import { useParams } from "react-router-dom";
import "./StockPage.css";

function StockPage() {
  const { symbol } = useParams();
  const chartContainerRef = useRef(null);
  const [candles, setCandles] = useState([]);
  const interval = "1h";
  const isDaily = interval === "1day";

  // This function can be improved by using the user's local timezone or a setting, but for simplicity we'll just shift back 6 hours to align with central time
  function parseCandleTime(datetime) {
    const date = new Date(datetime);
    date.setHours(date.getHours() - 6); // Shift back 6 hours to align with central time
    return Math.floor(date.getTime() / 1000);
  }

  useEffect(() => {
    fetch(`http://localhost:3001/stock/${symbol}/${interval}`)
      .then((res) => {
        return res.ok ? res.json() : Promise.reject(res.status);
      })
      .then((data) => {
        setCandles(
          data.values
            .map((candle) => ({
              time: parseCandleTime(candle.datetime),
              open: parseFloat(candle.open),
              high: parseFloat(candle.high),
              low: parseFloat(candle.low),
              close: parseFloat(candle.close),
            }))
            .reverse(),
        );
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
      });
  }, [symbol, interval]);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const containerOptions = {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(255, 255, 255, 0.9)",
      },
      localization: {
        timeFormatter: (time) => {
          const date = new Date(time * 1000);
          if (isDaily) {
            return date.toLocaleDateString("en-US", {
              timeZone: "UTC",
              month: "short",
              day: "numeric",
            });
          }

          return date.toLocaleTimeString("en-US", {
            timeZone: "UTC",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        },
      },
      timeScale: {
        timeVisible: !isDaily,
        tickMarkFormatter: (time, tickMarkType) => {
          // tickMarkType: 0 = start of year, 1 = start of month, 2 = start of day, 3 = time
          const date = new Date(time * 1000);
          if (tickMarkType <= 2) {
            return date.toLocaleDateString("en-US", {
              timeZone: "UTC",
              month: "short",
              day: "numeric",
            });
          }
          return date.toLocaleTimeString("en-US", {
            timeZone: "UTC",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        },
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.1)" },
        horzLines: { color: "rgba(255, 255, 255, 0.1)" },
      },
      crosshair: {
        vertLine: { visible: false },
        horzLine: { visible: false },
      },

      width: container.clientWidth,
      height: container.clientHeight,
    };
    const seriesOptions = {
      upColor: "rgba(255, 255, 255, 0.8)",
      downColor: "rgba(24, 241, 233, 0.8)",
      wickUpColor: "rgba(255, 255, 255, 0.7)",
      wickDownColor: "rgba(24, 241, 233, 0.7)",
      borderVisible: false,
    };

    const chart = createChart(container, containerOptions);
    const newSeries = chart.addSeries(CandlestickSeries, seriesOptions);
    newSeries.setData(candles);

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [candles, isDaily]);

  return (
    <div className="stockpage">
      <div className="stockpage__header">{symbol}</div>
      <div className="stockpage__graph" ref={chartContainerRef}></div>
    </div>
  );
}

export default StockPage;
