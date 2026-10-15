import React from 'react';

/**
 * Battlefield Visual Effects:
 * Projectiles, energy beams, shield effects, hit flashes, impact particles, and floating damage numbers.
 */
export default function BattlefieldVFX({
  activeProjectile = null, // { type: 'player_attack' | 'player_sim' | 'boss_attack', bossType: string } | null
  activeImpact = null,     // { target: 'player' | 'boss', type: 'hit' | 'crit' | 'shield_deflect' } | null
  floatingNumbers = [],    // [ { id, text, type: 'damage' | 'crit' | 'deflect' | 'heal', x, y } ]
}) {
  return (
    <div className="battlefield-vfx-layer">
      {/* 1. PROJECTILES & ENERGY BEAMS */}
      {activeProjectile && (
        <div className={`vfx-projectile projectile-${activeProjectile.type}`}>
          {/* Player Standard Attack Projectile (Left to Right) */}
          {activeProjectile.type === 'player_attack' && (
            <div className="player-energy-orb">
              <div className="orb-core" />
              <div className="orb-trail" />
              <div className="orb-particles">
                <span className="p-dot" />
                <span className="p-dot" />
                <span className="p-dot" />
              </div>
            </div>
          )}

          {/* Player Quantum Simulation Overcharge Beam (Full Screen Beam) */}
          {activeProjectile.type === 'player_sim' && (
            <div className="quantum-simulation-beam">
              <div className="beam-core" />
              <div className="beam-outer-glow" />
              <div className="beam-circuit-grid">
                <span className="b-symbol">|0⟩</span>
                <span className="b-symbol">H</span>
                <span className="b-symbol">CX</span>
                <span className="b-symbol">Z</span>
                <span className="b-symbol">|ψ⟩</span>
              </div>
            </div>
          )}

          {/* Boss Attacks (Right to Left) */}
          {activeProjectile.type === 'boss_attack' && (
            <div className={`boss-projectile-fx ${activeProjectile.bossClass || 'boss1'}`}>
              {/* Glitchling Pixel Dart */}
              {activeProjectile.bossClass === 'boss1' && (
                <div className="glitch-dart-cluster">
                  <div className="px-dart d-1" />
                  <div className="px-dart d-2" />
                  <div className="px-dart d-3" />
                  <div className="glitch-beam-trail" />
                </div>
              )}

              {/* Noise Wraith Decoherence Wave */}
              {activeProjectile.bossClass === 'boss2' && (
                <div className="wraith-decoherence-wave">
                  <div className="wave-ring w-1" />
                  <div className="wave-ring w-2" />
                  <div className="wave-core-orb" />
                  <div className="wave-trail" />
                </div>
              )}

              {/* Fidelity Titan Quantum Cataclysm */}
              {(activeProjectile.bossClass === 'boss3' || !activeProjectile.bossClass) && (
                <div className="titan-cataclysm-blast">
                  <div className="cataclysm-head" />
                  <div className="cataclysm-beam" />
                  <div className="lightning-forks" />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. IMPACT EXPLOSIONS & DEFLECTIONS */}
      {activeImpact && (
        <div className={`vfx-impact impact-target-${activeImpact.target} impact-type-${activeImpact.type}`}>
          <div className="impact-flash" />
          <div className="impact-burst-rings">
            <div className="burst-ring ring-a" />
            <div className="burst-ring ring-b" />
          </div>
          <div className="impact-sparks">
            <span className="spark s-1" />
            <span className="spark s-2" />
            <span className="spark s-3" />
            <span className="spark s-4" />
            <span className="spark s-5" />
            <span className="spark s-6" />
          </div>
        </div>
      )}

      {/* 3. FLOATING COMBAT NUMBERS */}
      <div className="floating-numbers-container">
        {floatingNumbers.map(item => (
          <div
            key={item.id}
            className={`floating-combat-text ${item.type}`}
            style={{
              left: item.x || '50%',
              top: item.y || '50%',
            }}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
