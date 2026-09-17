import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Shield, Radio, LogOut, LayoutDashboard, PlusCircle, Users, Play, BarChart2, Settings, Sparkles } from 'lucide-react';
import { Badge } from '../../shared/components/Badge';
import { storage } from '../../shared/utils/storage';

export const HostHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.clearHostSession();
    navigate('/host');
  };

  const navItems = [
    { label: 'Dashboard', path: '/host/dashboard', icon: <LayoutDashboard size={15} /> },
    { label: 'Create Room', path: '/host/create', icon: <PlusCircle size={15} /> },
    { label: 'Live Lobby', path: '/host/lobby', icon: <Users size={15} /> },
    { label: 'Game Control', path: '/host/game', icon: <Play size={15} /> },
    { label: 'Bias Reveal', path: '/host/reveal', icon: <Sparkles size={15} /> },
    { label: 'Results', path: '/host/results', icon: <BarChart2 size={15} /> },
    { label: 'Settings', path: '/host/settings', icon: <Settings size={15} /> },
  ];

  return (
    <header style={{
      background: 'rgba(17, 21, 29, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-purple)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.75rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.5rem',
      flexWrap: 'wrap'
    }}>
      {/* Brand & Mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid var(--accent-purple)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-purple)',
          boxShadow: '0 0 12px rgba(139, 92, 246, 0.3)'
        }}>
          <Shield size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
              THE DECISION
            </span>
            <Badge variant="purple" pulse>
              <Radio size={12} style={{ marginRight: '2px' }} />
              HOST CONSOLE
            </Badge>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            PRESENTER & CONTROL ROOM MODE
          </span>
        </div>
      </div>

      {/* Navigation tabs for Host */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all var(--transition-fast)',
              color: isActive ? 'var(--accent-purple)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
              border: isActive ? '1px solid var(--border-purple)' : '1px solid transparent'
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Host session controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#fca5a5',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.color = '#fca5a5';
          }}
        >
          <LogOut size={14} /> Exit Console
        </button>
      </div>
    </header>
  );
};
