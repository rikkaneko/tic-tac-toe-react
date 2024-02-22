import React, { useState } from 'react';
import './App.css';

interface SquareProps {
  value: string;
  on_click: () => void;
}

interface BroadProps {
  squares: string[];
  on_square_click: (idx: number) => void;
}

function Square({ value, on_click: on_square_click }: SquareProps) {
  return (
    <button className='square' onClick={on_square_click}>
      {value}
    </button>
  );
}

function check_winner(squares: string[]): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const line of lines) {
    const op = squares[line[0]];
    if (op === '') continue;
    if (squares[line[1]] === op && squares[line[2]] == op) return op;
  }
  return null;
}

export function Board({ squares, on_square_click }: BroadProps) {
  return (
    <>
      <div className='board-row'>
        <Square value={squares[0]} on_click={() => on_square_click(0)} />
        <Square value={squares[1]} on_click={() => on_square_click(1)} />
        <Square value={squares[2]} on_click={() => on_square_click(2)} />
      </div>
      <div className='board-row'>
        <Square value={squares[3]} on_click={() => on_square_click(3)} />
        <Square value={squares[4]} on_click={() => on_square_click(4)} />
        <Square value={squares[5]} on_click={() => on_square_click(5)} />
      </div>
      <div className='board-row'>
        <Square value={squares[6]} on_click={() => on_square_click(6)} />
        <Square value={squares[7]} on_click={() => on_square_click(7)} />
        <Square value={squares[8]} on_click={() => on_square_click(8)} />
      </div>
    </>
  );
}

interface HistoryEntry {
  squares: string[];
  is_next_x: boolean;
}

export default function Game() {
  const [is_next_x, set_next] = useState(true);
  const [squares, set_squares] = useState(Array<string>(9).fill(''));
  const [history, set_history] = useState<HistoryEntry[]>([]);
  const handle_square_click = (idx: number) => {
    if (squares[idx] !== '' || check_winner(squares) !== null) return;
    const next_squares = squares.slice();
    next_squares[idx] = is_next_x ? 'X' : 'O';
    set_history([
      ...history,
      {
        squares,
        is_next_x,
      },
    ]);
    set_squares(next_squares);
    set_next(!is_next_x);
  };

  const restore = (idx: number) => {
    const selected = history[idx];
    const next_historys = history.slice(0, idx);
    set_squares(selected.squares);
    set_next(selected.is_next_x);
    set_history(next_historys);
  };

  const winner = check_winner(squares);
  let status: string;
  if (winner !== null) status = `Winner: ${winner}`;
  else status = `Next Player: ${is_next_x ? 'X' : 'O'}`;

  const steps = history.map((_, i) => {
    let btn_text = `Step #${i}`;
    if (i === 0) btn_text = 'Game start';
    return (
      <li key={i}>
        <button onClick={() => restore(i)}>{btn_text}</button>
      </li>
    );
  });

  return (
    <>
      <h1>Tutorial:Tic-Tac-Toe</h1>
      <div className='game'>
        <div className='game-board'>
          <div className='status'>{status}</div>
          <Board squares={squares} on_square_click={handle_square_click} />
        </div>
        <div className='game-info'>
          <ol>{steps}</ol>
        </div>
      </div>
    </>
  );
}
