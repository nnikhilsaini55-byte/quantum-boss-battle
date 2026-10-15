import React, { useState } from 'react';
import { BookOpen, XCircle, Atom, Swords, Shield, Cpu, HelpCircle, GitCommit, CheckCircle2 } from 'lucide-react';

/**
 * Combat & Quantum Error Detection Tutorial Modal:
 * Explains:
 * 1. Dual-Action Combat System (Attack, Defend 50% mitigation, Round Resolution)
 * 2. Error Syndromes & Spacetime Ancilla Checks
 * 3. Syndrome Post-Selection (Filtering Corrupted Shots)
 * 4. Error Detection vs Mitigation vs Correction (QED vs QEM vs QEC)
 * 5. Clifford & T-Gate Commutation Restrictions
 */
export default function CombatRulesModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('combat'); // 'combat' | 'syndromes' | 'comparison' | 'clifford'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-large"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '900px', width: '92vw', maxHeight: '88vh' }}
      >
        {/* Modal Header */}
        <div className="modal-dialog-head">
          <div className="modal-head-title">
            <BookOpen size={22} className="text-cyan" />
            <div>
              <h2>COMBAT & QUANTUM TUTORIAL</h2>
              <span className="modal-head-subtitle">
                Game Mechanics, Spacetime Pauli Checks & Error-Detection Science
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <XCircle size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="report-tab-bar" style={{ marginBottom: 16 }}>
          <button
            type="button"
            className={`report-tab-btn ${activeTab === 'combat' ? 'active' : ''}`}
            onClick={() => setActiveTab('combat')}
          >
            <Swords size={14} />
            <span>1. COMBAT RULES</span>
          </button>

          <button
            type="button"
            className={`report-tab-btn ${activeTab === 'syndromes' ? 'active' : ''}`}
            onClick={() => setActiveTab('syndromes')}
          >
            <Atom size={14} />
            <span>2. SYNDROMES & POST-SELECTION</span>
          </button>

          <button
            type="button"
            className={`report-tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            <GitCommit size={14} />
            <span>3. DETECTION VS MITIGATION VS CORRECTION</span>
          </button>

          <button
            type="button"
            className={`report-tab-btn ${activeTab === 'clifford' ? 'active' : ''}`}
            onClick={() => setActiveTab('clifford')}
          >
            <Cpu size={14} />
            <span>4. CLIFFORD & T-GATES</span>
          </button>
        </div>

        <div className="modal-body-content" style={{ overflowY: 'auto', maxHeight: 'calc(88vh - 160px)' }}>
          {/* TAB 1: COMBAT RULES */}
          {activeTab === 'combat' && (
            <div className="tab-pane">
              <div className="rule-card">
                <h4><Swords size={16} /> 1. Dual-Action Selection (Attack & Defend Together)</h4>
                <p>
                  In each combat round, you can choose <strong>ATTACK</strong>, <strong>DEFEND</strong>, or <strong>BOTH</strong> before the boss responds.
                </p>
                <ul>
                  <li>Clicking Attack does <strong>NOT</strong> disable Defend.</li>
                  <li>Clicking Defend does <strong>NOT</strong> disable Attack.</li>
                  <li>You may select or deselect actions in any order during your turn.</li>
                  <li>Actions are locked only during round resolution to prevent accidental duplicate damage.</li>
                </ul>
              </div>

              <div className="rule-card">
                <h4><Swords size={16} /> 2. Attack Behavior: Payload Execution</h4>
                <p>
                  Executing an Attack runs the 2-qubit data circuit. Damage to the boss is composed of:
                </p>
                <div className="formula-box">
                  <code>
                    Attack Damage = Base Damage (20 HP) + Quantum Fidelity Bonus (0 to +6 HP)<br />
                    Fidelity Bonus = round(20 * max(0, postselected_fidelity - 0.70))
                  </code>
                </div>
                <p>
                  Higher post-selected fidelity from your quantum circuit translates into stronger attack strikes!
                </p>
              </div>

              <div className="rule-card">
                <h4><Shield size={16} /> 3. Defend Behavior: ~50% Damage Mitigation</h4>
                <p>
                  Defending activates a visible syndrome energy shield on your warrior.
                </p>
                <div className="formula-box">
                  <code>
                    Blocked Damage = floor(boss_attack * 0.5)<br />
                    Actual Damage Received = max(1, boss_attack - blocked_damage)<br />
                    Shield Status: Consumed after blocking one boss attack strike.
                  </code>
                </div>
                <p>
                  <strong>Important:</strong> Defending does <strong>NOT</strong> reduce damage to zero. It mitigates approximately 50% of incoming boss damage (with a minimum of 1 damage). The interface displays incoming damage, blocked damage, and actual damage received.
                </p>
              </div>

              <div className="rule-card">
                <h4><Cpu size={16} /> 4. Three Boss Missions</h4>
                <div className="formula-box">
                  <code>
                    Level 1 — THE GLITCHLING: 100 HP, 15 Attack (Depth 2 Clifford)<br />
                    Level 2 — THE NOISE WRAITH: 120 HP, 20 Attack (Depth 4 Clifford)<br />
                    Level 3 — THE FIDELITY TITAN: 150 HP, 25 Attack (Depth 6 Clifford / T-Doped)
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYNDROMES & POST-SELECTION */}
          {activeTab === 'syndromes' && (
            <div className="tab-pane">
              <div className="rule-card">
                <h4><Atom size={16} /> What is an Error Syndrome?</h4>
                <p>
                  Quantum information cannot be copied (No-Cloning Theorem), nor can data qubits be measured directly without collapsing their superposition.
                </p>
                <p>
                  Instead, <strong>spacetime Pauli checks</strong> couple auxiliary <em>ancilla qubits</em> to data qubits using entangling gates (e.g. CNOT, CZ) at intermediate points in the circuit. Measuring the ancilla produces a <strong>syndrome bit</strong> (0 = no error, 1 = parity flip error) without destroying the logical state.
                </p>
              </div>

              <div className="rule-card">
                <h4><CheckCircle2 size={16} /> What is Post-Selection?</h4>
                <p>
                  In <strong>error detection</strong> via post-selection:
                </p>
                <ol>
                  <li>The quantum processor executes <em>N</em> total shots.</li>
                  <li>Shots where any ancilla syndrome bit equals '1' are flagged as corrupted.</li>
                  <li>These corrupted shots are <strong>discarded</strong>.</li>
                  <li>Only shots where all syndrome bits equal '0' are <strong>retained</strong>.</li>
                </ol>
                <div className="formula-box">
                  <code>
                    Retained-Shot Fraction (η) = N_retained / N_total<br />
                    Discarded Shots = N_total - N_retained<br />
                    Post-Selected Fidelity &gt; Raw Fidelity (on retained ensemble)
                  </code>
                </div>
                <p>
                  <strong>Key Trade-off:</strong> Post-selection purifies the retained quantum state, boosting fidelity by 5% to 15%. However, discarded shots reduce sampling throughput, requiring more total hardware runs.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DETECTION VS MITIGATION VS CORRECTION */}
          {activeTab === 'comparison' && (
            <div className="tab-pane">
              <div className="rule-card">
                <h4><GitCommit size={16} /> The Three Quantum Reliability Paradigms</h4>
                <p>
                  It is crucial to distinguish between error detection, error mitigation, and quantum error correction:
                </p>
                <div className="table-responsive" style={{ marginTop: 12 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>PARADIGM</th>
                        <th>HOW IT WORKS</th>
                        <th>ANCILLA OVERHEAD</th>
                        <th>REPAIRS STATE?</th>
                        <th>TRADE-OFF / DRAWBACK</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong className="text-cyan">Error Detection (QED)</strong><br /><small>(Used in this project)</small></td>
                        <td>Injects spacetime checks with ancillas; discards (post-selects) shots with non-trivial syndromes.</td>
                        <td>Low (+1 to +2 ancillas)</td>
                        <td><strong>No</strong> (corrupted states are discarded)</td>
                        <td>Elevates fidelity on kept shots, but suffers <em>shot starvation</em> from discarded shots.</td>
                      </tr>
                      <tr>
                        <td><strong className="text-purple">Error Mitigation (QEM)</strong></td>
                        <td>Classical post-processing (ZNE, PEC, CDR) that scales noise or runs inverted circuits to estimate ideal averages.</td>
                        <td>None (0 ancillas)</td>
                        <td><strong>No</strong> (expectation values estimated mathematically)</td>
                        <td>Requires exponential sampling overhead; limited to calculating expectation values, not output states.</td>
                      </tr>
                      <tr>
                        <td><strong className="text-gold">Error Correction (QEC)</strong></td>
                        <td>Encodes 1 logical qubit into many physical qubits (Surface Code). Measures syndromes and applies real-time unitary corrections.</td>
                        <td>Very High (1,000+ physical qubits per logical qubit)</td>
                        <td><strong>Yes</strong> (active feedback restores state)</td>
                        <td>Requires fault-tolerant hardware architectures with threshold physical error rates (&lt; 0.1%).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLIFFORD & T-GATES */}
          {activeTab === 'clifford' && (
            <div className="tab-pane">
              <div className="rule-card">
                <h4><Cpu size={16} /> Clifford Circuits & qiskit-paulice</h4>
                <p>
                  Clifford circuits are constructed strictly from Hadamard (H), Phase (S), CNOT, and CZ gates. By the <strong>Gottesman-Knill Theorem</strong>, Clifford operations map Pauli operators to Pauli operators under conjugation:
                </p>
                <div className="formula-box">
                  <code>
                    U P U† ∈ Pauli Group for all Clifford U and Pauli P.
                  </code>
                </div>
                <p>
                  The <strong>qiskit-paulice</strong> library leverages this property to automatically insert coherent spacetime Pauli checks that propagate through the Clifford gates.
                </p>
              </div>

              <div className="rule-card">
                <h4><Atom size={16} /> T-Gate Restrictions & Commuting Z-Checks</h4>
                <p>
                  The non-Clifford T gate (T = diag(1, e^(iπ/4))) does <strong>NOT</strong> preserve the Pauli group:
                </p>
                <div className="formula-box">
                  <code>
                    T X T† = (X + Y) / √2 (outside Pauli group!)
                  </code>
                </div>
                <p>
                  Therefore, <code>add_pauli_checks</code> cannot be applied blindly to circuits containing T gates.
                </p>
                <p>
                  Under the Qiskit Fall Fest 2026 Advanced Track rules:
                </p>
                <ul>
                  <li>Checks crossing a T gate must act as <strong>I or Z</strong> on that qubit at that point.</li>
                  <li>Because T is diagonal in the computational basis, it strictly commutes with Z: <code>T Z T† = Z</code>.</li>
                  <li>Our project implements carefully validated commuting Z-checks for T-doped circuits (T in &#123;0, 1, 2, 4&#125;), evaluated against exact Statevector reference simulation.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
