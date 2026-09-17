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
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.75rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.5rem',
      flexWrap: 'wrap',
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
    }}>
      {/* Brand & Mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(124, 58, 237, 0.08)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-purple)'
        }}>
          <Shield size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
              THE DECISION
            </span>
            <Badge variant="purple" pulse>
              <Radio size={12} style={{ marginRight: '2px' }} />
              HOST CONSOLE
            </Badge>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            PRESENTER & CONTROL ROOM MODE
          </span>
        </div>
      </div>

      {/* Navigation tabs for Host */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }} aria-label="Host Navigation">
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
              background: isActive ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
              border: isActive ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid transparent'
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
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            minHeight: '36px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fee2e2';
            e.currentTarget.style.borderColor = 'var(--color-danger)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fef2f2';
            e.currentTarget.style.borderColor = '#fecaca';
          }}
          aria-label="Exit Host Console"
        >
          <LogOut size={14} /> Exit Console
        </button>
      </div>
    </header>
  );
};
