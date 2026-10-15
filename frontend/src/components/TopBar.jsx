import React from 'react';
import { Shield, BookOpen, Swords, Award, Atom } from 'lucide-react';

export default function TopBar({ currentLevel, view = 'arena', onNavigateHome, onOpenRules, onOpenReport }) {
  return (
    <header className="topbar-component">
      <div className="brand-group" onClick={onNavigateHome} style={{ cursor: 'pointer' }}>
        <div className="brand-icon-box"><Shield size={22} /></div>
        <div className="brand-titles">
          <div className="main-title"><b>QUANTUM</b><span>BOSS BATTLE</span></div>
          <span className="sub-title">QISKIT FALL FEST 2026 ADVANCED TRACK</span>
        </div>
      </div>

      {view === 'arena' && currentLevel && (
        <div className="topbar-level-indicator">
          <div className="level-tag-line">
            <span className="mission-label">MISSION TARGET:</span>
            <span className={`diff-tag ${currentLevel.badgeClass || 'd1'}`}>{currentLevel.difficulty}</span>
          </div>
          <strong className="boss-title">{currentLevel.boss}</strong>
        </div>
      )}

      <div className="topbar-actions-group">
        <div className="status-pill-container" title="Qiskit Aer Simulator Ready">
          <span className="status-dot online" />
          <span className="status-label">AER ONLINE</span>
        </div>

        {onOpenReport && (
          <button type="button" className="top-nav-btn" onClick={onOpenReport} title="View Qiskit Fall Fest Advanced Track Report">
            <Award size={14} style={{ color: '#ffbe0b' }} />
            <span>ADVANCED REPORT</span>
          </button>
        )}

        <button type="button" className="top-nav-btn" onClick={onOpenRules} title="View Game Rules & Quantum Tutorial">
          <BookOpen size={14} />
          <span>TUTORIAL & RULES</span>
        </button>
      </div>
    </header>
  );
}
