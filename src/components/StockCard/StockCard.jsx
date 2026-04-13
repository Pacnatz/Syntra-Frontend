import { useNavigate } from "react-router-dom";

import "./StockCard.css";

function StockCard({ symbol, description }) {
  const navigate = useNavigate();
  return (
    <li>
      <button
        onClick={() => {
          navigate(`/dashboard/stock/${symbol}`);
        }}
        className="stock-card"
      >
        <h3 className="stock-card__name">{symbol}</h3>
        <p className="stock-card__description">{description}</p>
      </button>
    </li>
  );
}

export default StockCard;
