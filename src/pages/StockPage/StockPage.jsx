import { useParams } from "react-router-dom";

import "./StockPage.css";

function StockPage() {
  const { symbol } = useParams();
  return <div className="stockpage">{symbol}</div>;
}

export default StockPage;
