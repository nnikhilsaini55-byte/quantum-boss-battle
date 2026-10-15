import React, { useState, useRef, useEffect, useCallback } from 'react';
import TopBar from './components/TopBar';
import LandingView from './components/LandingView';
import BattleArena from './components/Arena/BattleArena';
import CombatControls from './components/Arena/CombatControls';
import SimulationPanel from './components/Simulation/SimulationPanel';
import OutcomeModal from './components/Modals/OutcomeModal';
import CombatRulesModal from './components/Modals/CombatRulesModal';
import AdvancedTrackReportModal from './components/Modals/AdvancedTrackReportModal';
import { ArrowLeft, RotateCcw, BookOpen, Award, Atom } from 'lucide-react';
import './style.css';

const INITIAL_LEVELS = [
  {
    id: 1,
    name: 'FIRST CONTACT',
    boss: 'THE GLITCHLING',
    difficulty: 'EASY',
    badgeClass: 'd1',
    bossClass: 'boss1',
    defendCharges: 1,
    desc: 'A small digital disturbance in a 2-qubit Clifford circuit with glitch and pixel disintegration.',
    depth: 2,
    gateNoise: 0.006,
    readoutNoise: 0.004,
    maxHp: 100,
    bossAttack: 15,
    playerBaseAttack: 20,
    attackName: 'Glitch Pulse',
    iconColor: '#00f5d4',
  },
  {
    id: 2,
    name: 'SHIELD STRATEGY',
    boss: 'THE NOISE WRAITH',
    difficulty: 'MEDIUM',
    badgeClass: 'd2',
    bossClass: 'boss2',
    defendCharges: 3,
    desc: 'A ghostly quantum phantom with purple energy, phase distortion, and stronger defensive noise.',
    depth: 4,
    gateNoise: 0.012,
    readoutNoise: 0.008,
    maxHp: 120,
    bossAttack: 20,
    playerBaseAttack: 20,
    attackName: 'Decoherence Wave',
    iconColor: '#b5179e',
  },
  {
    id: 3,
    name: 'NOISE MONSTER',
    boss: 'THE FIDELITY TITAN',
    difficulty: 'HARD',
    badgeClass: 'd3',
    bossClass: 'boss3',
    defendCharges: 5,
    desc: 'A colossal armored quantum automaton with a glowing electric core, dramatic impacts, and high health.',
    depth: 6,
    gateNoise: 0.018,
    readoutNoise: 0.012,
    maxHp: 150,
    bossAttack: 25,
    playerBaseAttack: 20,
    attackName: 'Quantum Cataclysm',
    iconColor: '#ffb703',
  },
];

const DEFEND_CHARGES_BY_DIFFICULTY = {
  EASY: 1,
  MEDIUM: 3,
  HARD: 5,
};

const getInitialDefendCharges = (cfg) => {
  if (cfg?.defendCharges !== undefined) return cfg.defendCharges;
  const diff = String(cfg?.difficulty || '').toUpperCase();
  return DEFEND_CHARGES_BY_DIFFICULTY[diff] ?? (cfg?.id === 1 ? 1 : cfg?.id === 2 ? 3 : 5);
};

const PLAYER_MAX_HP = 100;

export default function App() {
  // Navigation: 'landing' | 'arena'
  const [view, setView] = useState('landing');
  const levelsList = INITIAL_LEVELS;
  const [selectedLevelId, setSelectedLevelId] = useState(1);
  const [currentLevelConfig, setCurrentLevelConfig] = useState(INITIAL_LEVELS[0]);

  // Turn-based Combat State
  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const bossHpRef = useRef(100);
  const playerHpRef = useRef(PLAYER_MAX_HP);
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState('player_turn'); // 'player_turn' | 'resolving' | 'boss_turn' | 'victory' | 'defeat'

  // Dual Action Selection State (both can be chosen in either order!)
  const [selectedAttack, setSelectedAttack] = useState(false);
  const [selectedDefend, setSelectedDefend] = useState(false);
  const selectedAttackRef = useRef(false);
  const selectedDefendRef = useRef(false);

  // Active Shield State during turn resolution
  const [isDefending, setIsDefending] = useState(false);
  const isDefendingRef = useRef(false);

  // Defend Charge Limit State (Easy: 1, Medium: 3, Hard: 5 per battle)
  const [defendCharges, setDefendCharges] = useState(() => getInitialDefendCharges(INITIAL_LEVELS[0]));
  const defendChargesRef = useRef(1);

  // Quantum Experiment Configuration
  const [checksConfig, setChecksConfig] = useState(1); // 0, 1, 2
  const [shotsConfig, setShotsConfig] = useState(500);  // 300, 500, 1000
  const [numTGates, setNumTGates] = useState(0);       // 0, 1, 2, 4
  const [targetQubits, setTargetQubits] = useState([0, 1]); // [0, 1], [0], [1]

  // Live Quantum Simulation Telemetry
  const [lastTelemetryResult, setLastTelemetryResult] = useState(null);
  const [isFetchingTelemetry, setIsFetchingTelemetry] = useState(false);
  const [telemetryError, setTelemetryError] = useState('');
  const [roundHistory, setRoundHistory] = useState([]);
  const [lastDamageStats, setLastDamageStats] = useState(null);

  // Action Lock to prevent double-clicks & rapid actions
  const actionLockRef = useRef(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Session & duplicate guard refs
  const sessionRef = useRef(0);
  const bossAttackResolvedRef = useRef(false);
  const timeoutIdsRef = useRef([]);

  // Character Animated States
  const [playerState, setPlayerState] = useState('idle'); // 'idle' | 'attack' | 'defend' | 'hit' | 'defeat' | 'victory'
  const [bossState, setBossState] = useState('idle');     // 'idle' | 'attack' | 'defend' | 'hit' | 'defeat'

  // Visual Effects State
  const [activeProjectile, setActiveProjectile] = useState(null); // { type, bossClass } | null
  const [activeImpact, setActiveImpact] = useState(null);         // { target, type } | null
  const [floatingNumbers, setFloatingNumbers] = useState([]);     // [ { id, text, type, x, y } ]

  // Combat Log
  const [battleLogs, setBattleLogs] = useState([]);

  // Modals
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Helper to schedule timeouts and clean them up reliably
  const scheduleTimer = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timeoutIdsRef.current.push(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    timeoutIdsRef.current.forEach(id => clearTimeout(id));
    timeoutIdsRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  // Keep action selection refs in sync
  useEffect(() => {
    selectedAttackRef.current = selectedAttack;
  }, [selectedAttack]);

  useEffect(() => {
    selectedDefendRef.current = selectedDefend;
    isDefendingRef.current = selectedDefend;
    setIsDefending(selectedDefend);
  }, [selectedDefend]);

  useEffect(() => {
    defendChargesRef.current = defendCharges;
  }, [defendCharges]);

  // Spawn floating combat numbers
  const spawnFloatingText = useCallback((text, type = 'damage', target = 'boss') => {
    const id = `ftext-${Date.now()}-${Math.random()}`;
    const x = target === 'boss' ? '75%' : '25%';
    const y = '45%';
    setFloatingNumbers(prev => [...prev, { id, text, type, x, y }]);
    scheduleTimer(() => {
      setFloatingNumbers(prev => prev.filter(item => item.id !== id));
    }, 1300);
  }, [scheduleTimer]);

  // Helper to add combat log entries
  const addBattleLog = useCallback((entry) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setBattleLogs(prev => [
      {
        id: `log-${Date.now()}-${Math.random()}`,
        round,
        time: timestamp,
        ...entry,
      },
      ...prev,
    ]);
  }, [round]);

  // ---------------------------------------------------------------------------
  // FETCH QUANTUM SIMULATION (Real Qiskit Aer Engine)
  // ---------------------------------------------------------------------------
  const executeQuantumExperiment = useCallback(async (checksToUse, levelCfg) => {
    setIsFetchingTelemetry(true);
    setTelemetryError('');

    const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://127.0.0.1:8000';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      const res = await fetch(`${baseUrl}/api/battle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: levelCfg.id,
          checks: checksToUse,
          shots: shotsConfig,
          num_t_gates: numTGates,
          target_qubits: targetQubits,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Quantum simulation endpoint returned an error.`);
      }

      const data = await res.json();
      setLastTelemetryResult(data);
      setIsFetchingTelemetry(false);
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('Backend quantum simulation request notice:', err);

      // Graceful fallback so UI never crashes or displays a blank screen if backend is restarting
      const isClifford = numTGates === 0;
      const baseFidelity = Math.max(0.72, 0.98 - levelCfg.depth * 0.035);
      const postFidelity = checksToUse > 0 ? Math.min(0.99, baseFidelity + checksToUse * 0.045) : baseFidelity;
      const retainedFrac = checksToUse === 0 ? 1.0 : checksToUse === 1 ? 0.91 : 0.79;
      const totalShots = shotsConfig * (isClifford ? 3 : 1);
      const keptShots = Math.round(totalShots * retainedFrac);
      const discardedShots = totalShots - keptShots;
      const score = Math.round(Math.max(0, Math.min(100, 100 * postFidelity * retainedFrac - 10 * (checksToUse / 3.0))));

      const fallbackData = {
        level: levelCfg.id,
        level_name: levelCfg.boss,
        depth: levelCfg.depth,
        num_t_gates: numTGates,
        target_qubits: targetQubits,
        circuit_family: isClifford ? 'Clifford-Only' : `T-Doped (T=${numTGates})`,
        reference_type: isClifford ? 'Stabilizer Simulation' : 'Statevector Simulation',
        fidelity_method_justification: isClifford
          ? 'Exact 2-qubit stabilizer state projector formula: F = (1 + sum_{P in S, P != I} <P>) / 2^n.'
          : 'Standard quantum state fidelity against the exact non-Clifford statevector reference: F = <psi|rho|psi>.',
        raw_fidelity: Number(baseFidelity.toFixed(4)),
        postselected_fidelity: Number(postFidelity.toFixed(4)),
        fidelity_delta: Number((postFidelity - baseFidelity).toFixed(4)),
        retained_fraction: Number(retainedFrac.toFixed(4)),
        retained_percent: Number((retainedFrac * 100).toFixed(1)),
        total_shots: totalShots,
        retained_shots: keptShots,
        discarded_shots: discardedShots,
        ancilla_qubits_added: checksToUse,
        checks_used: checksToUse,
        raw_two_qubit_gates: levelCfg.depth,
        checked_two_qubit_gates: levelCfg.depth + (checksToUse * 2),
        added_two_qubit_gates: checksToUse * 2,
        raw_circuit_depth: levelCfg.depth * 2,
        checked_circuit_depth: levelCfg.depth * 2 + checksToUse,
        added_circuit_depth: checksToUse,
        score,
        elapsed_seconds: 0.12,
        stabilizer_telemetry: [
          { label: 'ZI', raw_expectation: Number((baseFidelity * 0.96).toFixed(4)), post_expectation: Number(postFidelity.toFixed(4)), improvement: Number((postFidelity - baseFidelity * 0.96).toFixed(4)) },
          { label: 'IZ', raw_expectation: Number((baseFidelity * 0.94).toFixed(4)), post_expectation: Number(postFidelity.toFixed(4)), improvement: Number((postFidelity - baseFidelity * 0.94).toFixed(4)) },
          { label: 'ZZ', raw_expectation: Number((baseFidelity * 0.98).toFixed(4)), post_expectation: Number(postFidelity.toFixed(4)), improvement: Number((postFidelity - baseFidelity * 0.98).toFixed(4)) },
        ],
        is_fallback: true,
        organizer_note: '[DEMO / SIMULATED DATA] Backend offline. Start Python backend on port 8000 for direct Qiskit Aer simulation.',
      };

      setLastTelemetryResult(fallbackData);
      setTelemetryError(
        err.name === 'AbortError'
          ? 'Backend response timed out. Start the Python FastAPI server on port 8000 for direct Qiskit Aer telemetry.'
          : 'Connecting to local Qiskit Aer backend (start uvicorn on port 8000 for live execution).'
      );
      setIsFetchingTelemetry(false);
      return fallbackData;
    }
  }, [shotsConfig, numTGates, targetQubits]);

  // Start or Reset Battle
  const startBattle = useCallback((targetConfig = null) => {
    clearAllTimers();
    const currentSession = ++sessionRef.current;
    const cfg = targetConfig || levelsList.find(x => x.id === selectedLevelId) || levelsList[0];

    setCurrentLevelConfig(cfg);
    setSelectedLevelId(cfg.id);
    bossHpRef.current = cfg.maxHp;
    playerHpRef.current = PLAYER_MAX_HP;
    setBossHp(cfg.maxHp);
    setPlayerHp(PLAYER_MAX_HP);
    setRound(1);
    setPhase('player_turn');

    // Reset Defend charge limit: Easy: 1, Medium: 3, Hard: 5
    const initialCharges = getInitialDefendCharges(cfg);
    setDefendCharges(initialCharges);
    defendChargesRef.current = initialCharges;

    // Reset action selections & locks
    setSelectedAttack(false);
    setSelectedDefend(false);
    selectedAttackRef.current = false;
    selectedDefendRef.current = false;
    isDefendingRef.current = false;
    setIsDefending(false);
    actionLockRef.current = false;
    setActionLoading(false);
    bossAttackResolvedRef.current = false;
    setLastDamageStats(null);
    setRoundHistory([]);

    // Reset visual states
    setPlayerState('idle');
    setBossState('idle');
    setActiveProjectile(null);
    setActiveImpact(null);
    setFloatingNumbers([]);

    setBattleLogs([
      {
        id: `${currentSession}-init`,
        round: 1,
        type: 'system',
        title: 'MISSION COMMENCED',
        desc: `Deployed Quantum Core against ${cfg.boss}. HP: ${cfg.maxHp}, Attack: ${cfg.bossAttack}. Select ATTACK, DEFEND, or BOTH, then click RESOLVE ROUND.`,
        pills: [`BOSS HP: ${cfg.maxHp}`, `SIGNATURE: ${cfg.attackName}`],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
    ]);

    // Initial telemetry fetch
    executeQuantumExperiment(1, cfg);

    setView('arena');
  }, [clearAllTimers, levelsList, selectedLevelId, executeQuantumExperiment]);

  const resetBattle = useCallback(() => {
    startBattle(currentLevelConfig);
  }, [startBattle, currentLevelConfig]);

  const retreatToLanding = useCallback(() => {
    clearAllTimers();
    sessionRef.current++;
    actionLockRef.current = false;
    setSelectedAttack(false);
    setSelectedDefend(false);
    selectedAttackRef.current = false;
    selectedDefendRef.current = false;
    isDefendingRef.current = false;
    setIsDefending(false);
    setActionLoading(false);
    const activeCfg = levelsList.find(x => x.id === selectedLevelId) || levelsList[0];
    const initialCharges = getInitialDefendCharges(activeCfg);
    setDefendCharges(initialCharges);
    defendChargesRef.current = initialCharges;
    setView('landing');
  }, [clearAllTimers, levelsList, selectedLevelId]);

  // Move to the next boss after victory; return to mission select after final level.
  const handleNextLevel = useCallback(() => {
    const nextLevelId = currentLevelConfig.id + 1;
    const nextCfg = levelsList.find(level => level.id === nextLevelId);
    if (nextCfg) startBattle(nextCfg);
    else retreatToLanding();
  }, [currentLevelConfig, levelsList, startBattle, retreatToLanding]);

  // ---------------------------------------------------------------------------
  // ACTION TOGGLE HANDLERS (Neither disables the other!)
  // ---------------------------------------------------------------------------
  const handleToggleAttack = useCallback(() => {
    if (actionLockRef.current || phase !== 'player_turn') return;
    setSelectedAttack(prev => !prev);
  }, [phase]);

  const handleToggleDefend = useCallback(() => {
    if (actionLockRef.current || phase !== 'player_turn') return;
    if (defendChargesRef.current <= 0 && !selectedDefendRef.current) return;
    setSelectedDefend(prev => !prev);
  }, [phase]);

  const handleClearSelection = useCallback(() => {
    if (actionLockRef.current || phase !== 'player_turn') return;
    setSelectedAttack(false);
    setSelectedDefend(false);
  }, [phase]);

  // ---------------------------------------------------------------------------
  // RESOLVE ROUND HANDLER (Executes chosen Attack, Defend, and Boss Counterattack)
  // ---------------------------------------------------------------------------
  const handleResolveRound = useCallback(async () => {
    const willAttack = selectedAttackRef.current;
    const willDefend = selectedDefendRef.current && defendChargesRef.current > 0;

    if (!willAttack && !willDefend) return;
    if (actionLockRef.current || phase !== 'player_turn') return;

    actionLockRef.current = true;
    setActionLoading(true);
    setPhase('resolving');
    const currentSession = sessionRef.current;

    // Consume exactly 1 Defend charge when Defend is activated
    if (willDefend) {
      const nextCharges = Math.max(0, defendChargesRef.current - 1);
      defendChargesRef.current = nextCharges;
      setDefendCharges(nextCharges);
    }

    // 1. Run genuine quantum experiment for this round
    const checksUsed = willDefend ? checksConfig : 0;
    const telemetry = await executeQuantumExperiment(checksUsed, currentLevelConfig);
    if (sessionRef.current !== currentSession) return;

    // Compute attack strength & bonus from real postselected fidelity
    const baseDamage = currentLevelConfig.playerBaseAttack || 20;
    const isStarved = Boolean(telemetry?.shot_starvation || telemetry?.postselected_fidelity === null || telemetry?.postselected_fidelity === undefined);
    const postFidelity = telemetry?.postselected_fidelity;
    const quantumBonus = (!isStarved && typeof postFidelity === 'number')
      ? Math.round(20 * Math.max(0, postFidelity - 0.70))
      : 0;
    const totalAttackDamage = baseDamage + quantumBonus;

    // Log explicit warning if shot starvation occurred
    if (isStarved && checksUsed > 0) {
      addBattleLog({
        type: 'system',
        title: '⚠️ SHOT STARVATION DETECTED',
        desc: '0 experimental shots survived post-selection (100% discarded). Post-selected fidelity is unavailable; +0 bonus damage awarded. Raw baseline was used as fallback.',
        pills: ['RETAINED: 0%', 'BONUS: +0', 'POST-SEL: UNAVAILABLE'],
      });
    }

    // -------------------------------------------------------------------------
    // STEP A: PLAYER ATTACK (if selected)
    // -------------------------------------------------------------------------
    if (willAttack) {
      setPlayerState('attack');
      setActiveProjectile({ type: 'player_attack' });

      await new Promise(r => scheduleTimer(r, 350));
      if (sessionRef.current !== currentSession) return;

      setActiveProjectile(null);
      const updatedBossHp = Math.max(0, bossHpRef.current - totalAttackDamage);
      bossHpRef.current = updatedBossHp;
      setBossHp(updatedBossHp);

      // Impact VFX & floating text
      setActiveImpact({ target: 'boss', type: 'hit' });
      setBossState('hit');
      spawnFloatingText(`-${totalAttackDamage}`, quantumBonus > 0 ? 'crit' : 'damage', 'boss');

      addBattleLog({
        type: 'attack',
        title: 'PLAYER QUANTUM ATTACK',
        desc: isStarved
          ? `Executed payload circuit! Dealt ${totalAttackDamage} DMG to ${currentLevelConfig.boss} (Base: ${baseDamage} + 0 Bonus [Shot Starvation Fallback]).`
          : `Executed payload circuit! Dealt ${totalAttackDamage} DMG to ${currentLevelConfig.boss} (Base: ${baseDamage} + Quantum Fidelity Bonus: +${quantumBonus} from ${(postFidelity * 100).toFixed(1)}% fidelity).`,
        pills: [`DMG: ${totalAttackDamage}`, `BONUS: +${quantumBonus}`, `BOSS HP: ${updatedBossHp}`],
      });

      await new Promise(r => scheduleTimer(r, 400));
      if (sessionRef.current !== currentSession) return;

      setActiveImpact(null);
      setBossState('idle');

      // Check immediate Victory
      if (updatedBossHp <= 0) {
        setBossState('defeat');
        setPlayerState('victory');
        setPhase('victory');
        actionLockRef.current = false;
        setActionLoading(false);
        addBattleLog({
          type: 'system',
          title: 'VICTORY ACHIEVED',
          desc: `${currentLevelConfig.boss} has been neutralized! Stabilizer error detection preserved quantum fidelity.`,
          pills: [
            isStarved ? 'POST-SEL: UNAVAILABLE' : `FINAL FIDELITY: ${typeof postFidelity === 'number' ? (postFidelity * 100).toFixed(1) : 0}%`,
            `SCORE: ${telemetry?.score ?? 0}/100`,
          ],
        });

        // Record final round in history
        setRoundHistory(prev => [
          ...prev,
          {
            round,
            actions: { attack: willAttack, defend: willDefend },
            checks: checksUsed,
            result: telemetry,
            damageDealt: totalAttackDamage,
            incomingDmg: 0,
            blockedDmg: 0,
            actualDmg: 0,
          },
        ]);
        return;
      }
    }

    // -------------------------------------------------------------------------
    // STEP B: BOSS COUNTERATTACK (Checks Defend state BEFORE applying damage)
    // -------------------------------------------------------------------------
    setPhase('boss_turn');
    setBossState('attack');
    setActiveProjectile({
      type: 'boss_attack',
      bossClass: currentLevelConfig.bossClass,
    });

    await new Promise(r => scheduleTimer(r, 400));
    if (sessionRef.current !== currentSession) return;

    setActiveProjectile(null);
    const incomingBossDmg = currentLevelConfig.bossAttack;
    let blockedDmg = 0;
    let actualDmg = incomingBossDmg;

    if (willDefend) {
      // BALANCED DEFENSE: Reduce incoming damage by ~50%, minimum 1 damage
      blockedDmg = Math.floor(incomingBossDmg * 0.5);
      actualDmg = Math.max(1, incomingBossDmg - blockedDmg);

      // Play shield deflection impact
      setActiveImpact({ target: 'player', type: 'shield_deflect' });
      setPlayerState('defend');
      spawnFloatingText(`-${actualDmg} (BLOCKED ${blockedDmg})`, 'block', 'player');

      addBattleLog({
        type: 'defend',
        title: 'SPACETIME SHIELD DEFLECTION',
        desc: `Spacetime error-detection checks absorbed ${blockedDmg} incoming damage (~50% mitigation). Player core sustained ${actualDmg} damage.`,
        pills: [`INCOMING: ${incomingBossDmg}`, `BLOCKED: ${blockedDmg}`, `RECEIVED: ${actualDmg}`],
      });
    } else {
      // UNSHIELDED: Full boss damage
      setActiveImpact({ target: 'player', type: 'hit' });
      setPlayerState('hit');
      spawnFloatingText(`-${actualDmg}`, 'damage', 'player');

      addBattleLog({
        type: 'boss',
        title: `${currentLevelConfig.boss} STRIKE: ${currentLevelConfig.attackName}`,
        desc: `${currentLevelConfig.boss} struck the unshielded Quantum Core for ${actualDmg} damage.`,
        pills: [`DMG: ${actualDmg}`, `INCOMING: ${incomingBossDmg}`],
      });
    }

    setLastDamageStats({ incoming: incomingBossDmg, blocked: blockedDmg, received: actualDmg });
    const updatedPlayerHp = Math.max(0, playerHpRef.current - actualDmg);
    playerHpRef.current = updatedPlayerHp;
    setPlayerHp(updatedPlayerHp);

    await new Promise(r => scheduleTimer(r, 450));
    if (sessionRef.current !== currentSession) return;

    setActiveImpact(null);
    setBossState('idle');
    setPlayerState('idle');

    // Shield is consumed after blocking this boss attack
    isDefendingRef.current = false;
    setIsDefending(false);

    // Record round in experiment history
    setRoundHistory(prev => [
      ...prev,
      {
        round,
        actions: { attack: willAttack, defend: willDefend },
        checks: checksUsed,
        result: telemetry,
        damageDealt: willAttack ? totalAttackDamage : 0,
        incomingDmg: incomingBossDmg,
        blockedDmg,
        actualDmg,
      },
    ]);

    // Check Defeat
    if (updatedPlayerHp <= 0) {
      setPlayerState('defeat');
      setPhase('defeat');
      actionLockRef.current = false;
      setActionLoading(false);
      addBattleLog({
        type: 'system',
        title: 'CORE COLLAPSED',
        desc: 'Quantum Core lost stability under decoherence. Select RETRY to challenge the boss again.',
      });
    } else {
      // Increment round and reset action selections cleanly for the next round
      setRound(r => r + 1);
      setSelectedAttack(false);
      setSelectedDefend(false);
      selectedAttackRef.current = false;
      selectedDefendRef.current = false;
      setPhase('player_turn');
      actionLockRef.current = false;
      setActionLoading(false);
    }
  }, [
    currentLevelConfig,
    checksConfig,
    round,
    executeQuantumExperiment,
    scheduleTimer,
    spawnFloatingText,
    addBattleLog,
  ]);

  return (
    <div className="quantum-app-root">
      {/* 1. TOP BAR */}
      <TopBar
        currentLevel={currentLevelConfig}
        view={view}
        onNavigateHome={retreatToLanding}
        onOpenRules={() => setShowRulesModal(true)}
        onOpenReport={() => setShowReportModal(true)}
      />

      {/* 2. MAIN VIEWS */}
      <main className="main-viewport">
        {view === 'landing' ? (
          <LandingView
            levels={levelsList}
            selectedLevelId={selectedLevelId}
            onSelectLevel={id => setSelectedLevelId(id)}
            onStartBattle={() => startBattle()}
            onOpenRules={() => setShowRulesModal(true)}
          />
        ) : (
          <div className="arena-view-wrapper">
            {/* Arena Sub-Header: Mission Navigation & Reset */}
            <div className="arena-sub-header">
              <div className="sub-header-left">
                <button type="button" className="btn-retreat" onClick={retreatToLanding}>
                  <ArrowLeft size={14} /> MISSION SELECT
                </button>
                <button type="button" className="btn-reset-header" onClick={resetBattle} title="Restart this battle from round 1">
                  <RotateCcw size={14} /> RESET BATTLE
                </button>
              </div>

              <div className="arena-title-wrap">
                <span className="mission-no">LEVEL {currentLevelConfig.id < 10 ? `0${currentLevelConfig.id}` : currentLevelConfig.id}</span>
                <span className="mission-boss-title">{currentLevelConfig.boss}</span>
              </div>
            </div>

            {/* REAL ANIMATED BATTLE ARENA */}
            <BattleArena
              level={currentLevelConfig}
              playerHp={playerHp}
              playerMaxHp={PLAYER_MAX_HP}
              bossHp={bossHp}
              bossMaxHp={currentLevelConfig.maxHp}
              round={round}
              phase={phase}
              playerState={playerState}
              bossState={bossState}
              energyLevel={100}
              isDefending={isDefending}
              selectedAttack={selectedAttack}
              selectedDefend={selectedDefend}
              activeProjectile={activeProjectile}
              activeImpact={activeImpact}
              floatingNumbers={floatingNumbers}
              actionLoading={actionLoading}
              lastDamageStats={lastDamageStats}
            />

            {/* DUAL ACTION COMBAT CONTROLS (Both remain visible & clickable!) */}
            <CombatControls
              onToggleAttack={handleToggleAttack}
              onToggleDefend={handleToggleDefend}
              onResolveRound={handleResolveRound}
              onClearSelection={handleClearSelection}
              selectedAttack={selectedAttack}
              selectedDefend={selectedDefend}
              defendCharges={defendCharges}
              disabled={actionLoading}
              phase={phase}
              round={round}
              currentLevel={currentLevelConfig}
              checks={checksConfig}
              onSetChecks={setChecksConfig}
              shots={shotsConfig}
              onSetShots={setShotsConfig}
              numTGates={numTGates}
              onSetNumTGates={setNumTGates}
              targetQubits={targetQubits}
              onSetTargetQubits={setTargetQubits}
            />

            {/* LOWER GRID: QUANTUM SIMULATION TELEMETRY + BATTLE COMBAT LOG */}
            <div className="arena-lower-grid">
              {/* Genuine Qiskit Aer Experiment Telemetry Panel */}
              <SimulationPanel
                lastResult={lastTelemetryResult}
                isFetching={isFetchingTelemetry}
                error={telemetryError}
                onRefreshTelemetry={() => executeQuantumExperiment(checksConfig, currentLevelConfig)}
                onOpenAdvancedReport={() => setShowReportModal(true)}
                onOpenTutorial={() => setShowRulesModal(true)}
                currentLevel={currentLevelConfig}
                roundHistory={roundHistory}
              />

              {/* Battle Combat Log */}
              <div className="combat-log-panel">
                <div className="log-panel-header">
                  <div className="log-header-left">
                    <h3>BATTLE COMBAT LOG</h3>
                  </div>
                  <span className="log-count">{battleLogs.length} EVENTS</span>
                </div>
                <div className="log-feed-container">
                  {battleLogs.map(item => (
                    <div key={item.id} className={`log-item-card log-type-${item.type}`}>
                      <div className="log-item-header">
                        <span className="log-round-badge">R{item.round}</span>
                        <strong className="log-title">{item.title}</strong>
                        <span className="log-timestamp">{item.time}</span>
                      </div>
                      <p className="log-desc">{item.desc}</p>
                      {item.pills && (
                        <div className="log-pill-row">
                          {item.pills.map((pill, idx) => (
                            <span key={idx} className="log-pill">{pill}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. OUTCOME OVERLAYS (Victory & Defeat with Real Experiment Results) */}
      {(phase === 'victory' || phase === 'defeat') && (
        <OutcomeModal
          phase={phase}
          level={currentLevelConfig}
          round={round}
          playerHp={playerHp}
          playerMaxHp={PLAYER_MAX_HP}
          bossHp={bossHp}
          lastResult={lastTelemetryResult}
          onNextLevel={handleNextLevel}
          onRetry={resetBattle}
          onRetreat={retreatToLanding}
          onOpenAdvancedReport={() => setShowReportModal(true)}
        />
      )}

      {/* 4. MODALS */}
      {showRulesModal && (
        <CombatRulesModal onClose={() => setShowRulesModal(false)} />
      )}

      {showReportModal && (
        <AdvancedTrackReportModal onClose={() => setShowReportModal(false)} />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div>QUANTUM BOSS BATTLE · QISKIT FALL FEST 2026 ADVANCED TRACK</div>
        <div>REAL QISKIT AER SIMULATION · SPACETIME PAULI CHECKS · SYNDROME POST-SELECTION</div>
      </footer>
    </div>
  );
}
