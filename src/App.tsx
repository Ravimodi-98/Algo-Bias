import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Player Architecture
import { PlayerLayout } from './player/layout/PlayerLayout';
import { LandingPage } from './player/pages/LandingPage';
import { JoinPage } from './player/pages/JoinPage';
import { LobbyPage } from './player/pages/LobbyPage';
import { PlayPlaceholderPage } from './player/pages/PlayPlaceholderPage';
import { RevealPlaceholderPage } from './player/pages/RevealPlaceholderPage';
import { FairnessPlaceholderPage } from './player/pages/FairnessPlaceholderPage';
import { ResultsPlaceholderPage } from './player/pages/ResultsPlaceholderPage';

// Host Architecture
import { HostEntryPage } from './host/pages/HostEntryPage';
import { HostRouteGuard } from './host/components/HostRouteGuard';
import { HostLayout } from './host/layout/HostLayout';
import { HostDashboardPage } from './host/pages/HostDashboardPage';
import { HostCreatePlaceholderPage } from './host/pages/HostCreatePlaceholderPage';
import { HostLobbyPage } from './host/pages/HostLobbyPage';
import { HostGamePlaceholderPage } from './host/pages/HostGamePlaceholderPage';
import { HostResultsPlaceholderPage } from './host/pages/HostResultsPlaceholderPage';
import { HostSettingsPlaceholderPage } from './host/pages/HostSettingsPlaceholderPage';

// Shared / Fallback
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================================================================= */}
        {/* 1. PLAYER ROUTES (Strictly isolated from Host components/controls) */}
        {/* ================================================================= */}
        <Route element={<PlayerLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/play" element={<PlayPlaceholderPage />} />
          <Route path="/reveal" element={<RevealPlaceholderPage />} />
          <Route path="/fairness" element={<FairnessPlaceholderPage />} />
          <Route path="/results" element={<ResultsPlaceholderPage />} />
        </Route>

        {/* ================================================================= */}
        {/* 2. HOST ENTRY GATE (Standalone authentication entry point)       */}
        {/* ================================================================= */}
        <Route path="/host" element={<HostEntryPage />} />

        {/* ================================================================= */}
        {/* 3. HOST PROTECTED ROUTES (Requires Host Authorization)           */}
        {/* ================================================================= */}
        <Route element={<HostRouteGuard />}>
          <Route element={<HostLayout />}>
            <Route path="/host/dashboard" element={<HostDashboardPage />} />
            <Route path="/host/create" element={<HostCreatePlaceholderPage />} />
            <Route path="/host/lobby" element={<HostLobbyPage />} />
            <Route path="/host/game" element={<HostGamePlaceholderPage />} />
            <Route path="/host/results" element={<HostResultsPlaceholderPage />} />
            <Route path="/host/settings" element={<HostSettingsPlaceholderPage />} />
          </Route>
        </Route>

        {/* ================================================================= */}
        {/* 4. CATCH-ALL 404 ROUTE                                           */}
        {/* ================================================================= */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
