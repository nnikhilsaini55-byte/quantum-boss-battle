import React from 'react';
import { Atom, Zap } from 'lucide-react';

/**
 * Animated Quantum Simulation Circuit Loader:
 * Shows animated quantum circuit wires, traveling wave packets,
 * and stabilizer check ancillas while Qiskit Aer is running.
 */
export default function SimulationLoader({ depth = 2, checks = 1, shots = 500 }) {
  return (
    <div className="simulation-loader-overlay">
      <div className="sim-loader-card">
        <div className="loader-head">
          <Atom size={28} className="spin-fast text-cyan" />
          <div className="loader-titles">
            <h4>EXECUTING QUANTUM STABILIZER SIMULATION</h4>
            <span>Qiskit Aer Stabilizer Simulator · qiskit-paulice</span>
          </div>
        </div>

        {/* Animated Quantum Circuit Wireframe */}
        <div className="sim-circuit-viz">
          {/* Wire 0 */}
          <div className="circuit-qubit-lane">
            <span className="lane-label">q[0] |0⟩</span>
            <div className="lane-wire">
              <div className="wave-packet p-0" />
              <div className="viz-gate gate-h">H</div>
              <div className="viz-gate gate-cx">CX</div>
              <div className="viz-gate gate-s">S</div>
              <div className="viz-gate gate-meas">M</div>
            </div>
          </div>

          {/* Wire 1 */}
          <div className="circuit-qubit-lane">
            <span className="lane-label">q[1] |0⟩</span>
            <div className="lane-wire">
              <div className="wave-packet p-1" />
              <div className="viz-gate gate-s">S</div>
              <div className="viz-gate gate-cx-target">●</div>
              <div className="viz-gate gate-h">H</div>
              <div className="viz-gate gate-meas">M</div>
            </div>
          </div>

          {/* Ancilla Syndrome Wire (if checks > 0) */}
          {checks > 0 && (
            <div className="circuit-qubit-lane ancilla-lane">
              <span className="lane-label ancilla-label">anc[0] |0⟩</span>
              <div className="lane-wire ancilla-wire">
                <div className="wave-packet p-anc" />
                <div className="viz-gate gate-syn">SYN</div>
                <div className="viz-gate gate-post">POST-SEL</div>
              </div>
            </div>
          )}
        </div>

        <div className="loader-meta-row">
          <span>SAMPLING {shots.toLocaleString()} SHOTS ACROSS ALL 3 STABILIZERS</span>
          <span>POST-SELECTING TRIVIAL SYNDROMES…</span>
        </div>

        <div className="loader-progress-bar">
          <div className="progress-fill-active" />
        </div>
      </div>
    </div>
  );
}
