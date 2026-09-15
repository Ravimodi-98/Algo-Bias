import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Card } from '../shared/components/Card';
import { Button } from '../shared/components/Button';
import { Badge } from '../shared/components/Badge';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'var(--bg-primary)'
    }}>
      <Card glow="cyan" style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          <Badge variant="cyan">
            <Compass size={12} style={{ marginRight: '4px' }} />
            404 ERROR
          </Badge>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ROUTE NOT FOUND
          </h1>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            The requested location does not exist in the simulator.
          </p>

          <Link to="/" style={{ textDecoration: 'none', width: '100%' }}>
            <Button variant="primary" block icon={<ArrowLeft size={16} />}>
              Return to Simulator Entry
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
