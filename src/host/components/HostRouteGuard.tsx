import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldAlert, KeyRound, ArrowLeft } from 'lucide-react';
import { storage } from '../../shared/utils/storage';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';

export const HostRouteGuard: React.FC = () => {
  const hostSession = storage.getHostSession();
  const isAuthenticated = !!hostSession?.isAuthenticated;

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--bg-primary)'
      }}>
        <Card glow="purple" style={{ maxWidth: '460px', width: '100%', textAlign: 'center' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1rem 0'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={28} />
            </div>

            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                HOST ACCESS RESTRICTED
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                Administrative privileges required to access the Host Control Room. Normal player sessions cannot execute game commands.
              </p>
            </div>

            <div style={{
              width: '100%',
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}>
              Authorization boundary: Verification token missing or expired.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              <Link to="/host" style={{ textDecoration: 'none' }}>
                <Button variant="purple" block icon={<KeyRound size={16} />}>
                  AUTHENTICATE AS HOST
                </Button>
              </Link>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" block icon={<ArrowLeft size={16} />}>
                  RETURN TO PLAYER SIMULATOR
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return <Outlet />;
};
