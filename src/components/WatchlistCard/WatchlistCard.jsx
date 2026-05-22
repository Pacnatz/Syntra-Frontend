import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { SocketContext } from "../../context/SocketContext";
import { CurrentStockContext } from "../../context/CurrentStockContext";
import "./WatchlistCard.css";

function WatchlistCard({ stock, setWatchlist }) {
  const { setCurrentStock, setCurrentStockDescription } =
    useContext(CurrentStockContext);
  const navigate = useNavigate();

  const { socketRef } = useContext(SocketContext);

  const handleClick = () => {
    navigate(`/dashboard/stock/${stock.symbol}`);
    setCurrentStock(stock.symbol);
    setCurrentStockDescription(stock.description);
  };

  const [isMounted, setIsMounted] = useState(true);
  const [stockPrice, setStockPrice] = useState();

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    const handleStockPriceUpdate = (update) => {
      if (update.symbol === stock.symbol) {
        setStockPrice(update.price);
      }
    };
    socket.on("stockPriceUpdate", handleStockPriceUpdate);

    return () => {
      socket.off("stockPriceUpdate", handleStockPriceUpdate);
    };
  }, [socketRef, stock]);

  // Trigger mount animation on initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  // Trigger unmount animation when stock.unmount becomes true
  useEffect(() => {
    if (stock.unmount) {
      const timer = setTimeout(() => {
        setWatchlist((prev) =>
          prev.filter((item) => item.symbol !== stock.symbol),
        );
      }, 300); // Match this duration with the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [stock.unmount, setWatchlist, stock.symbol]);

  return (
    <li
      className={`watchlist-card ${isMounted ? "mounted" : stock.unmount ? "unmounted" : ""}`}
    >
      <button className="watchlist-card__btn" onClick={handleClick}>
        <span className="watchlist-card__symbol">{stock.symbol}</span>
        <span className="watchlist-card__price">
          ${stockPrice ? stockPrice.toFixed(2) : stock.price.toFixed(2)}
        </span>
      </button>
    </li>
  );
}

export default WatchlistCard;
