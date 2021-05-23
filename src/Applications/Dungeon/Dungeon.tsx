import React, { useState, useEffect, useMemo, useRef } from 'react';
import { clone } from 'ramda';
import { Cell, ICell, Queue, IQueue } from './Classes';
import './Dungeon.scss';
import rock from '../../assets/images/rock.png';
import entrance from '../../assets/images/entrance.png';
import dynamite from '../../assets/images/dynamite.png';
import reset from '../../assets/icons/reset.png';
const Dungeon = (props: any) => {
  const [dungeon, setDungeon] = useState<ICell[][]>([]);
  const [start, setStart] = useState<number[]>([0, 0]);
  const [end, setEnd] = useState<number[]>([8, 7]);
  const [highlightingShortestPath, sethighlightingShortestPath] =
    useState<boolean>(false);
  const [shortestPathTimerId, setshortestPathTimerId] =
    useState<NodeJS.Timeout | null>(null);

  const [exploreTimerId, setExploreTimerId] =
    useState<NodeJS.Timeout | null>(null);
  const exploreTimerIdRef = useRef<NodeJS.Timeout | null>(null);
  const [duration, setDuration] = useState<number>(100);
  const [runCount, setRunCount] = useState(1);
  const [m, setM] = useState<number>(0);
  const [n, setN] = useState<number>(0);
  let visited: boolean[][] = [];

  useEffect(() => {
    exploreTimerIdRef.current = exploreTimerId;
  }, [exploreTimerId]);

  useEffect(() => {
    if (n > 20) {
      alert('Values Cannot Be Greater Than 20 !');
      setN(0);
    }
    if (m > 20) {
      alert('Values Cannot be Greater Than 20 !');
      setM(0);
    }
  }, [n, m]);

  const generateIntialmaze = (rows: number, columns: number): void => {
    let maze: Cell[][] = [];
    for (let i = 0; i < rows; i++) {
      let data = [];
      for (let j = 0; j < columns; j++) {
        if (i == start[0] && j == start[1])
          data.push(new Cell(false, null, i, j));
        else if (i === end[0] && j === end[1])
          data.push(new Cell(false, null, i, j));
        else {
          let random = Math.floor(Math.random() * 3);
          data.push(
            new Cell(
              random === 1,
              null,
              i,
              j,
              random === 1
                ? Math.floor(Math.random() * 2) === 1
                  ? 'rock'
                  : 'dynamite'
                : ''
            )
          );
        }
      }
      maze.push(data);
    }
    let element = document.getElementById('Dungeon');
    if (m > 14 || n > 14) {
      if (element) element.style.transform = 'translate(-50%,-50%) scale(.6)';
    } else {
      if (element) element.style.transform = 'translate(-50%,-50%) scale(1)';
    }
    setDungeon(maze);
  };
  const resetVisualization = (): void => {
    if (shortestPathTimerId) clearInterval(shortestPathTimerId);
    if (exploreTimerId) clearInterval(exploreTimerId);
    let element;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        element = document.getElementById(i + '-' + j);
        if (element) element.style.backgroundColor = '#B9770E';
      }
    }
  };
  const handleCell = (cell: ICell, rowIndex: number, columnIndex: number) => {
    if (cell.blocked)
      return (
        <img
          src={cell.image == 'rock' ? rock : dynamite}
          onClick={() => toggleCellType(rowIndex, columnIndex)}
        />
      );
    else if (rowIndex == start[0] && columnIndex == start[1])
      return (
        <img
          src={entrance}
          onClick={() => toggleCellType(rowIndex, columnIndex)}
        />
      );
    else if (rowIndex == end[0] && columnIndex == end[1])
      return (
        <img
          src={entrance}
          onClick={() => toggleCellType(rowIndex, columnIndex)}
        />
      );
    else
      return <div onClick={() => toggleCellType(rowIndex, columnIndex)}></div>;
  };

  const toggleCellType = (rowIndex: number, columnIndex: number): void => {
    if (rowIndex == start[0] && columnIndex == start[1]) return;
    if (rowIndex == end[0] && columnIndex == end[1]) return;
    let maze = clone(dungeon);
    let Cell = maze[rowIndex][columnIndex];

    Cell.blocked = !Cell.blocked;
    if (!Cell.image) Cell.image = 'dynamite';
    setDungeon(maze);
  };

  const exploreNeighbours = (
    maze: ICell[][],
    cell: ICell,
    visited: boolean[][],
    queue: IQueue,
    path: any,
    highlightExplore: ICell[][]
  ): void => {
    let dr = [-1, +1, 0, 0];
    let dc = [0, 0, -1, +1];
    let data: ICell[] = [];
    for (let i = 0; i < 4; i++) {
      let rr = cell.rIndex + dr[i];
      let cc = cell.cIndex + dc[i];
      if (rr < 0 || cc < 0 || rr >= m || cc >= n) continue;
      if (maze[rr][cc].blocked) continue;
      if (visited[rr][cc]) continue;

      maze[rr][cc].parent = [cell.rIndex, cell.cIndex];
      queue.enqueue(maze[rr][cc]);
      visited[rr][cc] = true;
      path[rr + '-' + cc] = maze[rr][cc];
      data.push(maze[rr][cc]);
    }
    if (data.length > 0) highlightExplore.push(data);
  };
  const highlightShortestPath = (reached_end: boolean, path: any) => {
    //shortest path

    if (reached_end) {
      let filteredCell = path[end[0] + '-' + end[1]];
      let element;
      element = document.getElementById(
        filteredCell.rIndex + '-' + filteredCell.cIndex
      );
      if (element) element.style.backgroundColor = '#F1C40F';

      setshortestPathTimerId(
        setInterval(() => {
          if (filteredCell.parent == null) {
            if (shortestPathTimerId) clearInterval(shortestPathTimerId);
            sethighlightingShortestPath(false);
          } else {
            sethighlightingShortestPath(true);
            filteredCell =
              path[filteredCell.parent[0] + '-' + filteredCell.parent[1]];
            element = document.getElementById(
              filteredCell.rIndex + '-' + filteredCell.cIndex
            );
            try {
              if (element !== null) element.style.backgroundColor = '#F1C40F';
            } catch {}
          }
        }, 100)
      );
    }

    //=============
  };
  const shortestPath = (
    maze: ICell[][],
    start: number[],
    end: number[],
    rows: number,
    columns: number
  ): void => {
    let visited: boolean[][] = [];
    for (let i = 0; i < rows; i++) {
      visited.push(new Array(columns).fill(false));
    }
    let reached_end = false;
    let queue = new Queue();
    let path: any = {};
    let highlightExplore: ICell[][] = [];
    let cell;
    cell = maze[start[0]][start[1]];
    queue.enqueue(cell);
    visited[start[0]][start[1]] = true;
    path[start[0].toString() + '-' + start[1].toString()] = cell;
    while (!queue.isEmpty()) {
      cell = queue.dequeue()!;
      if (cell.rIndex == end[0] && cell.cIndex == end[1]) {
        reached_end = true;
        break;
      }
      exploreNeighbours(maze, cell, visited, queue, path, highlightExplore);
    }

    //highlight Explore
    let i = 0;
    let element;
    let particularCell: ICell;
    setExploreTimerId(
      setInterval(() => {
        if (i < highlightExplore.length) {
          for (let j = 0; j < highlightExplore[i].length; j++) {
            particularCell = highlightExplore[i][j];
            element = document.getElementById(
              particularCell.rIndex + '-' + particularCell.cIndex
            );
            if (element) element.style.backgroundColor = 'rgba(41,45,48,0.3)';
          }
          i++;
        } else {
          highlightShortestPath(reached_end, path);
          clearInterval(exploreTimerIdRef.current!);
        }
      }, 100)
    );
    //=================
  };

  useEffect(() => {
    if (dungeon.length > 0 && m > 0 && n > 0) {
      resetVisualization();
      shortestPath(dungeon, start, end, m, n);
    }
  }, [start, end, dungeon]);

  const resetDungeon = () => {
    let element = document.getElementsByClassName('Reset')[0];
    element.classList.add('rotate');
    setTimeout(() => {
      if (exploreTimerId) clearInterval(exploreTimerId);
      if (shortestPathTimerId) clearInterval(shortestPathTimerId);
      element.classList.remove('rotate');
      setExploreTimerId(null);
      setshortestPathTimerId(null);
      setDungeon([]);
    }, 1000);
  };

  return (
    <div className="Dungeon_Page">
      <div className="Dungeon absolute-dungeon" id="Dungeon">
        {dungeon.map((rowData, rowIndex) => {
          return (
            <div className="Dungeon__Row">
              <div className="Dungeon__Row__Row_Index">{rowIndex}</div>
              {rowData.map((cell, columnIndex) => {
                return (
                  <div
                    className="Dungeon__Cell"
                    id={rowIndex + '-' + columnIndex}
                  >
                    {rowIndex === 0 && (
                      <div className="Dungeon__Cell__Column_Index">
                        {columnIndex}
                      </div>
                    )}
                    {handleCell(cell, rowIndex, columnIndex)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {dungeon.length === 0 && (
        <div className="Config">
          <div className="M_div">
            <label htmlFor="m">Number of Rows : </label>
            <input
              placeholder="M"
              value={m}
              onChange={(e) => setM(parseInt(e.target.value) || 0)}
              id="m"
            />
          </div>
          <div className="N_div">
            <label htmlFor="n">Number of Cols : </label>
            <input
              placeholder="N"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value) || 0)}
              id="n"
            />
          </div>
          <div className="Start_div">
            <div className="Start_div__Left">Start</div>
            <div className="Start_div__Right">
              <div className="Start_div__Right__Row">
                <label htmlFor="n">Row : </label>
                <input
                  placeholder="N"
                  value={n}
                  onChange={(e) => setN(parseInt(e.target.value) || 0)}
                  id="n"
                />
              </div>
            </div>
          </div>

          {m > 0 && n > 0 && (
            <button onClick={() => generateIntialmaze(m, n)}>
              Generate Maze
            </button>
          )}
        </div>
      )}
      {dungeon.length > 0 && (
        <div className="Reset">
          <div onClick={resetDungeon}>
            <img src={reset} />
          </div>
        </div>
      )}
    </div>
  );
};
export default Dungeon;
