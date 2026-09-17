import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield } from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <Badge variant="cyan" pulse>
          <Sparkles size={12} style={{ marginRight: '4px' }} />
          INTERACTIVE EXPERIMENT
        </Badge>
        
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          color: 'var(--text-primary)',
          marginTop: '0.5rem'
        }}>
          THE <span className="text-cyan">DECISION</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          fontWeight: 600,
          color: 'var(--accent-cyan)',
          letterSpacing: '-0.01em'
        }}>
          Would You Make a Fair Algorithm?
        </p>
      </div>

      <Card glow="cyan">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
          <div style={{
            fontSize: '1.5rem',
            lineHeight: 1,
            display: 'inline-block',
            margin: '0 auto',
            padding: '0.75rem',
            borderRadius: '50%',
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid rgba(0, 240, 255, 0.2)'
          }}>
            🤖
          </div>
          
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-primary)',
            lineHeight: 1.6,
            fontWeight: 400
          }}>
            You are about to step into the role of an <strong className="text-cyan">AI decision-making system</strong>.
          </p>

          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}>
            Evaluate candidates, make high-stakes selections, and discover how the data presented influences decisions.
          </p>
        </div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Button
          variant="primary"
          size="large"
          block
          icon={<ArrowRight size={18} />}
          onClick={() => navigate('/join')}
          id="btn-join-game-landing"
        >
          JOIN GAME
        </Button>

        <Button
          variant="secondary"
          size="large"
          block
          icon={<Sparkles size={18} />}
          onClick={() => navigate('/reveal')}
          id="btn-explore-reveal-landing"
          style={{
            borderColor: 'var(--accent-purple)',
            color: 'var(--accent-purple)',
            background: 'rgba(124, 58, 237, 0.04)'
          }}
        >
          EXPLORE BIAS REVEAL (CASE 8)
        </Button>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        <Shield size={14} />
        <span>100% Anonymous &bull; No personal data collected</span>
      </div>
    </div>
  );
};
