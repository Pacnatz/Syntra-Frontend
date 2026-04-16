import { useRef, useEffect, useState, useContext } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  createTextWatermark,
} from "lightweight-charts";
import { useParams } from "react-router-dom";

import StarFilled from "../../assets/StarFilled.svg";
import StarEmpty from "../../assets/StarEmpty.svg";
import { SocketContext } from "../../context/SocketContext";
import "./StockPage.css";

function StockPage({ setWatchlist }) {
  const { symbol } = useParams();
  const chartContainerRef = useRef(null);
  const [candles, setCandles] = useState([]);
  const [graphInterval, setGraphInterval] = useState("1day");
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const isDaily = graphInterval === "1day";

  const { socketRef } = useContext(SocketContext);

  // Return Twelve Data's datetime to a UNIX timestamp in seconds
  function adjustCandleTime(datetime) {
    // For some reason Twelve Data's datetime seems to be off by 1 hour compared to Finnhub's timestamps,
    // so we need subtract 3600 seconds to match the timestamps from the stock price updates
    return Math.floor(new Date(datetime).getTime() / 1000) - 3600;
  }

  // Temp Watchlist handler, will be improved when we have a database
  const handleWatchlistToggle = () => {
    setIsInWatchlist((prev) => !prev);
    setWatchlist((prev) => {
      // If theres a match in the watchlist
      if (prev.filter((item) => item.symbol === symbol).length > 0) {
        // Remove the match
        return prev.filter((item) => item.symbol !== symbol);
      } else {
        // Otherwise, add the stock to the watchlist with its latest price
        return [
          ...prev,
          { symbol: symbol, price: candles[candles.length - 1]?.close || 0 },
        ];
      }
    });
  };

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !symbol) return;
    socket.emit("joinStockRoom", symbol); // Join a room specific to the stock symbol

    const handleStockPriceUpdate = (update) => {
      if (update.symbol === symbol.toUpperCase()) {
        setCandles((prevCandles) => {
          const lastCandle = prevCandles[prevCandles.length - 1];
          const intervalSeconds =
            graphInterval === "1min"
              ? 60
              : graphInterval === "5min"
                ? 300
                : graphInterval === "1h"
                  ? 3600
                  : 86400;
          // update.time is from Finnhub's api and the UNIX timestamp seems to be different from the one from Twelve Data by 1 hour, so we add 3600 seconds to it to match the candles time
          const updateTime = Math.floor(update.time / 1000);
          console.log(lastCandle?.time);
          console.log(updateTime);

          if (updateTime > lastCandle.time + intervalSeconds) {
            // Add a new candle if the update time exceeds the current candle's time by the interval
            return [
              ...prevCandles,
              {
                time: lastCandle.time + intervalSeconds, // Make a new candle with the next interval time
                open: update.price,
                high: update.price,
                low: update.price,
                close: update.price,
              },
            ];
          } else {
            // Update the current candle
            const updatedCandle = {
              ...lastCandle,
              high: Math.max(lastCandle.high, update.price),
              low: Math.min(lastCandle.low, update.price),
              close: update.price,
            };
            return [...prevCandles.slice(0, -1), updatedCandle];
          }
        });
      }
    };

    socket.on("stockPriceUpdate", handleStockPriceUpdate);

    return () => {
      socket.emit("leaveStockRoom", symbol); // Leave the room when the component unmounts
      socket.off("stockPriceUpdate", handleStockPriceUpdate);
    };
  }, [symbol, socketRef, graphInterval]);

  useEffect(() => {
    fetch(`http://localhost:3001/stock/${symbol}/${graphInterval}`)
      .then((res) => {
        return res.ok ? res.json() : Promise.reject(res.status);
      })
      .then((datas) => {
        const { data, log } = datas; // Destructure the response to get the actual data and log
        console.log(log);
        setCandles(
          data.values
            .map((candle) => ({
              time: adjustCandleTime(candle.datetime),
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
              //timeZone: chartTimeZone, // Affects how a UNIX timestamp is displayed
              month: "short",
              day: "numeric",
            });
          }

          return date.toLocaleTimeString("en-US", {
            //timeZone: chartTimeZone, // Affects how a UNIX timestamp is displayed
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        },
      },
      timeScale: {
        timeVisible: !isDaily,
        tickMarkFormatter: (time, tickMarkType) => {
          // tickMarkType: 0 = start of year, 1 = start of month, 2 = start of day, 3 = start of hour, 4 = start of minute
          const date = new Date(time * 1000);
          if (tickMarkType <= 2) {
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }
          return date.toLocaleTimeString("en-US", {
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

    createTextWatermark(chart.panes()[0], {
      horzAlign: "left",
      vertAlign: "top",
      lines: [
        {
          text: symbol.toUpperCase(),
          color: "rgba(255, 255, 255, 0.1)",
          fontFamily: "Inter, Arial, Helvetica, sans-serif",
          fontStyle: "bold",
          fontSize: 48,
        },
      ],
    });

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
  }, [candles, isDaily, symbol]);

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
          onClick={handleWatchlistToggle}
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
