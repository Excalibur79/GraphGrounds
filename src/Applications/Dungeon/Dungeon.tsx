import React, { useState, useEffect, useMemo } from 'react';
import { clone } from 'ramda';
import { Cell, ICell, Queue, IQueue } from './Classes';
import './Dungeon.scss';
import rock from '../../assets/images/rock.png';
const Dungeon = (props: any) => {
  const [dungeon, setDungeon] = useState<ICell[][]>([]);
  const [start, setStart] = useState<number[]>([0, 0]);
  const [end, setEnd] = useState<number[]>([8, 7]);
  const m = 10;
  const n = 10;
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

  const generateDefaultPath = (rows: number, columns: number) => {
    let maze = clone(dungeon);
    //Intializing visited matrix

    //=======================
    //pushing Start indexes

    let dr = [-1, +1, 0, 0];
    let dc = [0, 0, -1, +1];
    console.log(maze[0][0]);
    let cell = maze[start[0]][start[1]];
    cell.blocked = false;
    let endReached = false;
    while (!endReached || cell.rIndex === rows - 1) {
      let r = cell.rIndex;
      let c = cell.cIndex;
      for (let i = 0; i < 4; i++) {
        let rr = r + dr[i];
        let cc = c + dc[i];
        if (rr === end[0] && cc === end[1]) {
          endReached = true;
          maze[rr][cc].blocked = false;
        }
      }
      if (!endReached) {
        let valid = false;
        let randomIndex;
        do {
          randomIndex = Math.random() * 4;
          if (
            r + dr[randomIndex] >= 0 &&
            r + dr[randomIndex] < rows &&
            c + dc[randomIndex] >= 0 &&
            c + dc[randomIndex] < columns
          ) {
            valid = true;
          }
        } while (!valid);
        cell = maze[r + dr[randomIndex]][c + dc[randomIndex]];
        cell.blocked = false;
      }
    }
    console.log('new maze with definite path is :', maze);
  };

  const handleCell = (cell: ICell, rowIndex: number, columnIndex: number) => {
    if (cell.blocked) return <img src={rock} />;
    else if (rowIndex == start[0] && columnIndex == start[1])
      return <div>S</div>;
    else if (rowIndex == end[0] && columnIndex == end[1]) return <div>E</div>;
    else return <div></div>;
  };

  useEffect(() => {
    generateIntialmaze(m, n);
    setStart([0, 0]);
  }, []);

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
                  >
                    {handleCell(cell, rowIndex, columnIndex)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Dungeon;
