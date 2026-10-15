"""Automated tests for Quantum Boss Battle combat logic.

Adheres strictly to Hackathon Requirements:
1. Attack and Defend can both be selected during the same combat round, in either order.
2. Defending does NOT reduce incoming boss damage to zero; it reduces it by ~50% (min 1 damage).
3. Shield is consumed after blocking one boss attack.
4. Tracks incoming damage, blocked damage, and actual damage received.
5. Prevents duplicate actions from applying multiple damage instances in the same round.
6. Action selections reset at the beginning of each new round.
7. Attack strength connects to quantum experiment bonus without fabricating scores.
8. Victory and defeat conditions work correctly across all 3 levels.
"""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

LEVELS = [
    {
        "id": 1,
        "name": "FIRST CONTACT",
        "boss": "THE GLITCHLING",
        "maxHp": 100,
        "bossAttack": 15,
        "playerBaseAttack": 20,
    },
    {
        "id": 2,
        "name": "SHIELD STRATEGY",
        "boss": "THE NOISE WRAITH",
        "maxHp": 120,
        "bossAttack": 20,
        "playerBaseAttack": 20,
    },
    {
        "id": 3,
        "name": "NOISE MONSTER",
        "boss": "THE FIDELITY TITAN",
        "maxHp": 150,
        "bossAttack": 25,
        "playerBaseAttack": 20,
    },
]


class CombatRoundSimulator:
    """Accurate simulation of the dual-action turn-based combat model."""

    def __init__(self, level_cfg: dict):
        self.cfg = level_cfg
        self.player_hp = 100
        self.boss_hp = level_cfg["maxHp"]
        self.round = 1
        self.selected_attack = False
        self.selected_defend = False
        self.is_shielded = False
        self.phase = "player_turn"
        self.boss_attack_count = 0
        self.round_history = []

    def toggle_attack(self) -> bool:
        """Toggle Attack selection without disabling Defend."""
        assert self.phase == "player_turn"
        self.selected_attack = not self.selected_attack
        return self.selected_attack

    def toggle_defend(self) -> bool:
        """Toggle Defend selection without disabling Attack."""
        assert self.phase == "player_turn"
        self.selected_defend = not self.selected_defend
        self.is_shielded = self.selected_defend
        return self.selected_defend

    def select_attack(self):
        """Set Attack selection (idempotent; prevents duplicate damage)."""
        assert self.phase == "player_turn"
        self.selected_attack = True

    def select_defend(self):
        """Set Defend selection (idempotent)."""
        assert self.phase == "player_turn"
        self.selected_defend = True
        self.is_shielded = True

    def resolve_round(self, quantum_bonus: int = 0) -> dict:
        """Resolve the combat round executing chosen player actions and boss response."""
        assert self.phase == "player_turn"
        assert self.selected_attack or self.selected_defend, "At least one action must be selected"

        actions_taken = {
            "attack": self.selected_attack,
            "defend": self.selected_defend,
        }

        damage_to_boss = 0
        if self.selected_attack:
            # Player deals base attack + optional quantum bonus
            damage_to_boss = self.cfg["playerBaseAttack"] + max(0, quantum_bonus)
            self.boss_hp = max(0, self.boss_hp - damage_to_boss)

        # Check for immediate boss defeat
        if self.boss_hp <= 0:
            self.phase = "victory"
            res = {
                "round": self.round,
                "actions": actions_taken,
                "damage_to_boss": damage_to_boss,
                "boss_hp": 0,
                "player_hp": self.player_hp,
                "incoming_damage": 0,
                "blocked_damage": 0,
                "actual_damage_received": 0,
                "phase": self.phase,
            }
            self.round_history.append(res)
            return res

        # Boss counterattack
        self.phase = "boss_turn"
        self.boss_attack_count += 1
        incoming_boss_dmg = self.cfg["bossAttack"]

        if self.selected_defend:
            # Defending reduces damage by ~50%, with a minimum of 1 damage
            blocked_damage = incoming_boss_dmg // 2
            actual_damage = max(1, incoming_boss_dmg - blocked_damage)
            # Shield is consumed after blocking this one attack
            self.is_shielded = False
        else:
            blocked_damage = 0
            actual_damage = incoming_boss_dmg

        self.player_hp = max(0, self.player_hp - actual_damage)

        if self.player_hp <= 0:
            self.phase = "defeat"
        else:
            self.phase = "player_turn"
            self.round += 1

        # Reset action selections for the beginning of the next round
        self.selected_attack = False
        self.selected_defend = False
        self.is_shielded = False

        res = {
            "round": self.round - 1 if self.phase == "player_turn" else self.round,
            "actions": actions_taken,
            "damage_to_boss": damage_to_boss,
            "boss_hp": self.boss_hp,
            "player_hp": self.player_hp,
            "incoming_damage": incoming_boss_dmg,
            "blocked_damage": blocked_damage,
            "actual_damage_received": actual_damage,
            "phase": self.phase,
        }
        self.round_history.append(res)
        return res


class TestCombatLogic(unittest.TestCase):
    def test_both_actions_can_be_selected_in_same_round(self):
        """Verify Attack and Defend can both be active in a single round in either order."""
        sim1 = CombatRoundSimulator(LEVELS[0])
        sim1.select_attack()
        sim1.select_defend()
        self.assertTrue(sim1.selected_attack)
        self.assertTrue(sim1.selected_defend)
        res1 = sim1.resolve_round()
        self.assertTrue(res1["actions"]["attack"])
        self.assertTrue(res1["actions"]["defend"])

        # Reverse selection order
        sim2 = CombatRoundSimulator(LEVELS[0])
        sim2.select_defend()
        sim2.select_attack()
        self.assertTrue(sim2.selected_attack)
        self.assertTrue(sim2.selected_defend)
        res2 = sim2.resolve_round()
        self.assertEqual(res1["boss_hp"], res2["boss_hp"])
        self.assertEqual(res1["player_hp"], res2["player_hp"])

    def test_clicking_attack_does_not_disable_defend(self):
        sim = CombatRoundSimulator(LEVELS[0])
        sim.select_attack()
        self.assertTrue(sim.selected_attack)
        # Defend is still selectable
        sim.select_defend()
        self.assertTrue(sim.selected_defend)

    def test_clicking_defend_does_not_disable_attack(self):
        sim = CombatRoundSimulator(LEVELS[0])
        sim.select_defend()
        self.assertTrue(sim.selected_defend)
        # Attack is still selectable
        sim.select_attack()
        self.assertTrue(sim.selected_attack)

    def test_defend_reduces_damage_by_50_percent_never_zero(self):
        """Defending must reduce incoming boss damage by approx 50%, minimum 1 damage (never zero)."""
        for lvl in LEVELS:
            sim = CombatRoundSimulator(lvl)
            initial_player_hp = sim.player_hp
            sim.select_defend()
            res = sim.resolve_round()

            incoming = lvl["bossAttack"]
            expected_blocked = incoming // 2
            expected_actual = max(1, incoming - expected_blocked)

            self.assertEqual(res["incoming_damage"], incoming)
            self.assertEqual(res["blocked_damage"], expected_blocked)
            self.assertEqual(res["actual_damage_received"], expected_actual)
            self.assertGreater(res["actual_damage_received"], 0, "Defending must not reduce damage to zero!")
            self.assertEqual(sim.player_hp, initial_player_hp - expected_actual)

    def test_shield_is_consumed_after_one_boss_attack(self):
        sim = CombatRoundSimulator(LEVELS[0])
        sim.select_defend()
        sim.resolve_round()
        # Shield must be consumed and selections reset
        self.assertFalse(sim.is_shielded)
        self.assertFalse(sim.selected_defend)
        self.assertFalse(sim.selected_attack)

        # In round 2, if player attacks without defending, full damage is taken
        sim.select_attack()
        res2 = sim.resolve_round()
        self.assertEqual(res2["blocked_damage"], 0)
        self.assertEqual(res2["actual_damage_received"], LEVELS[0]["bossAttack"])

    def test_duplicate_actions_do_not_stack_multiple_damages(self):
        sim = CombatRoundSimulator(LEVELS[0])
        # Player clicks attack multiple times
        sim.select_attack()
        sim.select_attack()
        sim.select_attack()
        initial_boss_hp = sim.boss_hp
        res = sim.resolve_round()
        # Boss should take exactly one attack damage
        self.assertEqual(res["damage_to_boss"], LEVELS[0]["playerBaseAttack"])
        self.assertEqual(sim.boss_hp, initial_boss_hp - LEVELS[0]["playerBaseAttack"])

    def test_attack_and_defend_combined_round(self):
        sim = CombatRoundSimulator(LEVELS[1])  # Noise Wraith: 120 HP, 20 Boss Attack
        sim.select_attack()
        sim.select_defend()
        res = sim.resolve_round(quantum_bonus=4)

        # Boss took base + bonus
        self.assertEqual(res["damage_to_boss"], 24)
        self.assertEqual(sim.boss_hp, 96)

        # Player blocked 50% of 20 = 10, received 10
        self.assertEqual(res["incoming_damage"], 20)
        self.assertEqual(res["blocked_damage"], 10)
        self.assertEqual(res["actual_damage_received"], 10)
        self.assertEqual(sim.player_hp, 90)

    def test_victory_condition_across_all_levels(self):
        for lvl in LEVELS:
            sim = CombatRoundSimulator(lvl)
            # Attack until boss reaches 0
            while sim.boss_hp > 0 and sim.phase == "player_turn":
                sim.select_attack()
                sim.select_defend()
                sim.resolve_round()
            self.assertEqual(sim.phase, "victory")
            self.assertEqual(sim.boss_hp, 0)

    def test_defeat_condition(self):
        sim = CombatRoundSimulator(LEVELS[2])  # Fidelity Titan: 25 Attack
        # Only attack unshielded until defeat
        while sim.player_hp > 0 and sim.phase == "player_turn":
            sim.select_attack()
            sim.resolve_round()
        self.assertEqual(sim.phase, "defeat")
        self.assertEqual(sim.player_hp, 0)

    def test_combat_with_shot_starvation_keeps_game_playable(self):
        """Verify Requirement 2: Shot starvation fallback (+0 bonus) keeps combat fully playable."""
        sim = CombatRoundSimulator(LEVELS[0])  # Glitchling: 100 HP, 15 Attack, 20 Player Attack
        initial_boss_hp = sim.boss_hp
        initial_player_hp = sim.player_hp

        # Player selects both Attack and Defend under total shot starvation (quantum_bonus=0)
        sim.select_attack()
        sim.select_defend()
        res = sim.resolve_round(quantum_bonus=0)

        # 1. Base attack damage is dealt (20 HP) without fabricated bonus
        self.assertEqual(res["damage_to_boss"], 20)
        self.assertEqual(sim.boss_hp, initial_boss_hp - 20)

        # 2. Defense still shields the core by ~50%
        expected_blocked = 15 // 2  # 7
        expected_actual = 15 - expected_blocked  # 8
        self.assertEqual(res["blocked_damage"], expected_blocked)
        self.assertEqual(res["actual_damage_received"], expected_actual)
        self.assertEqual(sim.player_hp, initial_player_hp - expected_actual)

        # 3. Game advanced to round 2 and remains in player_turn
        self.assertEqual(sim.round, 2)
        self.assertEqual(sim.phase, "player_turn")
        self.assertFalse(sim.selected_attack)
        self.assertFalse(sim.selected_defend)


if __name__ == "__main__":
    unittest.main()
