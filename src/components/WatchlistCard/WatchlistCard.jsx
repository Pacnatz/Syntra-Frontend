import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { CurrentStockContext } from "../../context/CurrentStockContext";
import "./WatchlistCard.css";

function WatchlistCard({ stock }) {
  const { setCurrentStock, setCurrentStockDescription } =
    useContext(CurrentStockContext);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/dashboard/stock/${stock.symbol}`);
    setCurrentStock(stock.symbol);
    setCurrentStockDescription(stock.description);
  };
  return (
    <li className="watchlist-card">
      <button className="watchlist-card__btn" onClick={handleClick}>
        <span className="watchlist-card__symbol">{stock.symbol}</span>
        <span className="watchlist-card__price">${stock.price}</span>
      </button>
    </li>
  );
}

export default WatchlistCard;
