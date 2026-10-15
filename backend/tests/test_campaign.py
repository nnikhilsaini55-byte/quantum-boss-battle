"""End-to-end campaign integration test across all 3 boss levels."""
import json
import sys
import unittest
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from quantum_engine import run_battle


class CampaignIntegrationTests(unittest.TestCase):
    def test_complete_campaign_simulation_across_all_three_levels(self):
        levels = [
            {"id": 1, "name": "THE GLITCHLING", "maxHp": 100, "bossAttack": 15, "playerAttack": 20},
            {"id": 2, "name": "THE NOISE WRAITH", "maxHp": 120, "bossAttack": 20, "playerAttack": 20},
            {"id": 3, "name": "THE FIDELITY TITAN", "maxHp": 150, "bossAttack": 25, "playerAttack": 20},
        ]

        for lvl in levels:
            boss_hp = lvl["maxHp"]
            player_hp = 100
            rounds_survived = 0

            while boss_hp > 0 and player_hp > 0:
                # Direct quantum engine execution
                data = run_battle(level=lvl["id"], checks=1, shots=200, num_t_gates=0)

                post_fid = data["postselected_fidelity"]
                retained = data["retained_fraction"]
                self.assertGreater(post_fid, 0.0)
                self.assertGreater(retained, 0.0)

                # Player Attack + quantum bonus
                bonus = round(20 * max(0, post_fid - 0.70))
                dmg_to_boss = lvl["playerAttack"] + bonus
                boss_hp = max(0, boss_hp - dmg_to_boss)
                rounds_survived += 1

                if boss_hp <= 0:
                    break

                # Defend: ~50% damage reduction
                incoming = lvl["bossAttack"]
                blocked = incoming // 2
                actual = max(1, incoming - blocked)
                self.assertGreater(actual, 0)
                player_hp = max(0, player_hp - actual)

            self.assertLessEqual(boss_hp, 0, f"Boss on level {lvl['name']} was not defeated")
            self.assertGreater(player_hp, 0, f"Player fell on level {lvl['name']}")
            self.assertGreater(rounds_survived, 0)


if __name__ == "__main__":
    unittest.main()
