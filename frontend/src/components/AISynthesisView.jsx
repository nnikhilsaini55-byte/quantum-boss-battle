import React from 'react';
import { Brain, Sparkles, Play, ArrowRight, ArrowLeft } from 'lucide-react';

/**
 * AI Level Synthesis View ("Process Next"):
 * Evaluates previous mission performance to generate adaptive next level.
 */
export default function AISynthesisView({
  loading,
  synthesizedLevel,
  lastResult,
  round,
  playerHp,
  onEngageLevel,
  onReturnHome,
}) {
  return (
    <div className="synthesis-view-shell">
      <div className="synthesis-hero">
        <div className="synthesis-pulse-icon">
          <Brain size={38} />
        </div>
        <h2>ADAPTIVE AI LEVEL SYNTHESIZER</h2>
        <p>
          The Smart AI Matrix has analyzed your previous mission's quantum telemetry. By evaluating stabilizer fidelity, shot retention, and error mitigation efficiency, the AI has generated the next evolved quantum battle.
        </p>
      </div>

      {/* Telemetry Vector from Previous Level */}
      <div className="telemetry-vector-grid">
        <div className="telemetry-cell">
          <span>POST-SELECTED FIDELITY</span>
          <strong>
            {lastResult
              ? (lastResult.shot_starvation || lastResult.postselected_fidelity === null
                  ? 'UNAVAILABLE'
                  : `${(lastResult.postselected_fidelity * 100).toFixed(1)}%`)
              : '95.0%'}
          </strong>
        </div>
        <div className="telemetry-cell">
          <span>SHOTS RETAINED</span>
          <strong>{lastResult ? `${lastResult.retained_percent}%` : '90.0%'}</strong>
        </div>
        <div className="telemetry-cell">
          <span>ROUNDS TAKEN</span>
          <strong>{round}</strong>
        </div>
        <div className="telemetry-cell">
          <span>CORE INTEGRITY</span>
          <strong>{playerHp} HP</strong>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="spinner" />
          <h3>Synthesizing Adaptive Quantum Circuit…</h3>
          <p>Evolving noise models and entangling layers tailored to your combat history.</p>
        </div>
      ) : synthesizedLevel ? (
        <div className="generated-boss-card">
          <div className="gen-card-header">
            <div className="gen-boss-title">
              <b>{synthesizedLevel.boss}</b>
              <span>LEVEL {synthesizedLevel.id < 10 ? `0${synthesizedLevel.id}` : synthesizedLevel.id} · {synthesizedLevel.difficulty}</span>
            </div>
            <span className={`diff-badge ${synthesizedLevel.badgeClass || 'd3'}`}>ADAPTIVE TIED</span>
          </div>

          <div className="ai-genesis-box">
            <b><Sparkles size={13} style={{ display: 'inline', marginRight: 4 }} /> AI GENESIS SYNTHESIS REPORT:</b>
            {synthesizedLevel.aiGenesisReport}
          </div>

          <div className="gen-stats-row">
            <div className="gen-stat">
              <span>CIRCUIT DEPTH</span>
              <b>{synthesizedLevel.depth} Layers</b>
            </div>
            <div className="gen-stat">
              <span>GATE NOISE</span>
              <b>{(synthesizedLevel.gateNoise * 100).toFixed(2)}%</b>
            </div>
            <div className="gen-stat">
              <span>BOSS HP</span>
              <b>{synthesizedLevel.maxHp} HP</b>
            </div>
            <div className="gen-stat">
              <span>BASE ATTACK</span>
              <b>{synthesizedLevel.bossAttack} DMG</b>
            </div>
          </div>

          <p className="topology-text">
            <strong>Circuit Topology:</strong> {synthesizedLevel.quantumCircuitSummary}
          </p>
          <p className="strategy-text">
            <strong>AI Recommended Strategy:</strong> {synthesizedLevel.recommendedTactics}
          </p>

          <div className="synthesis-cta-row">
            <button className="btn-engage-gen" onClick={() => onEngageLevel(synthesizedLevel)}>
              <Play size={16} fill="currentColor" />
              <span>ENGAGE GENERATED LEVEL</span>
              <ArrowRight size={16} />
            </button>
            <button className="btn-back-flat" onClick={onReturnHome}>
              <ArrowLeft size={14} /> MISSION SELECT
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>No synthesized level available. Return to mission select.</p>
          <button className="btn-back-flat" onClick={onReturnHome}>RETURN</button>
        </div>
      )}
    </div>
  );
}
