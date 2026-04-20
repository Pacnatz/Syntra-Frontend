import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { SocketContext } from "../../context/SocketContext";
import { CurrentStockContext } from "../../context/CurrentStockContext";
import "./WatchlistCard.css";

function WatchlistCard({ stock }) {
  const { setCurrentStock, setCurrentStockDescription } =
    useContext(CurrentStockContext);
  const navigate = useNavigate();

  const { socketRef } = useContext(SocketContext);

  const handleClick = () => {
    navigate(`/dashboard/stock/${stock.symbol}`);
    setCurrentStock(stock.symbol);
    setCurrentStockDescription(stock.description);
  };

  const [stockPrice, setStockPrice] = useState();

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.on("stockPriceUpdate", (update) => {
      if (update.symbol === stock.symbol) {
        setStockPrice(update.price);
      }
    });

    return () => {
      socket.off("stockPriceUpdate");
    };
  }, [socketRef, stock]);

  return (
    <li className="watchlist-card">
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
