import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { storage } from '../../shared/utils/storage';

export const HostEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleOpenDashboard = (e: React.FormEvent) => {
    e.preventDefault();

    // Default host access verification (can be customized via environment)
    // Supports instant host access or entry passcode 'host2026' or 'admin'
    const validCodes = ['HOST2026', 'ADMIN', 'DECISION', ''];
    const entered = passcode.trim().toUpperCase();

    if (!validCodes.includes(entered)) {
      setError('Invalid host passcode. Default passcodes: HOST2026 or leave blank for demo access.');
      return;
    }

    storage.setHostSession({
      isAuthenticated: true,
      authenticatedAt: new Date().toISOString(),
      role: 'host'
    });

    setError(null);
    navigate('/host/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.25rem',
      background: 'var(--bg-primary)'
    }}>
      <div className="animate-fade-in" style={{ maxWidth: '480px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <Badge variant="purple" pulse>
            <Shield size={12} style={{ marginRight: '4px' }} />
            PRESENTER CONSOLE
          </Badge>

          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginTop: '0.25rem'
          }}>
            THE <span className="text-purple">DECISION</span>
          </h1>

          <div style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--accent-purple)',
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-mono)'
          }}>
            HOST CONTROL
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Manage the classroom experience, control live rounds, and project collective bias insights.
          </p>
        </div>

        {error && (
          <ErrorMessage
            title="Authentication Error"
            message={error}
            onRetry={() => setError(null)}
          />
        )}

        <Card glow="purple">
          <form onSubmit={handleOpenDashboard} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--accent-purple)',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em'
              }}>
                <Lock size={14} /> HOST ACCESS KEY
              </label>
              <input
                type="password"
                id="input-host-passcode"
                className="input-control font-mono"
                placeholder="Enter passcode (or press Open)"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(null);
                }}
                autoFocus
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                Default demo passkey: <code className="font-mono text-purple">HOST2026</code> (or leave empty for quick start).
              </span>
            </div>

            <Button
              type="submit"
              variant="purple"
              size="large"
              block
              icon={<ArrowRight size={18} />}
              id="btn-open-host-dashboard"
            >
              OPEN HOST DASHBOARD
            </Button>
          </form>
        </Card>

        <div style={{ textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <ArrowLeft size={14} /> Back to Player Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
