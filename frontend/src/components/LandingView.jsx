import React from 'react';
import { Shield, Swords, Play, CheckCircle2, BookOpen, Atom } from 'lucide-react';

export default function LandingView({
  levels,
  selectedLevelId,
  onSelectLevel,
  onStartBattle,
  onOpenRules,
}) {
  const current = levels.find(level => level.id === selectedLevelId) || levels[0];

  return (
    <div className="landing-view-container">
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> QISKIT FALL FEST 2026 / ADVANCED TRACK</div>
          <h1>PROTECT THE<br /><em>QUANTUM CORE.</em></h1>
          <p>
            Survive noisy decoherence channels with genuine quantum error detection. Execute payload circuits with <strong>ATTACK</strong>, deploy spacetime Pauli checks with <strong>DEFEND</strong>, or select <strong>BOTH</strong> in the same round!
          </p>
          <div className="hero-pills">
            <span><Swords size={14} /> PAYLOAD ATTACK (+FIDELITY BONUS)</span>
            <span><Shield size={14} /> 50% SHIELD MITIGATION</span>
            <span><Atom size={14} /> REAL QISKIT AER SIMULATION</span>
          </div>
        </div>
        <div className="hero-core-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="core-box"><Shield size={74} strokeWidth={1.2} /></div>
          <div className="core-status-label">AER SIMULATOR <b>● ONLINE</b></div>
          <div className="floating-node n1">|ψ⟩</div>
          <div className="floating-node n2">Z</div>
          <div className="floating-node n3">X</div>
        </div>
      </section>

      <section className="section-heading-row">
        <div>
          <div className="eyebrow">01 / SELECT YOUR MISSION</div>
          <h2>Choose a boss to challenge</h2>
        </div>
        <div className="muted-hint">Attack to execute the payload circuit. Defend to deploy spacetime checks.</div>
      </section>

      <section className="missions-grid">
        {levels.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectLevel(item.id)}
            className={`mission-card ${selectedLevelId === item.id ? 'active-mission' : ''}`}
          >
            <div className="card-top-bar">
              <span>LEVEL {item.id < 10 ? `0${item.id}` : item.id}</span>
              <span className={`diff-badge ${item.badgeClass || 'd1'}`}>{item.difficulty}</span>
            </div>
            <div className={`mission-boss-icon ${item.bossClass || 'boss1'}`}><Swords size={32} /></div>
            <h3>{item.boss}</h3>
            <p>{item.desc}</p>
            <div className="card-footer-action">
              {selectedLevelId === item.id
                ? <span className="selected-text"><CheckCircle2 size={15} /> SELECTED</span>
                : <span>SELECT MISSION ↗</span>}
            </div>
          </button>
        ))}
      </section>

      <section className="battle-config-layout">
        <div className="config-panel">
          <div className="panel-title-bar">
            <div><div className="eyebrow">02 / READY UP</div><h2>Combat Strategy</h2></div>
            <Shield size={22} className="text-cyan" />
          </div>
          <div className="briefing-content">
            <p><strong>ATTACK:</strong> Executes the 2-qubit payload circuit. Deals <strong>{current.playerBaseAttack || 20} base damage</strong> plus a quantum bonus derived from genuine post-selected fidelity.</p>
            <p><strong>DEFEND:</strong> Deploys spacetime Pauli checks with ancilla qubits. Absorbs <strong>~50% of incoming boss damage</strong> (min 1 damage).</p>
            <p><strong>DUAL-ACTION:</strong> You can select both Attack and Defend in the same round before resolving!</p>
          </div>
          <button type="button" className="btn-launch-battle" onClick={onStartBattle}>
            <Play size={18} fill="currentColor" /><span>ENTER BATTLE ARENA</span><Swords size={18} />
          </button>
          <button type="button" className="top-nav-btn" onClick={onOpenRules} style={{ marginTop: 12 }}>
            <BookOpen size={14} /> TUTORIAL & RULES
          </button>
        </div>

        <div className="briefing-panel">
          <div className="panel-title-bar">
            <div><div className="eyebrow">03 / MISSION BRIEFING</div><h2>Target: {current.boss}</h2></div>
            <Swords size={22} className="text-cyan" />
          </div>
          <div className="briefing-content">
            <div className="briefing-avatar-box"><Swords size={44} /></div>
            <h3>Mission Ready: {current.name}</h3>
            <p>{current.desc} Balance fidelity improvement against retained-shot fraction using spacetime error-detection checks to defeat this boss.</p>
            <div className="briefing-stats-row">
              <div className="stat-col"><span>BOSS HP</span><strong>{current.maxHp}</strong></div>
              <div className="stat-col"><span>ATTACK DAMAGE</span><strong>{current.bossAttack}</strong></div>
              <div className="stat-col"><span>DIFFICULTY</span><strong>{current.difficulty}</strong></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
