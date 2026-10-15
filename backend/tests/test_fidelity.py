import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from quantum_engine import stabilizer_state_fidelity


class StabilizerFidelityTests(unittest.TestCase):
    def test_perfect_ideal_state(self):
        self.assertAlmostEqual(stabilizer_state_fidelity([1.0, 1.0, 1.0], 2), 1.0)

    def test_maximally_mixed_expectations(self):
        self.assertAlmostEqual(stabilizer_state_fidelity([0.0, 0.0, 0.0], 2), 0.25)

    def test_orthogonal_stabilizer_state(self):
        self.assertAlmostEqual(stabilizer_state_fidelity([1.0, -1.0, -1.0], 2), 0.0)

    def test_rejects_incomplete_stabilizer_set(self):
        with self.assertRaises(ValueError):
            stabilizer_state_fidelity([1.0, 1.0], 2)


if __name__ == "__main__":
    unittest.main()
