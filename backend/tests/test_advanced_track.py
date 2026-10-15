import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import quantum_engine
import main
from main import BenchmarkRequest


class TestAdvancedTrackCompliance(unittest.TestCase):
    def setUp(self):
        pass

    def test_req1_circuit_families(self):
        """REQ-1: Clifford and T-doped circuit families with varying T-gate counts."""
        # Clifford circuit (T=0)
        c_qc = quantum_engine.build_clifford_payload(depth=2)
        self.assertEqual(c_qc.num_qubits, 2)
        ops_c = c_qc.count_ops()
        self.assertNotIn("t", ops_c)
        self.assertIn("h", ops_c)

        # T-doped circuits for T in {0, 1, 2, 4}
        for t_count in [0, 1, 2, 4]:
            t_qc = quantum_engine.build_tdoped_payload(depth=4, num_t_gates=t_count)
            self.assertEqual(t_qc.num_qubits, 2)
            ops = t_qc.count_ops()
            if t_count > 0:
                self.assertEqual(ops.get("t", 0), t_count)
            else:
                self.assertNotIn("t", ops)

    def test_req2_reference_outputs_and_justifications(self):
        """REQ-2: Stabilizer simulation for Clifford, statevector for T-doped, with justifications."""
        # Clifford evaluation
        res_cliff = quantum_engine.evaluate_quantum_circuit(depth=2, num_t_gates=0, checks=1, shots=300)
        self.assertEqual(res_cliff["reference_type"], "Stabilizer Simulation")
        self.assertIn("Exact 2-qubit stabilizer state projector formula", res_cliff["fidelity_method_justification"])

        # T-doped evaluation
        res_tdoped = quantum_engine.evaluate_quantum_circuit(depth=2, num_t_gates=2, checks=1, shots=300)
        self.assertEqual(res_tdoped["reference_type"], "Statevector Simulation")
        self.assertIn("Standard quantum state fidelity against the exact non-Clifford statevector reference", res_tdoped["fidelity_method_justification"])

    def test_req3_paulice_checks_and_variations(self):
        """REQ-3: qiskit-paulice spacetime checks with check-count and placement variations."""
        # Check-count variation: 0 vs 1 vs 2
        for checks in [0, 1, 2]:
            res = quantum_engine.evaluate_quantum_circuit(depth=2, num_t_gates=0, checks=checks, shots=200)
            self.assertGreaterEqual(res["checks_used"], 0)
            self.assertLessEqual(res["checks_used"], 2)

        # Check-placement variation: [0, 1] vs [0] vs [1]
        for placement in [[0, 1], [0], [1]]:
            res = quantum_engine.evaluate_quantum_circuit(
                depth=2, num_t_gates=0, checks=1, target_qubits=placement, shots=200
            )
            self.assertIn("postselected_fidelity", res)
            self.assertGreater(res["postselected_fidelity"], 0.0)

    def test_req4_tdoped_commuting_checks_rule(self):
        """REQ-4: For T-doped circuits, checks crossing T gates must commute with Z (T Z T^\\dagger = Z)."""
        qc, ancillas, added_2q = quantum_engine.build_tdoped_checked_circuit(
            depth=2, num_t_gates=2, check_count=1, target_qubits=[0, 1]
        )
        self.assertGreater(ancillas, 0)
        # Verify ancilla is coupled with CZ (which is diagonal and strictly commutes with T)
        ops = qc.count_ops()
        self.assertIn("cz", ops)
        self.assertIn("t", ops)

    def test_req5_noise_model_configuration(self):
        """REQ-5: Organizer-specified noise model hook and fallback baseline."""
        noise, desc, is_org = quantum_engine.get_configured_noise_model(gate_noise=0.015, readout_noise=0.01)
        self.assertIsNotNone(noise)
        self.assertIn("Aer Calibrated Depolarizing", desc)
        self.assertFalse(is_org)
        self.assertIn("Organizer-specified fake backend", quantum_engine.ORGANIZER_CONFIG_DOCS)

    def test_req6_all_seven_metrics_reported(self):
        """REQ-6: Measure and report all 7 required metrics."""
        res = quantum_engine.evaluate_quantum_circuit(depth=2, num_t_gates=0, checks=1, shots=300)

        # 1. raw fidelity without checks
        self.assertIn("raw_fidelity", res)
        self.assertGreaterEqual(res["raw_fidelity"], 0.0)
        self.assertLessEqual(res["raw_fidelity"], 1.0)

        # 2. post-selected fidelity with checks
        self.assertIn("postselected_fidelity", res)
        self.assertGreaterEqual(res["postselected_fidelity"], 0.0)
        self.assertLessEqual(res["postselected_fidelity"], 1.0)

        # 3. kept-shot fraction
        self.assertIn("retained_fraction", res)
        self.assertGreaterEqual(res["retained_fraction"], 0.0)
        self.assertLessEqual(res["retained_fraction"], 1.0)

        # 4. discarded shots
        self.assertIn("discarded_shots", res)
        self.assertGreaterEqual(res["discarded_shots"], 0)
        self.assertEqual(res["discarded_shots"], res["total_shots"] - res["retained_shots"])

        # 5. ancilla-qubit overhead
        self.assertIn("ancilla_qubits_added", res)
        self.assertGreaterEqual(res["ancilla_qubits_added"], 0)

        # 6. added two-qubit gates
        self.assertIn("added_two_qubit_gates", res)
        self.assertGreaterEqual(res["added_two_qubit_gates"], 0.0)

        # 7. added circuit depth
        self.assertIn("added_circuit_depth", res)
        self.assertGreaterEqual(res["added_circuit_depth"], 0.0)

    def test_req7_comparative_tradeoff_study(self):
        """REQ-7: Multi-dimensional study across T counts, depths, checks, and placements with Pareto analysis."""
        study = quantum_engine.run_advanced_tradeoff_study()
        self.assertEqual(study["status"], "success")
        self.assertGreater(len(study["benchmark_dataset"]), 10)
        self.assertIn("PARETO FIDELITY-VS-OVERHEAD TRADEOFF ANALYSIS", study["pareto_analysis"])
        self.assertEqual(len(study["compliance_checklist"]), 10)

    def test_fastapi_endpoints(self):
        """Verify API endpoints /api/quantum/advanced_evaluation and /api/quantum/benchmark."""
        # Advanced evaluation endpoint function
        data = main.get_advanced_evaluation()
        self.assertIn("benchmark_dataset", data)
        self.assertIn("compliance_checklist", data)

        # Benchmark endpoint function
        bm_req = BenchmarkRequest(
            depth=2,
            num_t_gates=1,
            checks=1,
            shots=200,
        )
        bm_data = main.run_benchmark(bm_req)
        self.assertIn("raw_fidelity", bm_data)
        self.assertIn("postselected_fidelity", bm_data)
        self.assertIn("discarded_shots", bm_data)

    def test_zero_check_baseline_guarantees_equal_fidelity(self):
        """Fix 1: Zero-check baseline must guarantee F_post == F_raw, delta == 0, and 0 discarded shots."""
        # 1. Clifford circuit (num_t_gates=0)
        cliff_res = quantum_engine.evaluate_quantum_circuit(depth=2, num_t_gates=0, checks=0, shots=200)
        self.assertEqual(cliff_res["raw_fidelity"], cliff_res["postselected_fidelity"])
        self.assertEqual(cliff_res["fidelity_delta"], 0.0)
        self.assertEqual(cliff_res["discarded_shots"], 0)
        self.assertEqual(cliff_res["retained_fraction"], 1.0)
        self.assertEqual(cliff_res["retained_percent"], 100.0)
        self.assertEqual(cliff_res["retained_shots"], cliff_res["total_shots"])
        self.assertEqual(cliff_res["ancilla_qubits_added"], 0)

        # 2. T-doped circuit (num_t_gates=2)
        tdoped_res = quantum_engine.evaluate_quantum_circuit(depth=2, num_t_gates=2, checks=0, shots=200)
        self.assertEqual(tdoped_res["raw_fidelity"], tdoped_res["postselected_fidelity"])
        self.assertEqual(tdoped_res["fidelity_delta"], 0.0)
        self.assertEqual(tdoped_res["discarded_shots"], 0)
        self.assertEqual(tdoped_res["retained_fraction"], 1.0)
        self.assertEqual(tdoped_res["retained_percent"], 100.0)
        self.assertEqual(tdoped_res["retained_shots"], tdoped_res["total_shots"])
        self.assertEqual(tdoped_res["ancilla_qubits_added"], 0)

    def test_check_placement_selector_affects_configuration(self):
        """Fix 3: Check-placement selector passes target qubits and alters circuit configuration."""
        for target in [[0, 1], [0], [1]]:
            res = quantum_engine.evaluate_quantum_circuit(
                depth=2, num_t_gates=0, checks=1, target_qubits=target, shots=200
            )
            self.assertEqual(res["target_qubits"], target)

        # Via run_battle API function
        battle_res = quantum_engine.run_battle(level=1, checks=1, shots=200, target_qubits=[0])
        self.assertEqual(battle_res["target_qubits"], [0])

        # Via FastAPI BattleRequest schema
        b_req = main.BattleRequest(level=1, checks=1, shots=200, target_qubits=[1])
        api_res = main.battle(b_req)
        self.assertEqual(api_res["target_qubits"], [1])

    def test_total_shot_starvation_clifford(self):
        """Verify Requirement 2: Clifford total shot starvation fallback and labeling.

        - Do NOT report raw expectation as genuine post-selected fidelity.
        - Clearly label post-selected result as unavailable / fallback as raw estimate.
        - Display retained shots = 0, discarded shots = total shots, and retained fraction = 0%.
        - Ensure fidelity gain (0.0) and score (0.0) do not misleadingly imply success.
        - Provide clear warning message.
        """
        from unittest.mock import patch, MagicMock
        import numpy as np

        qc = quantum_engine.rotate_for_measurement(
            quantum_engine.build_clifford_payload(2), quantum_engine.Pauli("ZZ")
        )
        with patch("quantum_engine.add_pauli_checks") as mock_add:
            mock_variant = MagicMock()
            mock_variant.circuit = qc
            # Force all shots to fail postselection
            mock_variant.get_postselection_method.return_value = lambda bits: np.array([True])
            mock_add.return_value = [mock_variant, mock_variant]

            res = quantum_engine.evaluate_quantum_circuit(
                depth=2, num_t_gates=0, checks=1, shots=150
            )

            # 1. Total shot starvation flag
            self.assertTrue(res["shot_starvation"])

            # 2. Genuine postselected fidelity must be None (not raw expectation)
            self.assertIsNone(res["postselected_fidelity"])

            # 3. Clearly labeled status and raw estimate fallback
            self.assertEqual(res["postselected_fidelity_status"], "unavailable")
            self.assertEqual(res["raw_estimate_fidelity"], res["raw_fidelity"])

            # 4. Shot counts: retained = 0, discarded = total, fraction = 0%
            self.assertEqual(res["retained_shots"], 0)
            self.assertEqual(res["discarded_shots"], res["total_shots"])
            self.assertEqual(res["retained_fraction"], 0.0)
            self.assertEqual(res["retained_percent"], 0.0)

            # 5. No misleading fidelity gain or score
            self.assertEqual(res["fidelity_delta"], 0.0)
            self.assertEqual(res["score"], 0.0)

            # 6. Clear warning provided
            self.assertIsNotNone(res["warning"])
            self.assertIn("Shot starvation detected", res["warning"])

            # 7. Stabilizer telemetry labels
            for entry in res["stabilizer_telemetry"]:
                self.assertTrue(entry["is_starved"])
                self.assertIsNone(entry["post_expectation"])
                self.assertEqual(entry["improvement"], 0.0)
                self.assertIn("Unavailable", entry["fallback_label"])

    def test_total_shot_starvation_tdoped(self):
        """Verify Requirement 2: T-doped total shot starvation fallback and labeling."""
        from unittest.mock import patch, MagicMock

        with patch("quantum_engine.AerSimulator.run") as mock_run:
            mock_res_raw = MagicMock()
            mock_res_raw.result().get_counts.side_effect = lambda: {"00": 100}
            mock_res_chk = MagicMock()
            # Ancilla measured '1' (error detected), so 0 shots retained
            mock_res_chk.result().get_counts.side_effect = lambda: {"100": 100}
            mock_run.side_effect = [mock_res_raw, mock_res_chk] * 30

            res = quantum_engine.evaluate_quantum_circuit(
                depth=2, num_t_gates=2, checks=1, shots=100
            )

            self.assertTrue(res["shot_starvation"])
            self.assertIsNone(res["postselected_fidelity"])
            self.assertEqual(res["postselected_fidelity_status"], "unavailable")
            self.assertEqual(res["raw_estimate_fidelity"], res["raw_fidelity"])
            self.assertEqual(res["retained_shots"], 0)
            self.assertEqual(res["discarded_shots"], res["total_shots"])
            self.assertEqual(res["retained_fraction"], 0.0)
            self.assertEqual(res["retained_percent"], 0.0)
            self.assertEqual(res["fidelity_delta"], 0.0)
            self.assertEqual(res["score"], 0.0)
            self.assertIsNotNone(res["warning"])

    def test_partial_shot_retention_and_overhead_accounting(self):
        """Verify Requirement 3 & 4: Normal partial shot retention and overhead metrics."""
        res = quantum_engine.evaluate_quantum_circuit(
            depth=2, num_t_gates=0, checks=1, shots=300
        )

        self.assertFalse(res["shot_starvation"])
        self.assertIsNotNone(res["postselected_fidelity"])
        self.assertEqual(res["postselected_fidelity_status"], "valid")

        # Retained + Discarded must sum identically to Total
        self.assertEqual(res["retained_shots"] + res["discarded_shots"], res["total_shots"])
        self.assertGreater(res["retained_shots"], 0)
        self.assertLess(res["retained_shots"], res["total_shots"])

        # Fraction calculation consistency
        expected_frac = round(res["retained_shots"] / res["total_shots"], 4)
        self.assertEqual(res["retained_fraction"], expected_frac)
        self.assertEqual(res["retained_percent"], round(100.0 * expected_frac, 1))

        # Overhead accounting consistency
        self.assertEqual(res["ancilla_qubits_added"], 1)
        self.assertEqual(res["circuit_width_checked"], res["circuit_width_raw"] + 1)
        self.assertGreaterEqual(res["added_two_qubit_gates"], 0.0)
        self.assertGreaterEqual(res["added_circuit_depth"], 0.0)

    def test_zero_checks_preserves_raw_fidelity_and_throughput(self):
        """Verify Requirement 4: Zero-check execution across Clifford and T-doped families."""
        # Clifford (T=0)
        c_res = quantum_engine.evaluate_quantum_circuit(depth=2, num_t_gates=0, checks=0, shots=200)
        self.assertFalse(c_res["shot_starvation"])
        self.assertEqual(c_res["postselected_fidelity"], c_res["raw_fidelity"])
        self.assertEqual(c_res["fidelity_delta"], 0.0)
        self.assertEqual(c_res["retained_shots"], c_res["total_shots"])
        self.assertEqual(c_res["discarded_shots"], 0)
        self.assertEqual(c_res["retained_fraction"], 1.0)
        self.assertEqual(c_res["retained_percent"], 100.0)
        self.assertEqual(c_res["ancilla_qubits_added"], 0)
        self.assertEqual(c_res["postselected_fidelity_status"], "unprotected_baseline")
        self.assertIsNone(c_res["warning"])

        # T-doped (T=1)
        t_res = quantum_engine.evaluate_quantum_circuit(depth=2, num_t_gates=1, checks=0, shots=200)
        self.assertFalse(t_res["shot_starvation"])
        self.assertEqual(t_res["postselected_fidelity"], t_res["raw_fidelity"])
        self.assertEqual(t_res["fidelity_delta"], 0.0)
        self.assertEqual(t_res["retained_shots"], t_res["total_shots"])
        self.assertEqual(t_res["discarded_shots"], 0)
        self.assertEqual(t_res["retained_fraction"], 1.0)
        self.assertEqual(t_res["retained_percent"], 100.0)
        self.assertEqual(t_res["ancilla_qubits_added"], 0)
        self.assertEqual(t_res["postselected_fidelity_status"], "unprotected_baseline")

    def test_hardware_clarification_and_fallback_labeling(self):
        """Verify Requirement 1 & 4: Hardware notice confirms no real hardware execution claimed."""
        res = quantum_engine.evaluate_quantum_circuit(depth=2, num_t_gates=0, checks=1, shots=200)

        # Hardware execution notice
        self.assertIn("hardware_execution_note", res)
        self.assertIn("Real IBM Quantum physical hardware backend execution is neither implemented nor claimed", res["hardware_execution_note"])

        # Fallback organizer baseline documentation
        self.assertFalse(res["is_organizer_backend"])
        self.assertIn("ORGANIZER_BACKEND", res["organizer_note"])
        self.assertIn("Real IBM Quantum physical hardware backend execution is neither implemented nor claimed", res["organizer_note"])

        # run_battle also propagates note
        battle_res = quantum_engine.run_battle(level=1, checks=1, shots=200)
        self.assertIn("Real IBM Quantum physical hardware backend execution is neither implemented nor claimed", battle_res["note"])


if __name__ == "__main__":
    unittest.main()


