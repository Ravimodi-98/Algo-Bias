import React from 'react';
import { Outlet } from 'react-router-dom';
import { PlayerHeader } from '../components/PlayerHeader';
import './PlayerLayout.css';

export const PlayerLayout: React.FC = () => {
  return (
    <div className="player-wrapper">
      <div className="player-container">
        <PlayerHeader />
        <main className="player-content">
          <Outlet />
        </main>
        <footer className="player-footer">
          <span>THE DECISION &bull; Digital Ethics & Responsible AI</span>
        </footer>
      </div>
    </div>
  );
};
