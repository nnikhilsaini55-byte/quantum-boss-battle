import React from 'react';
import PlayerCharacter from '../Characters/PlayerCharacter';
import BossCharacter from '../Characters/BossCharacter';
import BattlefieldVFX from './BattlefieldVFX';
import HealthBar from './HealthBar';
import QuantumEnergyMeter from './QuantumEnergyMeter';
import { Shield, Zap, AlertTriangle, Swords, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * Visual Dark Sci-Fi Animated Battle Arena:
 * - Animated neon blue, purple, cyan energy effects
 * - Perspective grid floor, particles, glowing circuits
 * - Visible player character on left with dynamic shield
 * - Large animated boss enemy on right
 * - Glowing battlefield between them with projectiles and floating combat text
 */
export default function BattleArena({
  level,
  playerHp,
  playerMaxHp = 100,
  bossHp,
  bossMaxHp,
  round,
  phase, // 'player_turn' | 'resolving' | 'boss_turn' | 'victory' | 'defeat'
  playerState, // 'idle' | 'attack' | 'defend' | 'hit' | 'defeat' | 'victory'
  bossState,   // 'idle' | 'attack' | 'defend' | 'hit' | 'defeat'
  energyLevel = 100,
  isDefending = false,
  selectedAttack = false,
  selectedDefend = false,
  activeShield = null,
  activeProjectile = null,
  activeImpact = null,
  floatingNumbers = [],
  actionLoading = false,
  lastDamageStats = null,
}) {
  const isPlayerShielded = isDefending || selectedDefend || !!activeShield;

  return (
    <div className={`battle-arena-stage arena-lvl-${level.id} phase-${phase}`}>
      {/* 1. ARENA BACKGROUND ENVIRONMENT */}
      <div className="arena-bg-layer">
        <div className="arena-grid-floor" />
        <div className="arena-horizon-glow" />

        {/* Ambient floating quantum symbols */}
        <div className="ambient-symbols">
          <span className="sym sym-1">|ψ⟩</span>
          <span className="sym sym-2">X</span>
          <span className="sym sym-3">Z</span>
          <span className="sym sym-4">H</span>
          <span className="sym sym-5">CX</span>
          <span className="sym sym-6">S</span>
          <span className="sym sym-7">CZ</span>
        </div>

        {/* Ambient energy conduits */}
        <div className="circuit-line line-left" />
        <div className="circuit-line line-right" />
        <div className="circuit-line line-center" />
      </div>

      {/* 2. TOP BATTLE STATUS BANNER */}
      <div className="arena-status-banner">
        <div className="status-round-pill">ROUND {round}</div>

        <div className="status-phase-text">
          {phase === 'boss_turn' ? (
            <span className="pulse-text-red">
              <AlertTriangle size={16} />
              {level.boss} COUNTERATTACKING ({level.attackName})!
            </span>
          ) : phase === 'resolving' ? (
            <span className="pulse-text-cyan">
              <Zap size={16} />
              EXECUTING QUANTUM PAYLOAD & RESOLVING ROUND…
            </span>
          ) : phase === 'victory' ? (
            <span className="pulse-text-gold">
              <Sparkles size={16} />
              VICTORY! {level.boss} NEUTRALIZED
            </span>
          ) : phase === 'defeat' ? (
            <span className="pulse-text-red">
              <AlertTriangle size={16} />
              DEFEAT: QUANTUM CORE COLLAPSED
            </span>
          ) : selectedAttack && selectedDefend ? (
            <span className="pulse-text-cyan">
              <CheckCircle2 size={16} />
              ATTACK & DEFEND QUEUED — CLICK RESOLVE ROUND TO EXECUTE BOTH
            </span>
          ) : selectedAttack ? (
            <span className="pulse-text-cyan">
              <Swords size={16} />
              ATTACK QUEUED — READY TO RESOLVE (OR ADD DEFEND TO REDUCE INCOMING DAMAGE)
            </span>
          ) : selectedDefend ? (
            <span className="pulse-text-purple">
              <Shield size={16} />
              SHIELD ARMED — 50% DAMAGE MITIGATION ACTIVE (OR ADD ATTACK TO STRIKE BOSS)
            </span>
          ) : (
            <span className="pulse-text-cyan">
              <Swords size={16} />
              YOUR TURN: SELECT ATTACK, DEFEND, OR BOTH
            </span>
          )}
        </div>

        <div className="status-shield-indicator">
          {isPlayerShielded ? (
            <span className="shield-active-pill">
              <Shield size={13} />
              SHIELD ACTIVE (~50% MITIGATION)
            </span>
          ) : (
            <span className="shield-idle-pill">
              <Shield size={13} />
              UNSHIELDED CORE (FULL DAMAGE)
            </span>
          )}
        </div>
      </div>

      {/* 3. COMBATANTS BATTLEFIELD (Left: Player, Center: VFX, Right: Boss) */}
      <div className="arena-combatants-stage">
        {/* Left Column: Player (Quantum Core Warrior) */}
        <div className="arena-side player-side">
          <HealthBar
            current={playerHp}
            max={playerMaxHp}
            label="QUANTUM CORE INTEGRITY"
            entity="player"
            isDefending={isPlayerShielded}
          />

          <div className="character-stage-box player-stage-box">
            <PlayerCharacter
              state={playerState}
              energyLevel={energyLevel}
              isShielded={isPlayerShielded}
            />
          </div>

          <QuantumEnergyMeter
            charge={energyLevel}
            isSimulating={actionLoading}
          />
        </div>

        {/* Center Battlefield VFX Lane */}
        <div className="arena-center-lane">
          <BattlefieldVFX
            activeProjectile={activeProjectile}
            activeImpact={activeImpact}
            floatingNumbers={floatingNumbers}
          />

          <div className="versus-hologram">
            <div className="versus-ring" />
            <span>VS</span>
          </div>

          {lastDamageStats && lastDamageStats.blocked > 0 && (
            <div className="shield-absorption-badge">
              <Shield size={12} />
              <span>DEFLECTED {lastDamageStats.blocked} DMG</span>
            </div>
          )}
        </div>

        {/* Right Column: Boss Enemy */}
        <div className="arena-side boss-side">
          <HealthBar
            current={bossHp}
            max={bossMaxHp || level.maxHp}
            label={`${level.boss} NOISE INTEGRITY`}
            entity="boss"
          />

          <div className="character-stage-box boss-stage-box">
            <BossCharacter
              bossType={level.boss}
              state={bossState}
              levelId={level.id}
              attackName={level.attackName}
            />
          </div>

          <div className="boss-telemetry-badge">
            <div className="badge-row">
              <span className="intent-label">
                <Zap size={12} /> ATTACK: ~{level.bossAttack} DMG
              </span>
              <span className={`difficulty-pill ${level.badgeClass || 'd1'}`}>
                {level.difficulty}
              </span>
            </div>
            <div className="attack-name-row">
              Signature: <strong>{level.attackName}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
