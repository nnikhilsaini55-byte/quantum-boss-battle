import React from 'react';
import { Award, XCircle, RotateCcw, ArrowRight, Sparkles, Swords, Atom, Shield, Cpu } from 'lucide-react';

/**
 * Animated Victory and Defeat Overlays:
 * - Victory fanfare with actual experiment results summary:
 *   - Post-selected fidelity & gain over raw baseline
 *   - Retained-shot fraction & accepted/rejected shots
 *   - Ancilla-qubit and 2Q gate overhead
 *   - Quantum benchmark score
 * - Balanced defeat guidance reflecting 50% damage reduction and dual-action rounds
 */
export default function OutcomeModal({
  phase = 'victory', // 'victory' | 'defeat'
  level,
  round,
  playerHp,
  playerMaxHp = 100,
  bossHp,
  lastResult,
  onNextLevel,
  onRetry,
  onRetreat,
  onOpenAdvancedReport,
}) {
  const isVictory = phase === 'victory';

  return (
    <div className="outcome-modal-backdrop">
      <div className={`outcome-card ${isVictory ? 'card-victory' : 'card-defeat'}`}>
        {/* Animated Outcome Crest */}
        <div className="outcome-crest-wrap">
          <div className="crest-halo" />
          <div className="crest-icon">
            {isVictory ? <Award size={52} /> : <XCircle size={52} />}
          </div>
        </div>

        {/* Title & Headline */}
        <h2>{isVictory ? `VICTORY! ${level.boss} DEFEATED` : 'QUANTUM CORE COLLAPSED'}</h2>

        <p className="outcome-description">
          {isVictory
            ? `Spectacular tactical execution! You successfully neutralized ${level.boss} on Level ${level.id < 10 ? `0${level.id}` : level.id}. Spacetime syndrome post-selection filtered decoherence noise and preserved stabilizer fidelity.`
            : `Circuit noise decoherence overwhelmed the Quantum Core before error syndrome checks could stabilize the state. ${level.boss} remains active.`}
        </p>

        {/* Battle Performance Stats Grid */}
        <div className="outcome-kpi-grid">
          <div className="kpi-box">
            <span>ROUNDS SURVIVED</span>
            <strong>{round}</strong>
          </div>

          <div className="kpi-box">
            <span>CORE INTEGRITY</span>
            <strong className={playerHp > 0 ? 'text-cyan' : 'text-red'}>
              {playerHp} / {playerMaxHp} HP
            </strong>
          </div>

          {lastResult && (
            <div className="kpi-box">
              <span>POST-SEL FIDELITY</span>
              <strong className={lastResult.shot_starvation || lastResult.postselected_fidelity === null ? 'text-yellow' : 'text-cyan'}>
                {lastResult.shot_starvation || lastResult.postselected_fidelity === null
                  ? 'UNAVAILABLE'
                  : `${(lastResult.postselected_fidelity * 100).toFixed(1)}%`}
              </strong>
              <small style={{ color: '#8fa3bc', fontSize: 10 }}>
                {lastResult.shot_starvation || lastResult.postselected_fidelity === null
                  ? `Raw Est: ${(lastResult.raw_estimate_fidelity ? (lastResult.raw_estimate_fidelity * 100).toFixed(1) : (lastResult.raw_fidelity * 100).toFixed(1))}% (Starved)`
                  : `Raw: ${(lastResult.raw_fidelity * 100).toFixed(1)}% (Δ ${((lastResult.postselected_fidelity - lastResult.raw_fidelity) * 100) >= 0 ? '+' : ''}${((lastResult.postselected_fidelity - lastResult.raw_fidelity) * 100).toFixed(1)}%)`}
              </small>
            </div>
          )}

          {lastResult && (
            <div className="kpi-box">
              <span>SHOTS RETAINED</span>
              <strong className="text-green">
                {lastResult.retained_percent}%
              </strong>
              <small style={{ color: '#8fa3bc', fontSize: 10 }}>
                {lastResult.retained_shots_across_stabilizers ?? lastResult.retained_shots} kept / {lastResult.discarded_shots ?? 0} rejected
              </small>
            </div>
          )}

          {lastResult && (
            <div className="kpi-box">
              <span>CIRCUIT OVERHEAD</span>
              <strong className="text-purple">
                +{lastResult.ancilla_qubits_added ?? lastResult.checks_used ?? 0} Ancilla
              </strong>
              <small style={{ color: '#8fa3bc', fontSize: 10 }}>
                +{lastResult.added_two_qubit_gates ?? 0} 2Q Gates / +{lastResult.added_circuit_depth ?? 0} Depth
              </small>
            </div>
          )}

          {lastResult && (
            <div className="kpi-box">
              <span>BENCHMARK SCORE</span>
              <strong className="text-gold">
                {lastResult.score} / 100
              </strong>
              <small style={{ color: '#8fa3bc', fontSize: 10 }}>
                Aer Verified
              </small>
            </div>
          )}
        </div>

        {/* Tactical Advice for Defeat */}
        {!isVictory && (
          <div className="defeat-advice-box">
            <Atom size={16} className="text-cyan" />
            <span>
              <strong>Tactical Insight:</strong> Select <strong>DEFEND</strong> to deploy spacetime checks that mitigate incoming boss damage by ~50% (min 1 damage), and combine it with <strong>ATTACK</strong> during the same round to deal damage while preserving Core HP!
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="outcome-button-row">
          {isVictory ? (
            <>
              <button className="outcome-btn btn-primary" onClick={onNextLevel}>
                <Sparkles size={16} />
                <span>NEXT LEVEL</span>
                <ArrowRight size={16} />
              </button>

              <button className="outcome-btn btn-secondary" onClick={onRetry}>
                <RotateCcw size={15} />
                <span>REPLAY LEVEL</span>
              </button>

              {onOpenAdvancedReport && (
                <button className="outcome-btn btn-gold-report" onClick={onOpenAdvancedReport}>
                  <Award size={15} style={{ color: '#ffbe0b' }} />
                  <span>ADVANCED REPORT</span>
                </button>
              )}

              <button className="outcome-btn btn-tertiary" onClick={onRetreat}>
                MISSION SELECT
              </button>
            </>
          ) : (
            <>
              <button className="outcome-btn btn-primary btn-retry-main" onClick={onRetry}>
                <RotateCcw size={16} />
                <span>RETRY BATTLE</span>
              </button>

              {onOpenAdvancedReport && (
                <button className="outcome-btn btn-gold-report" onClick={onOpenAdvancedReport}>
                  <Award size={15} style={{ color: '#ffbe0b' }} />
                  <span>ADVANCED REPORT</span>
                </button>
              )}

              <button className="outcome-btn btn-secondary" onClick={onRetreat}>
                MISSION SELECT
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
