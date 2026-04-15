import { useRef, useEffect, useState } from "react";
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";
import { useParams } from "react-router-dom";

import StarFilled from "../../assets/StarFilled.svg";
import StarEmpty from "../../assets/StarEmpty.svg";
import "./StockPage.css";

function StockPage() {
  const { symbol } = useParams();
  const chartContainerRef = useRef(null);
  const [candles, setCandles] = useState([]);
  const [graphInterval, setGraphInterval] = useState("1day");
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const isDaily = graphInterval === "1day";

  // This function can be improved by using the user's local timezone or a setting, but for simplicity we'll just shift back 6 hours to align with central time
  function parseCandleTime(datetime) {
    const date = new Date(datetime);
    date.setHours(date.getHours() - 6); // Shift back 6 hours to align with central time
    return Math.floor(date.getTime() / 1000);
  }

  useEffect(() => {
    fetch(`http://localhost:3001/stock/${symbol}/${graphInterval}`)
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
  }, [symbol, graphInterval]);

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
      <div className="stockpage__header">
        <nav
          aria-label="Interval Navigation"
          className="stockpage__interval-nav"
        >
          <button
            type="button"
            aria-pressed={graphInterval === "1min"}
            onClick={() => setGraphInterval("1min")}
            className="stockpage__interval-btn"
          >
            1M
          </button>
          <button
            type="button"
            aria-pressed={graphInterval === "5min"}
            onClick={() => setGraphInterval("5min")}
            className="stockpage__interval-btn"
          >
            5M
          </button>
          <button
            type="button"
            aria-pressed={graphInterval === "1h"}
            onClick={() => setGraphInterval("1h")}
            className="stockpage__interval-btn"
          >
            1H
          </button>
          <button
            type="button"
            aria-pressed={graphInterval === "1day"}
            onClick={() => setGraphInterval("1day")}
            className="stockpage__interval-btn"
          >
            1D
          </button>
        </nav>
        <button
          onClick={() => setIsInWatchlist(!isInWatchlist)}
          className="stockpage__watchlist-btn"
        >
          <img
            src={isInWatchlist ? StarFilled : StarEmpty}
            alt="Watchlist Star"
            className="stockpage__watchlist-star"
          />
        </button>
      </div>
      <div className="stockpage__graph" ref={chartContainerRef}></div>
    </div>
  );
}

export default StockPage;
