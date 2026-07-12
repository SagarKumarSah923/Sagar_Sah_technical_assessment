# Completion Notes

Your Part 1–3 work (node abstraction, styling, text node logic) was solid
as submitted — no changes needed there beyond one lint fix. What was
**missing against the assignment brief**, and what I added:

## 1. Backend was entirely missing (Part 4)
There was no `/backend` folder at all, so the `/pipelines/parse` endpoint
didn't exist anywhere. Added `backend/main.py`:
- `POST /pipelines/parse` accepting `{ nodes, edges }` as JSON
- Returns `{ num_nodes, num_edges, is_dag }`
- DAG check via Kahn's algorithm (topological sort by in-degree) — a cycle
  means some nodes never reach in-degree 0, so the visited count comes up
  short
- CORS enabled so the `localhost:3000` frontend can call `localhost:8000`

Your `submit.js` was already POST-ing to exactly this URL/shape, so nothing
needed to change on the frontend side for the integration to work end to end.

## 2. Project wasn't runnable as submitted
- No `package.json` → `npm i` had nothing to install against. Added one
  with the deps your code actually imports (`react`, `react-dom`,
  `react-scripts`, `reactflow`, `zustand`).
- No `public/index.html` → Create React App requires this (it's where
  `<div id="root">` lives that `index.js` mounts into). Added it.
- Files were flat in the zip root instead of under `frontend/src/...` per
  the brief's folder convention. Moved everything into
  `frontend/src/` and put the new backend in `backend/`.

## 3. Minor fix
- `ui.js`: `useCallback` was missing `addNode`/`getNodeID` in its dependency
  array (`react-hooks/exhaustive-deps`) — this fails a CI build with
  warnings-as-errors. Added them; verified `npm run build` now compiles
  clean.

## One judgment call worth flagging
The brief says "create an **alert** that triggers... and display the values
... in a user-friendly manner." Your `submit.js` shows a styled modal
instead of a native `alert()`. Functionally it satisfies the requirement
(shows num_nodes/num_edges/is_dag after the response arrives) and is
arguably better UX — but if whoever's grading this is checking literally
for `window.alert(...)`, it's worth knowing that's a deliberate deviation,
not an oversight. I left it as you built it since it's a reasonable reading
of "user-friendly."

## Verified
- `npm run build` (CI mode, warnings-as-errors) — compiles clean
- Backend tested with: a valid DAG, a cyclic graph, and a realistic
  ReactFlow-shaped payload (extra fields like `position`/`data`/`type`) —
  all pass

## Running it
```
# backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload      # http://localhost:8000

# frontend (separate terminal)
cd frontend
npm i
npm start                       # http://localhost:3000
```
