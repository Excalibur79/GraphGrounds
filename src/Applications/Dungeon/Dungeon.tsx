import React, { useState, useEffect, useMemo } from 'react';
import { clone } from 'ramda';
import { Cell, ICell, Queue, IQueue } from './Classes';
import './Dungeon.scss';
import rock from '../../assets/images/rock.png';
const Dungeon = (props: any) => {
  const [dungeon, setDungeon] = useState<ICell[][]>([]);
  const [start, setStart] = useState<number[]>([0, 0]);
  const [end, setEnd] = useState<number[]>([8, 7]);
  const [
    highlightingShortestPath,
    sethighlightingShortestPath,
  ] = useState<boolean>(false);
  const [timerId, setTimerId] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(100);
  const [runCount, setRunCount] = useState(1);
  const [m, setM] = useState<number>(0);
  const [n, setN] = useState<number>(0);

  let visited: boolean[][] = [];
  const generateIntialmaze = (rows: number, columns: number): void => {
    let maze: Cell[][] = [];
    for (let i = 0; i < rows; i++) {
      let data = [];
      for (let j = 0; j < columns; j++) {
        if (i == start[0] && j == start[1])
          data.push(new Cell(false, null, i, j));
        else if (i === end[0] && j === end[1])
          data.push(new Cell(false, null, i, j));
        else
          data.push(new Cell(Math.floor(Math.random() * 3) === 1, null, i, j));
      }
      maze.push(data);
    }
    console.log(maze);
    setDungeon(maze);
  };
  const resetVisualization = (): void => {
    if (!highlightingShortestPath) {
      let element;
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          element = document.getElementById(i + '-' + j);
          if (element) element.style.backgroundColor = 'white';
        }
      }
    }
  };
  // const generateDefaultPath = (rows: number, columns: number) => {
  //   let maze = clone(dungeon);
  //   //Intializing visited matrix

  //   //=======================
  //   //pushing Start indexes

  //   let dr = [-1, +1, 0, 0];
  //   let dc = [0, 0, -1, +1];
  //   console.log(maze[0][0]);
  //   let cell = maze[start[0]][start[1]];
  //   cell.blocked = false;
  //   let endReached = false;
  //   while (!endReached || cell.rIndex === rows - 1) {
  //     let r = cell.rIndex;
  //     let c = cell.cIndex;
  //     for (let i = 0; i < 4; i++) {
  //       let rr = r + dr[i];
  //       let cc = c + dc[i];
  //       if (rr === end[0] && cc === end[1]) {
  //         endReached = true;
  //         maze[rr][cc].blocked = false;
  //       }
  //     }
  //     if (!endReached) {
  //       let valid = false;
  //       let randomIndex;
  //       do {
  //         randomIndex = Math.random() * 4;
  //         if (
  //           r + dr[randomIndex] >= 0 &&
  //           r + dr[randomIndex] < rows &&
  //           c + dc[randomIndex] >= 0 &&
  //           c + dc[randomIndex] < columns
  //         ) {
  //           valid = true;
  //         }
  //       } while (!valid);
  //       cell = maze[r + dr[randomIndex]][c + dc[randomIndex]];
  //       cell.blocked = false;
  //     }
  //   }
  //   console.log('new maze with definite path is :', maze);
  // };

  const handleCell = (cell: ICell, rowIndex: number, columnIndex: number) => {
    if (cell.blocked) return <img src={rock} />;
    else if (rowIndex == start[0] && columnIndex == start[1])
      return <div>S</div>;
    else if (rowIndex == end[0] && columnIndex == end[1]) return <div>E</div>;
    else return <div></div>;
  };

  const toggleCellType = (rowIndex: number, columnIndex: number): void => {
    if (!highlightingShortestPath) {
      if (rowIndex == start[0] && columnIndex == start[1]) return;
      if (rowIndex == end[0] && columnIndex == end[1]) return;
      let maze = clone(dungeon);
      let Cell = maze[rowIndex][columnIndex];
      Cell.blocked = !Cell.blocked;
      setDungeon(maze);
    }
  };

  const exploreNeighbours = (
    maze: ICell[][],
    cell: ICell,
    visited: boolean[][],
    queue: IQueue,
    path: any
  ): void => {
    let dr = [-1, +1, 0, 0];
    let dc = [0, 0, -1, +1];
    for (let i = 0; i < 4; i++) {
      let rr = cell.rIndex + dr[i];
      let cc = cell.cIndex + dc[i];
      if (rr < 0 || cc < 0 || rr >= m || cc >= n) continue;
      if (maze[rr][cc].blocked) continue;
      if (visited[rr][cc]) continue;

      maze[rr][cc].parent = [cell.rIndex, cell.cIndex];
      queue.enqueue(maze[rr][cc]);
      visited[rr][cc] = true;
      path[rr.toString() + '-' + cc.toString()] = maze[rr][cc];
    }
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
      exploreNeighbours(maze, cell, visited, queue, path);
    }
    console.log('reached end : ', reached_end, ' and path is : ', path);

    //shortest path
    if (reached_end) {
      let filteredCell = path[end[0] + '-' + end[1]];
      let element;
      element = document.getElementById(
        filteredCell.rIndex + '-' + filteredCell.cIndex
      )!;
      element.style.backgroundColor = 'green';

      let id = setInterval(() => {
        if (filteredCell.parent == null) {
          clearInterval(id);
          sethighlightingShortestPath(false);
        } else {
          sethighlightingShortestPath(true);
          filteredCell =
            path[filteredCell.parent[0] + '-' + filteredCell.parent[1]];
          element = document.getElementById(
            filteredCell.rIndex + '-' + filteredCell.cIndex
          )!;
          element.style.backgroundColor = 'green';
        }
      }, 0);
      // while (filteredCell.parent != null) {
      //   filteredCell =
      //     path[filteredCell.parent[0] + '-' + filteredCell.parent[1]];
      //   element = document.getElementById(
      //     filteredCell.rIndex + '-' + filteredCell.cIndex
      //   )!;
      //   element.style.backgroundColor = 'green';
      // }
    }

    //=============
  };

  useEffect(() => {
    generateIntialmaze(m, n);
  }, []);
  useEffect(() => {
    if (dungeon.length > 0) {
      resetVisualization();
      shortestPath(dungeon, start, end, m, n);
    }
  }, [start, end, dungeon]);

  return (
    <div className="Dungeon_Page">
      <div className="Dungeon absolute-center">
        {dungeon.map((rowData, rowIndex) => {
          return (
            <div className="Dungeon__Row">
              {rowData.map((cell, columnIndex) => {
                return (
                  <div
                    className="Dungeon__Cell"
                    id={rowIndex + '-' + columnIndex}
                    onClick={() => toggleCellType(rowIndex, columnIndex)}
                  >
                    {handleCell(cell, rowIndex, columnIndex)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div>
        <input
          placeholder="M"
          value={m}
          onChange={(e) => setM(parseInt(e.target.value) || 0)}
        />
        <input
          placeholder="N"
          value={n}
          onChange={(e) => setN(parseInt(e.target.value) || 0)}
        />
        {m > 0 && n > 0 && (
          <button onClick={() => generateIntialmaze(m, n)}>
            Generate Maze
          </button>
        )}
      </div>
    </div>
  );
};
export default Dungeon;
