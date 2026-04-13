import { useContext } from "react";

import StockCard from "../../components/StockCard/StockCard";
import SearchContext from "../../context/SearchContext";
import "./SearchPage.css";

function SearchPage() {
  const { searchResult, searchLoading } = useContext(SearchContext);
  console.log("Search Result:", searchResult);
  return (
    <>
      {searchLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="searchpage">
          <div className="searchpage__content">
            <section className="searchpage__stock-section">
              <p className="searchpage__stock-text">Stocks</p>
              <ul className="searchpage__stock-search">
                {searchResult.map((stock) => (
                  <StockCard
                    key={stock.symbol}
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
