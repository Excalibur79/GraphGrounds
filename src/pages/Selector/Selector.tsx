import React from 'react';
import maze from '../../assets/images/maze.png';
import './Selector.scss';
const Selector = (props: any) => {
  const applications = [
    {
      name: 'Dungeon',
      image: maze,
      path: '/problem/dungeon',
    },
  ];

  return (
    <div className="Selector">
      <div className="Selector__Options">
        {applications.map((app) => {
          return (
            <div
              className="Selector__Options__Application"
              onClick={() => props.history.push(app.path)}
            >
              <img src={app.image} />
              <div>{app.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Selector;
