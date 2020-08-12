import React from 'react';
import './App.css';

const NEXT_TURN = {
  O: 'X',
  X: 'O',
};

const clone = (x) => JSON.parse(JSON.stringify(x));

const flatten = (arr) => arr.reduce((acc, cur) => [...acc, ...cur], []);

const newTicTacToeGrid = () => generateGrid(3, 3, () => null);

const getInitialState = () => ({
  grid: newTicTacToeGrid(),
  status: 'inProgress',
  turn: 'X',
});

function generateGrid(rows, columns, mapper) {
  return Array(rows)
    .fill()
    .map(() => Array(columns).fill().map(mapper));
}

function checkThree(a, b, c) {
  if (!a || !b || !c) return false;
  return a === b && b === c;
}

function checkForWin(flatGrid) {
  const [nw, n, ne, w, c, e, sw, s, se] = flatGrid;

  return (
    checkThree(nw, n, ne) ||
    checkThree(w, c, e) ||
    checkThree(sw, s, se) ||
    checkThree(nw, w, sw) ||
    checkThree(n, c, s) ||
    checkThree(ne, e, se) ||
    checkThree(nw, c, se) ||
    checkThree(ne, c, sw)
  );
}

function checkForDraw(flatGrid) {
  return (
    !checkForWin(flatGrid) &&
    flatGrid.filter(Boolean).length === flatGrid.length
  );
}

const reducer = (state, action) => {
  if (state.status === 'success' && action.type !== 'RESET') {
    return state;
  }

  switch (action.type) {
    case 'RESET':
      return getInitialState();
    case 'CLICK': {
      const { x, y } = action.payload;
      const { grid, turn } = state;

      if (grid[y][x]) {
        return state;
      }

      const nextState = clone(state);

      nextState.grid[y][x] = turn;

      const flatGrid = flatten(nextState.grid);

      if (checkForWin(flatGrid)) {
        nextState.status = 'success';
        return nextState;
      }

      if (checkForDraw(flatGrid)) {
        return getInitialState();
      }

      nextState.turn = NEXT_TURN[turn];

      return nextState;
    }
    default:
      return state;
  }
};

function Cell({ onClick, value }) {
  return (
    <div className="cell">
      <button onClick={onClick} type="button">
        {value}
      </button>
    </div>
  );
}

function Grid({ grid, handleClick }) {
  return (
    <div className="grid">
      <div
        style={{
          backgroundColor: '#444',
          display: 'grid',
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridGap: 2,
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((value, colIdx) => (
            <Cell
              key={`${colIdx}-${rowIdx}`}
              onClick={() => {
                handleClick(colIdx, rowIdx);
              }}
              value={value}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Game() {
  const [state, dispatch] = React.useReducer(reducer, getInitialState());
  const { grid, status, turn } = state;

  const handleClick = (x, y) => {
    dispatch({ type: 'CLICK', payload: { x, y } });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <div className="game">
      <div className="game__winner">
        {status === 'success' ? `${turn} wins!` : null}
      </div>
      <div className="game__status">
        <div>Next turn: {turn}</div>
        <button onClick={reset} type="button">
          Reset
        </button>
      </div>
      <Grid grid={grid} handleClick={handleClick} />
    </div>
  );
}

function App() {
  return (
    <div>
      <header>
        <h1>Tic-Tac-Toe</h1>
      </header>
      <Game />
    </div>
  );
}

export default App;
