import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, ArrowLeft, ArrowRight, Play, Users } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { PlayerFairnessView } from '../components/PlayerFairnessView';
import { storage } from '../../shared/utils/storage';
import { gameService } from '../../services/game/gameService';
import type { FairnessStepNumber, PlayerSession, DbGameSession } from '../../shared/types';

export const FairnessPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState<PlayerSession | null>(null);
  const [previewStep, setPreviewStep] = useState<FairnessStepNumber>(0);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  useEffect(() => {
    const existing = storage.getPlayerSession();
    if (existing && existing.sessionId) {
      setActiveSession(existing);
      // Check if session is actively in fairness stage
      gameService.getSessionById(existing.sessionId).then((game: DbGameSession | null) => {
        if (game && game.game_stage === 'fairness') {
          navigate('/play');
        }
      });
    }
  }, [navigate]);

  const sampleSession: PlayerSession = activeSession || {
    playerId: 'demo-player-fairness',
    sessionId: 'demo-session-fairness',
    anonymousName: 'Demo Player',
    gameCode: 'DEMO99',
    joinedAt: new Date().toISOString()
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge variant="cyan">
            <Scale size={12} style={{ marginRight: '4px' }} />
            CASE 9: MAKE IT FAIR
          </Badge>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Interactive Challenge {isPreviewMode ? '(Standalone Preview Mode)' : ''}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {activeSession && (
            <Button variant="primary" size="small" icon={<Play size={13} />} onClick={() => navigate('/play')}>
              Go to Active Game
            </Button>
          )}
          <Button variant="secondary" size="small" icon={<ArrowLeft size={13} />} onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
      </div>

      {!isPreviewMode && !activeSession ? (
        <Card glow="cyan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(2, 132, 199, 0.1)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <Scale size={28} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              MAKE IT FAIR CHALLENGE
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
              In Case 9, students transition from observing algorithmic bias to designing intentional decision rules, testing for consistency and transparency, and reflecting on accountability.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <Button variant="primary" icon={<Play size={16} />} onClick={() => setIsPreviewMode(true)}>
                TRY STANDALONE PREVIEW
              </Button>
              <Button variant="secondary" icon={<Users size={16} />} onClick={() => navigate('/join')}>
                JOIN LIVE CLASSROOM
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Step selector for standalone preview */}
          {(!activeSession || isPreviewMode) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 1rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setPreviewStep((p) => Math.max(0, p - 1) as FairnessStepNumber)}
                disabled={previewStep <= 0}
                icon={<ArrowLeft size={13} />}
              >
                Prev
              </Button>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Step {previewStep} of 9
              </span>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setPreviewStep((p) => Math.min(9, p + 1) as FairnessStepNumber)}
                disabled={previewStep >= 9}
                icon={<ArrowRight size={13} />}
              >
                Next
              </Button>
            </div>
          )}

          <PlayerFairnessView
            currentStep={previewStep}
            session={sampleSession}
          />
        </div>
      )}
    </div>
  );
};
