import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from ai_engine import (
    generate_adaptive_next_level,
    generate_tactical_advice,
    get_quantum_technologies_glossary,
)
from quantum_engine import get_circuit_telemetry, run_battle


class AIEngineTests(unittest.TestCase):
    def test_tactical_advice_recommends_defend_when_low_hp(self):
        advice = generate_tactical_advice(
            level=2,
            player_hp=15,  # Endangered
            boss_hp=100,
            round_num=3,
            checks=1,
            shots=500,
            last_fidelity=0.92,
            last_retained=85.0,
        )
        self.assertEqual(advice["recommended_action"], "defend")
        self.assertGreaterEqual(advice["confidence"], 90)
        self.assertEqual(advice["boss_threat_level"], "CRITICAL")

    def test_tactical_advice_recommends_attack_when_boss_low_hp(self):
        advice = generate_tactical_advice(
            level=1,
            player_hp=90,
            boss_hp=20,  # Lethal window
            round_num=3,
            checks=1,
            shots=500,
        )
        self.assertEqual(advice["recommended_action"], "attack")
        self.assertIn("Lethal", advice["headline"])

    def test_adaptive_level_generation_scales_from_previous(self):
        next_lvl = generate_adaptive_next_level(
            previous_level=1,
            average_fidelity=0.98,
            shots_retained=94.0,
            rounds_taken=2,
            core_hp_remaining=85,
        )
        self.assertEqual(next_lvl["id"], 2)
        self.assertGreater(next_lvl["depth"], 2)
        self.assertIn("boss", next_lvl)
        self.assertIn("aiGenesisReport", next_lvl)

    def test_circuit_telemetry(self):
        telemetry = get_circuit_telemetry(depth=3)
        self.assertEqual(telemetry["num_qubits"], 2)
        self.assertEqual(telemetry["depth"], 3)
        self.assertGreaterEqual(len(telemetry["gates"]), 6)
        self.assertEqual(len(telemetry["stabilizer_generators"]), 3)

    def test_quantum_technologies_glossary(self):
        techs = get_quantum_technologies_glossary()
        self.assertGreaterEqual(len(techs), 4)
        tech_ids = [t["id"] for t in techs]
        self.assertIn("stabilizers", tech_ids)
        self.assertIn("paulice", tech_ids)
        self.assertIn("aer_noise", tech_ids)


if __name__ == "__main__":
    unittest.main()
