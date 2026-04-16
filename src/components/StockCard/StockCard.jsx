import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentStockContext } from "../../context/CurrentStockContext";

import "./StockCard.css";

function StockCard({ symbol, description }) {
  const navigate = useNavigate();
  const { setCurrentStock, setCurrentStockDescription } =
    useContext(CurrentStockContext);
  return (
    <li>
      <button
        onClick={() => {
          navigate(`/dashboard/stock/${symbol}`);
          setCurrentStock(symbol);
          setCurrentStockDescription(description);
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
