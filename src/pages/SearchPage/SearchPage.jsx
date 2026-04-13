import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import StockCard from "../../components/StockCard/StockCard";
import Loader from "../../assets/Loader.svg";
import "./SearchPage.css";

function SearchPage({ searchLoading, setSearchLoading }) {
  const [searchParams] = useSearchParams();
  const [searchResult, setSearchResult] = useState([]);
  const query = searchParams.get("q") || "";

  // Fetch search results whenever the query changes
  useEffect(() => {
    if (query.length < 2) {
      setSearchLoading(false);
      return;
    }
    fetch("http://localhost:3001/search?q=" + encodeURIComponent(query.trim()))
      .then((res) =>
        res.ok ? res.json() : Promise.reject({ status: res.status }),
      )
      .then((data) => {
        setSearchResult(data);
      })
      .catch((error) => {
        console.error("Error fetching from server:", error);
      })
      .finally(() => {
        setSearchLoading(false);
      });
  }, [query, setSearchLoading]);

  return (
    <>
      {searchLoading ? (
        <div className="searchpage__screen">
          <img src={Loader} alt="Loading..." className="searchpage__loader" />
        </div>
      ) : (
        <div className="searchpage">
          <div className="searchpage__content">
            <section className="searchpage__stock-section">
              <p className="searchpage__stock-text">Stocks</p>
              <ul className="searchpage__stock-search">
                {searchResult.map((stock) => (
                  <StockCard
                    key={stock.description}
                    symbol={stock.symbol}
                    description={stock.description}
                  />
                ))}
              </ul>
            </section>
            <section className="searchpage__user-section">
              <p className="searchpage__user-text">Users</p>
              <ul className="searchpage__user-search"></ul>
            </section>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchPage;
