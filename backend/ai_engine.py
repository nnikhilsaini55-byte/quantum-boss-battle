"""Quantum Boss Battle: Smart AI Agent & Procedural Level Synthesis Engine.

This module provides:
1. Smart Quantum Tactical Co-Pilot (Q-Agent): Evaluates noisy Clifford states,
   syndrome retention curves, and boss threat matrix to provide real-time quantum advice.
2. Procedural Adaptive Level Synthesizer: Dynamically generates the next boss level
   based on the player's performance in previous levels.
3. Quantum Circuit & Technology Introspection: Exposes gate decomposition and
   stabilizer algebra for educational telemetry.
"""
from __future__ import annotations

import math
from typing import Any


PROCEDURAL_BOSS_TEMPLATES = [
    {
        "name_prefix": "THE PHASE WRAITH",
        "title": "Z-Basis Dephasing Cluster",
        "attack_name": "Phase Decoherence Pulse",
        "flavor": "Synthesized from persistent phase flips. Disrupts qubit relative phases across Hadamard transitions.",
        "difficulty_tag": "ADAPTIVE",
        "color": "#ffd47a",
        "bossClass": "boss2",
        "badgeClass": "d2",
    },
    {
        "name_prefix": "THE DECOHERENCE HYDRA",
        "title": "Multi-Qubit Depolarizing Nexus",
        "attack_name": "Depolarizing Shockwave",
        "flavor": "Deep two-qubit entanglement propagation multiplies error channels across CX and CZ gates.",
        "difficulty_tag": "HARD+",
        "color": "#ff8298",
        "bossClass": "boss3",
        "badgeClass": "d3",
    },
    {
        "name_prefix": "THE ENTANGLEMENT DEVOURER",
        "title": "Non-Local Crosstalk Anomaly",
        "attack_name": "Crosstalk Singularity",
        "flavor": "High-depth Clifford circuit creates massive correlated noise clusters. Heavy syndrome post-selection required.",
        "difficulty_tag": "EXPERT",
        "color": "#e056fd",
        "bossClass": "boss3",
        "badgeClass": "d3",
    },
    {
        "name_prefix": "THE SYNDROME PHANTOM",
        "title": "Parity Violation Entity",
        "attack_name": "Ancilla Nullification",
        "flavor": "Attacks measurement ancillas with asymmetric readout noise. Test of shot preservation vs fidelity trade-off.",
        "difficulty_tag": "NIGHTMARE",
        "color": "#ff4757",
        "bossClass": "boss3",
        "badgeClass": "d3",
    },
    {
        "name_prefix": "THE TENSOR TITAN",
        "title": "Clifford Horizon Singularity",
        "attack_name": "Gottesman-Knill Inversion",
        "flavor": "Maximum depth Clifford state near classical simulation limits. Demands flawless spacetime error mitigation.",
        "difficulty_tag": "OMEGA",
        "color": "#70a1ff",
        "bossClass": "boss3",
        "badgeClass": "d3",
    },
]


def generate_tactical_advice(
    level: int,
    player_hp: int,
    boss_hp: int,
    round_num: int,
    checks: int,
    shots: int,
    last_fidelity: float | None = None,
    last_retained: float | None = None,
    recent_actions: list[str] | None = None,
) -> dict[str, Any]:
    """Analyze battle state and output tactical recommendations based on quantum circuit properties."""
    recent_actions = recent_actions or []

    # Nominal boss attack by level
    base_boss_atk = 20 + max(0, level - 1) * 8
    unshielded_dmg = round(base_boss_atk * 0.90)
    mitigated_dmg = max(1, round(base_boss_atk * 0.50))  # 50% defend-damage reduction (min 1 damage)

    # Check player peril
    is_player_endangered = player_hp <= unshielded_dmg
    can_finish_boss = boss_hp <= 38

    # Noise severity by level
    circuit_depth = 2 + (level - 1) * 2
    is_deep_circuit = circuit_depth >= 4

    # Determine optimal action
    if can_finish_boss and not is_player_endangered:
        action = "attack"
        confidence = 94
        headline = "Lethal Quantum Pulse Window Open"
        analysis = (
            f"The hostile entity's noise resilience is at {boss_hp} HP. "
            "A high-fidelity Clifford attack will collapse the disturbance before the next decoherence cycle."
        )
        quantum_rationale = (
            "Stabilizer projection with post-selection delivers full damage scaling from current fidelity. "
            "Prioritize shot retention (1 check) to maximize total effective disruption."
        )
        rec_checks = 1 if is_deep_circuit else (1 if checks == 0 else checks)
    elif is_player_endangered:
        action = "defend"
        confidence = 96
        headline = "CRITICAL: Deploy Syndrome Shield Calibration"
        analysis = (
            f"Core integrity ({player_hp} HP) is vulnerable to unshielded strike ({unshielded_dmg} DMG). "
            f"Calibrating shield defense cuts incoming strike damage by ~50%, reducing impact to ~{mitigated_dmg} DMG."
        )
        quantum_rationale = (
            "Syndrome checks on Pauli ancillas will actively detect and discard bit/phase-flip errors "
            "during the boss strike, absorbing incoming energy while discharging counter-shock chip damage."
        )
        rec_checks = 2 if is_deep_circuit else 1
    elif last_retained is not None and last_retained < 65.0 and checks == 2:
        # Too many shots discarded
        action = "attack"
        confidence = 88
        headline = "Shift to Balanced Syndrome Filtering"
        analysis = (
            f"Previous turn discarded {round(100 - last_retained, 1)}% of shots. Over-checking reduces effective damage throughput. "
            "Switching to 1 check balances error suppression and shot throughput."
        )
        quantum_rationale = (
            "In finite-shot sampling, discarding excessive shots increases statistical estimator variance. "
            "A single spacetime check provides adequate first-order Pauli protection with >85% retention."
        )
        rec_checks = 1
    elif is_deep_circuit and (last_fidelity is None or last_fidelity < 0.90) and checks == 0:
        # High noise, no checks
        action = "defend"
        confidence = 91
        headline = "Unfiltered Noise Accumulation Detected"
        analysis = (
            f"Circuit depth ({circuit_depth}) allows depolarizing errors to proliferate across two-qubit gates. "
            "Zero checks leaves the quantum state unprotected."
        )
        quantum_rationale = (
            "Two-qubit CX/CZ gates have 0.012+ error rate per operation. Without Pauli syndrome post-selection, "
            "stabilizer expectations decay exponentially with depth."
        )
        rec_checks = 2 if level >= 3 else 1
    else:
        # Standard balanced tactical play
        if recent_actions and recent_actions[-1] == "attack":
            action = "defend"
            confidence = 85
            headline = "Alternate to Shield Calibration"
            analysis = (
                f"Boss is preparing a {base_boss_atk} DMG pulse. Calibrating shields now absorbs damage and returns free counter-shock."
            )
            quantum_rationale = (
                "Alternating Attack and Defend synchronizes with the boss's noise recharge cycle, "
                "preserving Core integrity while maintaining pressure."
            )
            rec_checks = 1
        else:
            action = "attack"
            confidence = 87
            headline = "Execute Noise Disruption Strike"
            analysis = (
                f"Core integrity is healthy ({player_hp}/100 HP). Launching a quantum disruption attack will degrade boss resilience."
            )
            quantum_rationale = (
                "Estimated post-selected fidelity provides strong attack multiplier (>32 DMG). "
                "Retaining high shots amplifies the disruption pulse."
            )
            rec_checks = 1

    threat_level = "CRITICAL" if is_player_endangered else ("HIGH" if level >= 3 else "MODERATE")

    return {
        "recommended_action": action,
        "recommended_checks": rec_checks,
        "recommended_shots": 500 if level <= 2 else 1000,
        "confidence": confidence,
        "headline": headline,
        "tactical_analysis": analysis,
        "quantum_rationale": quantum_rationale,
        "boss_threat_level": threat_level,
        "predicted_incoming_damage": unshielded_dmg,
        "mitigated_incoming_damage": mitigated_dmg,
    }


def generate_adaptive_next_level(
    previous_level: int,
    average_fidelity: float = 0.95,
    shots_retained: float = 90.0,
    rounds_taken: int = 3,
    core_hp_remaining: int = 70,
    checks_used: int = 1,
) -> dict[str, Any]:
    """Procedurally generate the next boss level adapted to the player's performance."""
    next_level = previous_level + 1

    # Select template based on next level index
    template_idx = (next_level - 1) % len(PROCEDURAL_BOSS_TEMPLATES)
    template = PROCEDURAL_BOSS_TEMPLATES[template_idx]

    # Calculate adaptive parameters
    # High fidelity in previous level -> AI increases depth and entangling noise
    skill_factor = min(1.3, max(0.8, (average_fidelity * 0.7 + (shots_retained / 100.0) * 0.3)))

    depth = min(14, max(4, round((2 + next_level * 1.8) * skill_factor)))
    gate_noise = round(min(0.040, max(0.008, 0.005 * next_level * skill_factor)), 4)
    readout_noise = round(min(0.025, max(0.005, 0.0035 * next_level * skill_factor)), 4)

    max_hp = 100 + (next_level - 1) * 30 + (5 if rounds_taken <= 2 else 0)
    boss_attack = 20 + (next_level - 1) * 8
    player_base_attack = 36 + (next_level - 1) * 6

    # Generate custom title and report
    boss_name = f"{template['name_prefix']} {roman_numeral(next_level)}"
    difficulty = f"{template['difficulty_tag']} (LEVEL {next_level:02d})"

    if average_fidelity >= 0.95:
        ai_report = (
            f"AI Matrix Analysis: Player demonstrated master-level stabilizer control in Level {previous_level} "
            f"({(average_fidelity * 100):.1f}% avg fidelity, {shots_retained:.1f}% shots kept). "
            f"The AI has upgraded the quantum payload to Depth {depth} and heightened gate noise to {gate_noise * 100:.2f}%. "
            "Expect higher Pauli error clustering during entangling layers."
        )
    else:
        ai_report = (
            f"AI Matrix Analysis: Player completed Level {previous_level} with {(average_fidelity * 100):.1f}% fidelity "
            f"over {rounds_taken} rounds. Circuit parameters calibrated to Depth {depth} with balanced noise profile "
            f"({gate_noise * 100:.2f}% gate error) to reinforce spacetime check mastery."
        )

    return {
        "id": next_level,
        "name": f"PROCEDURAL MISSION {next_level:02d}",
        "boss": boss_name,
        "difficulty": difficulty,
        "badgeClass": template["badgeClass"],
        "bossClass": template["bossClass"],
        "desc": template["flavor"],
        "depth": depth,
        "gateNoise": gate_noise,
        "readoutNoise": readout_noise,
        "maxHp": max_hp,
        "bossAttack": boss_attack,
        "playerBaseAttack": player_base_attack,
        "attackName": template["attack_name"],
        "iconColor": template["color"],
        "aiGenesisReport": ai_report,
        "quantumCircuitSummary": (
            f"{depth} Clifford entangling layers (alternating CX/CZ), "
            f"{depth * 2} single-qubit rotations (H, S). All 3 non-identity stabilizers sampled."
        ),
        "recommendedTactics": (
            f"Deploy {2 if depth >= 6 else 1} spacetime checks with at least 500 shots. "
            "Defend when boss intent indicates charged decoherence."
        ),
    }


def roman_numeral(num: int) -> str:
    """Helper to generate clean roman numerals for procedural boss tiers."""
    val = [10, 9, 5, 4, 1]
    syb = ["X", "IX", "V", "IV", "I"]
    res = ""
    i = 0
    while num > 0 and i < len(val):
        for _ in range(num // val[i]):
            res += syb[i]
            num -= val[i]
        i += 1
    return res or "I"


def get_quantum_technologies_glossary() -> list[dict[str, Any]]:
    """Return structured quantum computing technologies used throughout the game."""
    return [
        {
            "id": "stabilizers",
            "title": "Stabilizer Formalism & Gottesman-Knill Theorem",
            "tag": "QUANTUM MATHEMATICS",
            "summary": "Efficient classical simulation of pure Clifford group quantum operations.",
            "description": (
                "For an n-qubit stabilizer state |psi>, the state is uniquely defined as the +1 simultaneous eigenstate "
                "of an abelian subgroup of 2^n Pauli operators. The Gottesman-Knill theorem proves that circuits composed "
                "exclusively of Clifford gates (Hadamard H, Phase S, CNOT, CZ) and Pauli measurements can be perfectly "
                "simulated in polynomial time on classical processors, while preserving true quantum non-locality and entanglement."
            ),
            "math": "|psi><psi| = (1 / 2^n) * sum_{P in S} P",
        },
        {
            "id": "paulice",
            "title": "Spacetime Pauli Checks (qiskit-paulice)",
            "tag": "ERROR DETECTION",
            "summary": "Mid-circuit syndrome checks with ancilla wires and classical post-selection.",
            "description": (
                "qiskit-paulice inserts ancilla qubits into the Clifford circuit that measure intermediate Pauli stabilizer generators. "
                "When noise causes a bit-flip (X) or phase-flip (Z), the measurement syndrome flags an anomaly. In this game, "
                "syndrome post-selection discards corrupted experimental shots, boosting state fidelity from raw values (~85-92%) "
                "to near-pure state fidelity (>98%), demonstrating real fault-tolerant architectural principles."
            ),
            "math": "F_post = (1 + sum_{S != I} <S>_post) / 2^n",
        },
        {
            "id": "aer_noise",
            "title": "Qiskit Aer Synthetic Noise Models",
            "tag": "HARDWARE PHYSICS",
            "summary": "Realistic depolarizing and readout noise channels simulating noisy quantum processors.",
            "description": (
                "Real quantum processors (like IBM Quantum Heron or Eagle) experience environmental decoherence and gate infidelities. "
                "The game configures depolarizing quantum error channels on all 1-qubit and 2-qubit Clifford operations, "
                "along with asymmetric classical readout confusion matrices on terminal measurements."
            ),
            "math": "E(rho) = (1 - p)*rho + (p/3)*(X*rho*X + Y*rho*Y + Z*rho*Z)",
        },
        {
            "id": "ftqc_tradeoff",
            "title": "The Post-Selection Throughput Trade-off",
            "tag": "FAULT TOLERANCE",
            "summary": "The fundamental tension between error suppression and discarded computational shots.",
            "description": (
                "Detecting errors via post-selection creates a trade-off: adding more spacetime checks catches more errors (raising fidelity), "
                "but discards more experimental shots (reducing throughput). If too many checks are added in a deep noisy circuit, "
                "all shots may be rejected (shot starvation). Players must strategically balance checks (0, 1, or 2) to survive."
            ),
            "math": "Throughput = N_retained / N_total  (Efficiency vs Purity)",
        },
    ]
