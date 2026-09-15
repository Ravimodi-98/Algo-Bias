import React from 'react';
import { Outlet } from 'react-router-dom';
import { HostHeader } from '../components/HostHeader';
import './HostLayout.css';

export const HostLayout: React.FC = () => {
  return (
    <div className="host-wrapper">
      <HostHeader />
      <main className="host-main-container">
        <Outlet />
      </main>
      <footer className="host-footer">
        <div>
          <span>THE DECISION Host Console &bull; Projector Ready &bull; High Contrast Display</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)' }}>
          Session: <span className="text-purple">AUTHENTICATED HOST</span>
        </div>
      </footer>
    </div>
  );
};
