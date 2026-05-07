# Syntra Frontend

Syntra is a real-time collaborative trading and analysis platform where users can explore stocks together, share insights, and annotate charts live. Built with React and Vite, it focuses on interactive charting, live market updates, and collaborative tools for technical analysis. Future development includes social features, authentication, and expanded user collaboration.

## Note to Instructor

This project has a companion backend that is required for the app to function.

Backend repository: [Syntra Backend](https://github.com/Pacnatz/Syntra-Backend)

Because this app connects to external APIs (Finnhub for live stock prices via WebSocket, and Twelve Data for historical candlestick data), a backend is necessary for stage 1 this is due to:

1. **API keys would be exposed through the client** — all external API calls must go through the server's environmental variables.
2. **Rate limits** — Twelve Data's free tier limits how often data can be fetched. The backend caches responses per symbol and interval so repeated requests don't burn through the quota. Similarly, the backend owns the Finnhub WebSocket connection and distributes live updates to connected clients, rather than each browser opening its own direct upstream connection.
3. **System Architecture** - This application is intentionally not designed for each client to provide or manage its own external API key. The server is the single integration point for provider keys and market data distribution.

The backend handles REST endpoints for search and stock data, as well as Socket.IO rooms that relay live price updates from Finnhub to the frontend in real time.

### Instructor Testing Tip (Realtime Updates)

If the stock market is closed and live equity prices are not moving, you can use `MDB` as a test symbol to validate realtime updates.

For stage 1 testing, the backend temporarily maps `MDB` to Finnhub's `BINANCE:BTCUSDT` feed so you can still observe frequent live price events and verify realtime fetching/socket delivery behavior without waiting for market hours.

## What This Frontend Does Today

- Landing page with sign-in / sign-up UI (auth backend not yet implemented)
- Dashboard layout with nested routes:
  - Profile page
  - Stock search
  - Stock detail view with chart + live updates
- Debounced stock search with URL-based query syncing (`/dashboard/search?q=...`).
- Real-time stock updates using Socket.IO rooms by stock symbol.
- Candlestick chart rendering using `lightweight-charts`.
- Multi-interval chart support (`1min`, `5min`, `1h`, `1day`).
- Watchlist with add/remove behavior and live price refresh.
- Responsive mobile sidebar layout
- Client-side logging utility with category flags.

## Tech Stack

### Core

- React 19
- React Router 7
- Vite 8

### Real-time + Data

- Socket.IO Client (`socket.io-client`)
- Lightweight Charts (`lightweight-charts`)
- REST fetch calls proxied through Vite dev server (`/api`, `/socket.io`)

### Tooling

- ESLint 9 (JS + React Hooks + React Refresh plugins)
- Normalize CSS + custom local fonts

## Frontend Architecture

### Entry

- main.jsx bootstraps React with routing

### App Structure

- App.jsx handles top-level routing between:
  - Welcome flow
  - Dashboard system

### Dashboard

- Central layout controller
- Manages:
  - Sidebar (watchlist)
  - Nested routes
  - Shared UI state

### Context

- SocketContext: manages WebSocket connection lifecycle
- CurrentStockContext: stores selected stock state

### Pages

- SearchPage: stock search + navigation
- StockPage: chart + live updates + room subscription
- Profile: UI scaffold for user settings

## Implemented Features (In Depth)

### 1. Search Experience

- Debounced input in `SearchBar` reduces repeated API calls.
- Query is encoded into URL for shareable/searchable state.
- Search results render dynamic stock cards and route into stock detail pages.

### 2. Stock Charting

- Historical candles loaded from backend endpoint `/api/stock/:symbol/:interval`.
- Candlestick series rendered with custom styling and watermark symbol.
- Time formatting switches between date labels and intraday clock labels.
- Live price events progressively update or append candles based on interval.

### 3. Real-time Updates

- Socket connection is initialized once at dashboard scope.
- Client emits `joinStockRoom` and `leaveStockRoom` events for selected symbol.
- UI receives `stockPriceUpdate` events and applies updates to chart/watchlist.

### 4. Watchlist UX

- User can add/remove stocks from a temporary in-memory watchlist.
- Animated mount/unmount behavior for watchlist cards.
- Watchlist prices update in real-time when matching symbol events are received.

### 5. Form + Validation Utilities

- Reusable `useForm` hook handles value state and validity checks.
- Signup/profile forms enforce required fields and password confirmation checks.

### 6. Frontend Logging Utility

- `src/utils/logger.js` provides category-based logging flags.
- Helps reduce console noise while keeping targeted debug output available.

## Backend Integration Notes (for Frontend Dev)

- Dev server proxy (`vite.config.js`) forwards:
  - `/api` -> `http://localhost:3001`
  - `/socket.io` -> `http://localhost:3001` (WebSocket enabled)
- Required backend env values:
  - `FINNHUB_API_KEY`
  - `TWELVEDATA_API_KEY`
  - `CLIENT_URL`
  - `PORT`

## Work Still To Finish

### Product Features

- Replace mock auth flow with real authentication and session handling.
- Replace placeholder friends list and messaging actions with real data flows.
- Persist watchlist and profile preferences in backend/database.
- Implement true sign-out behavior (token/session invalidation).
- Add user search/content in the "Users" section on Search page.
- Add `/dashboard/chat/:roomId` route for dedicated chat spaces.
- Build chat UI with scrollable message history, message input, and real-time delivery via Socket.IO.
- Add live cursor presence — broadcast and render other users' cursor positions on the chart in real time.
- Add chart annotation toolbar with trendline, box, and price line drawing tools and their interactive editing behavior.

### Data + Reliability

- Show proper error messages when API calls fail or hit rate limits instead of silently failing.
- Fix the bug where navigating directly to a stock page URL doesn't always subscribe to live updates.
- Remove the temporary workaround that maps a crypto symbol to a stock for after-hours testing.
- Save chart drawings (trendlines, boxes, price lines) to the database so they persist across sessions.

### Engineering Quality

- Write tests to make sure forms, page navigation, and chart data updates work correctly.
- Make the app keyboard navigable and screen reader friendly.
- Add proper type checking so bad data from APIs doesn't cause unexpected crashes.

## Challenges Encountered

### 1. Socket Connection Readiness Race

- When a user navigates directly to a stock page, the `StockPage` component mounts and attempts to emit `joinStockRoom` before the Socket.IO connection has fully established.
- This caused the room subscription to silently fail, meaning the page would display historical data but never receive live price updates.
- Resolution: tracked connection state with an `isSocketReady` flag in `SocketContext` and gated the `joinStockRoom` emit behind it, so the effect re-fires once the socket is confirmed open.

### 2. Syncing Historical Candles with Live Ticks

- Finnhub's historical OHLC data is behind the premium plan, so Twelve Data's API was used instead to fetch candlestick history.
- Server-side caching with TTLs per interval was added to avoid burning through Twelve Data's rate limits on repeated loads.
- Twelve Data's datetime strings came back consistently 1 hour ahead of Finnhub's live tick timestamps, requiring a -3600 second adjustment on each historical candle to keep them aligned with live updates.
- Interval boundary detection for live tick merging required careful comparison between the tick time and the last candle's time to avoid creating misaligned candles.

### 3. Chart Teardown and Interval Switching

- Switching between chart intervals (`1min`, `5min`, `1h`, `1day`) re-renders the chart component, but the underlying `lightweight-charts` instance held state between renders.
- If the series ref was not explicitly nulled before the chart was destroyed, stale candle data from the previous interval would bleed into the new chart on fast switches.
- Resolution: the chart cleanup function explicitly sets `seriesRef.current = null` before calling `chart.remove()`, preventing the candle update effect from writing to a destroyed series.

### 4. Stale Closure in Watchlist Socket Cleanup

- The `leaveStockRoom` cleanup logic inside a `useEffect` captured `isInWatchlist` at the time the effect ran, not at the time it cleaned up.
- This meant navigating away from a stock page could incorrectly leave or drop the socket room depending on watchlist state at mount time.
- Resolution: stored `isInWatchlist` in a `useRef` and read from the ref inside the cleanup function so it always reflects the latest value at unmount time.

## Local Development

From the project root, run frontend and backend in separate terminals.

Frontend:

```bash
cd client
npm install
npm run dev
```

Backend:

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```
FINNHUB_API_KEY=your_finnhub_api_key
TWELVEDATA_API_KEY=your_twelvedata_api_key
CLIENT_URL=http://localhost:3000
PORT=3001
```

Then start the server:

```bash
npm run dev
```

Then open:

- `http://localhost:3000`

## Current Status

Syntra frontend is a strong interactive prototype with working search, charting, and realtime infrastructure.
Core collaborative and account-backed features are WIP but not yet production complete.
