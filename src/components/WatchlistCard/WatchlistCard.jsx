import { useNavigate } from "react-router-dom";
import "./WatchlistCard.css";

function WatchlistCard({ stock }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/dashboard/stock/${stock.symbol}`);
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
