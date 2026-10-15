import React from 'react';
import { Swords, Shield, Zap, Play, CheckCircle2, RotateCcw, Sliders } from 'lucide-react';

/**
 * Combat Controls with Dual-Action Selection:
 * - Both Attack and Defend remain visible and selectable.
 * - Clicking Attack does NOT disable Defend.
 * - Clicking Defend does NOT disable Attack.
 * - Player can select Attack, Defend, or BOTH in either order.
 * - Visual badges clearly indicate selected actions.
 * - "RESOLVE ROUND" button executes the chosen round action(s).
 * - Action selections reset cleanly at the start of each new round.
 */
export default function CombatControls({
  onToggleAttack,
  onToggleDefend,
  onResolveRound,
  onClearSelection,
  selectedAttack = false,
  selectedDefend = false,
  defendCharges = 0,
  disabled = false,
  phase = 'player_turn',
  round = 1,
  currentLevel = null,
  checks = 1,
  onSetChecks = null,
  shots = 500,
  onSetShots = null,
  numTGates = 0,
  onSetNumTGates = null,
  targetQubits = [0, 1],
  onSetTargetQubits = null,
}) {
  const canAct = phase === 'player_turn' && !disabled;
  const canDefend = canAct && (defendCharges > 0 || selectedDefend);
  const hasSelection = selectedAttack || selectedDefend;

  const placementValue = (targetQubits && targetQubits.length === 1 && targetQubits[0] === 0)
    ? 'q0'
    : (targetQubits && targetQubits.length === 1 && targetQubits[0] === 1)
    ? 'q1'
    : 'both';

  const handlePlacementChange = (e) => {
    const val = e.target.value;
    if (!onSetTargetQubits) return;
    if (val === 'q0') onSetTargetQubits([0]);
    else if (val === 'q1') onSetTargetQubits([1]);
    else onSetTargetQubits([0, 1]);
  };

  let resolveLabel = 'SELECT AN ACTION';
  if (selectedAttack && selectedDefend) {
    resolveLabel = 'RESOLVE ROUND (ATTACK + DEFEND)';
  } else if (selectedAttack) {
    resolveLabel = 'RESOLVE ROUND (ATTACK ONLY)';
  } else if (selectedDefend) {
    resolveLabel = 'RESOLVE ROUND (DEFEND ONLY)';
  }

  return (
    <div className="combat-controls-panel">
      {/* 1. TOP HEADER: Strategy & Loadout Options */}
      <div className="controls-top-row">
        <div className="controls-heading">
          <Sliders size={15} />
          <span>ROUND {round} — QUANTUM COMBAT DOCK</span>
        </div>

        <div className="quick-loadout-config">
          {/* Spacetime Checks Selector */}
          <div className="quick-config-item" title="Spacetime error-detection checks used when defending">
            <span>CHECKS:</span>
            <select
              className="dock-select"
              value={checks}
              onChange={e => onSetChecks && onSetChecks(Number(e.target.value))}
              disabled={disabled}
            >
              <option value={0}>0 (Unprotected)</option>
              <option value={1}>1 Check (Balanced)</option>
              <option value={2}>2 Checks (Aggressive)</option>
            </select>
          </div>

          {/* Check Placement Selector */}
          <div className="quick-config-item" title="Target qubits for spacetime error-detection checks">
            <span>PLACEMENT:</span>
            <select
              className="dock-select"
              value={placementValue}
              onChange={handlePlacementChange}
              disabled={disabled}
            >
              <option value="both">Both qubits (q0, q1)</option>
              <option value="q0">q0 only</option>
              <option value="q1">q1 only</option>
            </select>
          </div>

          {/* Circuit Family / T-Gates Selector */}
          <div className="quick-config-item" title="Clifford vs T-doped circuit configuration">
            <span>CIRCUIT:</span>
            <select
              className="dock-select"
              value={numTGates}
              onChange={e => onSetNumTGates && onSetNumTGates(Number(e.target.value))}
              disabled={disabled}
            >
              <option value={0}>Clifford (T=0)</option>
              <option value={1}>T-Doped (T=1)</option>
              <option value={2}>T-Doped (T=2)</option>
              <option value={4}>T-Doped (T=4)</option>
            </select>
          </div>

          {/* Shots Selector */}
          <div className="quick-config-item" title="Total sample shots for Qiskit Aer simulation">
            <span>SHOTS:</span>
            <select
              className="dock-select"
              value={shots}
              onChange={e => onSetShots && onSetShots(Number(e.target.value))}
              disabled={disabled}
            >
              <option value={300}>300 Shots</option>
              <option value={500}>500 Shots</option>
              <option value={1000}>1000 Shots</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. DUAL ACTION BUTTONS (Both Stay Available & Clickable) */}
      <div className="combat-action-grid two-buttons-grid">
        {/* ATTACK ACTION */}
        <button
          type="button"
          className={`action-btn btn-attack ${selectedAttack ? 'action-selected selected-attack' : ''}`}
          onClick={onToggleAttack}
          disabled={!canAct}
          aria-pressed={selectedAttack}
          aria-label="Toggle Attack action"
        >
          <div className="btn-icon-wrap">
            <Swords size={28} />
          </div>
          <div className="btn-text-content">
            <div className="btn-label-row">
              <strong>⚔️ ATTACK</strong>
              <span className={`action-tag ${selectedAttack ? 'strike-tag active-tag' : 'strike-tag'}`}>
                {selectedAttack ? '✓ ATTACK QUEUED' : 'CLICK TO QUEUE'}
              </span>
            </div>
            <p className="btn-desc">
              Executes the payload circuit. Deals <strong>{currentLevel?.playerBaseAttack || 20} base damage</strong> + quantum fidelity bonus.
            </p>
          </div>
          {selectedAttack && (
            <div className="action-active-badge">
              <CheckCircle2 size={16} />
            </div>
          )}
        </button>

        {/* DEFEND ACTION */}
        <button
          type="button"
          className={`action-btn btn-defend ${selectedDefend ? 'action-selected selected-defend defend-active' : ''}`}
          onClick={onToggleDefend}
          disabled={!canDefend}
          aria-pressed={selectedDefend}
          aria-label="Toggle Defend action"
        >
          <div className="btn-icon-wrap">
            <Shield size={28} />
          </div>
          <div className="btn-text-content">
            <div className="btn-label-row">
              <strong>🛡️ DEFEND</strong>
              <span className={`action-tag ${selectedDefend ? 'shield-tag active-tag' : 'shield-tag'}`}>
                {selectedDefend ? '✓ SHIELD ARMED' : (defendCharges <= 0 ? 'NO CHARGES' : 'CLICK TO QUEUE')}
              </span>
              <span className="action-tag shield-tag">
                CHARGES: {defendCharges}
              </span>
            </div>
            <p className="btn-desc">
              Deploys spacetime Pauli checks. Reduces incoming boss strike by <strong>~50%</strong> (min 1 damage). Consumed after 1 hit.
            </p>
          </div>
          {selectedDefend && (
            <div className="action-active-badge">
              <CheckCircle2 size={16} />
            </div>
          )}
        </button>
      </div>

      {/* 3. RESOLVE ROUND BAR */}
      <div className="resolve-round-bar">
        <div className="round-status-summary">
          <span className="summary-indicator-label">CURRENT ROUND SELECTION:</span>
          <div className="summary-badges-wrap">
            {selectedAttack && (
              <span className="summary-pill pill-attack">
                <Swords size={12} /> ATTACK SELECTED
              </span>
            )}
            {selectedDefend && (
              <span className="summary-pill pill-defend">
                <Shield size={12} /> SHIELD ARMED (50% MITIGATION)
              </span>
            )}
            {!hasSelection && (
              <span className="summary-pill pill-empty">
                Choose Attack, Defend, or Both for this round
              </span>
            )}
          </div>
        </div>

        <div className="resolve-btn-group">
          {hasSelection && (
            <button
              type="button"
              className="btn-clear-selection"
              onClick={onClearSelection}
              disabled={!canAct}
              title="Reset action selection for this round"
            >
              <RotateCcw size={12} />
              <span>CLEAR</span>
            </button>
          )}

          <button
            type="button"
            className={`btn-resolve-round ${hasSelection ? 'ready-to-resolve' : 'disabled'}`}
            onClick={onResolveRound}
            disabled={!canAct || !hasSelection}
            aria-label="Resolve the combat round"
          >
            <Play size={16} fill="currentColor" />
            <span>{resolveLabel}</span>
            <Zap size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
