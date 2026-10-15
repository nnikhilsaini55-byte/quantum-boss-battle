import React from 'react';

/**
 * Animated Health Bar with segmented health track, health color state,
 * and shield mitigation indicator.
 */
export default function HealthBar({
  current = 100,
  max = 100,
  label = 'CORE INTEGRITY',
  entity = 'player', // 'player' | 'boss'
  isDefending = false,
  shield = null,
}) {
  const hpPct = Math.max(0, Math.min(100, (current / max) * 100));

  function getColorClass(pct) {
    if (pct > 50) return 'hp-high';
    if (pct > 25) return 'hp-mid';
    return 'hp-low';
  }

  const showShield = isDefending || !!shield;

  return (
    <div className={`healthbar-component ${entity}-healthbar`}>
      <div className="healthbar-header">
        <div className="healthbar-title">
          <span className="healthbar-dot" />
          <span className="healthbar-label">{label}</span>
          {showShield && entity === 'player' && (
            <span className="healthbar-shield-tag">
              SHIELD: PERFECT BLOCK (0 DMG)
            </span>
          )}
        </div>
        <div className="healthbar-numbers">
          <strong>{current}</strong>
          <span>/ {max} HP ({Math.round(hpPct)}%)</span>
        </div>
      </div>

      <div className="healthbar-track">
        {/* Animated Main Health Fill */}
        <div
          className={`healthbar-fill ${getColorClass(hpPct)}`}
          style={{ width: `${hpPct}%` }}
        >
          <div className="healthbar-shimmer" />
        </div>

        {/* Shield overlay indicator on health bar if active */}
        {showShield && entity === 'player' && (
          <div
            className="healthbar-shield-overlay"
            style={{ width: '100%' }}
          />
        )}
      </div>
    </div>
  );
}
