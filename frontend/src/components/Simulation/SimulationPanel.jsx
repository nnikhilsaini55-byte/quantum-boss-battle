import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import {
  Atom,
  AlertTriangle,
  RotateCcw,
  Clock,
  Cpu,
  Award,
  Sparkles,
  History,
  TrendingUp,
  Shield,
  Layers,
  HelpCircle,
} from 'lucide-react';

/**
 * Quantum Simulation & Telemetry Panel (Hackathon Engine):
 * Authoritative implementation adhering to Qiskit Fall Fest 2026 Advanced Track:
 * - Real simulation metrics from Qiskit Aer & qiskit-paulice
 * - Baseline (raw) fidelity vs Post-selected fidelity
 * - Retained-shot fraction alongside postselected fidelity
 * - Accepted vs Rejected (discarded) shots
 * - Ancilla-qubit overhead, 2Q gate overhead, circuit depth
 * - Comparison chart: Fidelity vs Retained-shot fraction
 * - Strategy summary explaining trade-offs
 * - Round history table comparing earlier experiments
 * - Standby, loading, success, and error states
 */
export default function SimulationPanel({
  lastResult = null,
  isFetching = false,
  error = '',
  onRefreshTelemetry = null,
  onOpenAdvancedReport = null,
  onOpenTutorial = null,
  currentLevel = null,
  roundHistory = [],
}) {
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' | 'history'

  const isStarved = Boolean(
    lastResult?.shot_starvation ||
    lastResult?.postselected_fidelity === null ||
    lastResult?.postselected_fidelity === undefined
  );

  // Comparison chart data: Raw Fidelity, Post-Selected Fidelity, Retained Shot Fraction
  const comparisonData = lastResult
    ? [
        {
          metric: 'Raw Fidelity',
          value: Number((lastResult.raw_fidelity * 100).toFixed(1)),
          fill: '#6c757d',
          category: 'Fidelity',
        },
        {
          metric: isStarved ? 'Post-Selected (N/A)' : 'Post-Selected',
          value: isStarved ? 0 : Number((lastResult.postselected_fidelity * 100).toFixed(1)),
          fill: isStarved ? '#e63946' : '#00f5d4',
          category: 'Fidelity',
        },
        {
          metric: 'Shots Retained',
          value: Number(lastResult.retained_percent),
          fill: '#8338ec',
          category: 'Throughput',
        },
      ]
    : [];

  // Generate tactical / scientific strategy summary
  const getStrategySummary = () => {
    if (!lastResult) return null;
    if (isStarved) {
      return {
        title: 'SHOT STARVATION DETECTED (0 SHOTS RETAINED)',
        verdict: 'Throughput Collapsed / Zero Valid Shots',
        type: 'unprotected',
        desc: `No experimental shots survived post-selection (0 of ${lastResult.total_shots} kept, 100% discarded). Spacetime error checks detected errors on all shots. Post-selected fidelity is unavailable; displayed raw metrics represent unmitigated baseline estimates. Reduce check count or decrease circuit depth to restore sample throughput.`,
      };
    }
    const checksUsed = lastResult.ancilla_qubits_added ?? lastResult.checks_used ?? 0;
    const rawF = Number((lastResult.raw_fidelity * 100).toFixed(1));
    const postF = Number((lastResult.postselected_fidelity * 100).toFixed(1));
    const deltaF = Number(((lastResult.postselected_fidelity - lastResult.raw_fidelity) * 100).toFixed(1));
    const retained = Number(lastResult.retained_percent);
    const discarded = lastResult.discarded_shots ?? 0;

    if (checksUsed === 0) {
      return {
        title: 'UNPROTECTED PAYLOAD EXECUTION (0 CHECKS)',
        verdict: 'High Throughput / Zero Error Suppression',
        type: 'unprotected',
        desc: `No spacetime Pauli checks were injected. Zero ancilla overhead and 100% of shots (${lastResult.total_shots}) were retained, but environmental noise degraded the raw state fidelity to ${rawF}%. Defending will deploy spacetime checks to filter error syndromes.`,
      };
    }
    if (checksUsed === 1) {
      return {
        title: 'BALANCED SPACETIME CHECK STRATEGY (1 CHECK)',
        verdict: 'Optimal Pareto Trade-off',
        type: 'optimal',
        desc: `1 ancilla qubit detected error syndromes in the Clifford payload. Post-selection elevated fidelity by +${deltaF}% (from ${rawF}% to ${postF}%) while retaining ${retained}% of experimental shots (${discarded} corrupted shots rejected). This configuration balances high logical state purity against sampling throughput.`,
      };
    }
    return {
      title: 'AGGRESSIVE ERROR-DETECTION STRATEGY (2 CHECKS)',
      verdict: 'Maximum Error Filtering / Elevated Overhead',
      type: 'aggressive',
      desc: `2 ancilla qubits and +${lastResult.added_two_qubit_gates || 0} two-qubit check gates were injected. Output fidelity reached ${postF}%, but aggressive filtering discarded ${discarded} shots (${(100 - retained).toFixed(1)}% rejection rate). In noisy environments, check gates add their own decoherence channels.`,
    };
  };

  const strategySummary = getStrategySummary();

  return (
    <div className="simulation-telemetry-panel">
      {/* 1. PANEL HEADER */}
      <div className="panel-header-row">
        <div className="panel-title-group">
          <Atom size={18} className="text-cyan" />
          <h3>QUANTUM ERROR DETECTION TELEMETRY</h3>
        </div>

        <div className="header-action-group">
          {/* Tab Selector */}
          <div className="sim-panel-tabs">
            <button
              type="button"
              className={`sim-tab-pill ${activeTab === 'telemetry' ? 'active' : ''}`}
              onClick={() => setActiveTab('telemetry')}
            >
              <TrendingUp size={12} />
              <span>LIVE METRICS</span>
            </button>
            <button
              type="button"
              className={`sim-tab-pill ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <History size={12} />
              <span>ROUND HISTORY ({roundHistory.length})</span>
            </button>
          </div>

          {onOpenTutorial && (
            <button
              type="button"
              className="top-nav-btn tutorial-btn"
              onClick={onOpenTutorial}
              title="Open Quantum Error Detection Tutorial"
            >
              <HelpCircle size={12} />
              <span>TUTORIAL</span>
            </button>
          )}

          {onOpenAdvancedReport && (
            <button
              type="button"
              className="top-nav-btn advanced-report-btn"
              onClick={onOpenAdvancedReport}
              title="View full Advanced Track comparison & tradeoff report"
            >
              <Award size={12} />
              <span>ADVANCED REPORT</span>
            </button>
          )}

          {lastResult ? (
            lastResult.is_fallback ? (
              <span className="live-pill fallback-pill" style={{ borderColor: 'rgba(255, 183, 3, 0.5)', color: '#ffb703' }} title="Backend offline: simulated demo telemetry (start Python backend on port 8000 for direct Qiskit Aer simulation)">
                <span className="dot-yellow" /> DEMO / SIMULATED
              </span>
            ) : (
              <span className="live-pill" title="Computed via Qiskit Aer local simulation">
                <span className="dot-green" /> QISKIT AER
              </span>
            )
          ) : isFetching ? (
            <span className="live-pill">
              <span className="dot-yellow" /> SIMULATING…
            </span>
          ) : (
            <span className="standby-pill">READY</span>
          )}

          {onRefreshTelemetry && (
            <button
              type="button"
              className="btn-refresh-telemetry"
              onClick={onRefreshTelemetry}
              disabled={isFetching}
              title="Execute Qiskit Aer simulation to evaluate circuit fidelity"
            >
              <RotateCcw size={12} className={isFetching ? 'spin-icon' : ''} />
              <span>{isFetching ? 'SIMULATING…' : 'RUN BENCHMARK'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. ERROR BANNER */}
      {error && (
        <div className="sim-error-card">
          <div className="err-title-row">
            <AlertTriangle size={15} />
            <strong>Quantum Simulation Notice</strong>
          </div>
          <p>{error}</p>
          {onRefreshTelemetry && (
            <button type="button" className="btn-retry-sim" onClick={onRefreshTelemetry}>
              <RotateCcw size={12} /> RETRY BENCHMARK
            </button>
          )}
        </div>
      )}

      {/* 3. STANDBY & LOADING STATES */}
      {!lastResult && !isFetching && !error && (
        <div className="sim-empty-state">
          <div className="empty-sim-icon">
            <Atom size={32} />
          </div>
          <h4>Quantum Experiment Telemetry (Qiskit Aer)</h4>
          <p>
            Choose your combat actions and click <strong>RESOLVE ROUND</strong> (or click{' '}
            <strong>RUN BENCHMARK</strong>) to execute the genuine Qiskit Aer simulator with Pauli spacetime checks for {currentLevel?.boss || 'this mission'}.
          </p>
        </div>
      )}

      {isFetching && !lastResult && (
        <div className="sim-empty-state">
          <div className="spinner" />
          <h4>Computing Quantum State Simulation…</h4>
          <p>Qiskit Aer is evaluating Clifford payload layers, ancilla syndroming, and post-selection.</p>
        </div>
      )}

      {/* 4. TAB 1: LIVE EXPERIMENT TELEMETRY */}
      {lastResult && activeTab === 'telemetry' && (
        <div className="sim-data-grid">
          {/* Warning Banner for Shot Starvation or Engine Notices */}
          {lastResult.warning && (
            <div className="sim-error-card" style={{ background: 'rgba(255, 183, 3, 0.12)', borderColor: 'rgba(255, 183, 3, 0.45)', margin: '0 0 16px 0' }}>
              <div className="err-title-row" style={{ color: '#ffb703' }}>
                <AlertTriangle size={16} />
                <strong>Quantum Shot-Starvation Alert</strong>
              </div>
              <p style={{ color: '#f0f4f8', margin: '4px 0 0 0', fontSize: '13px' }}>{lastResult.warning}</p>
            </div>
          )}

          {/* Main Score Banner */}
          <div className="sim-score-card">
            <div className="score-label-col">
              <span className="sub-title">QUANTUM BENCHMARK SCORE</span>
              <div className="score-digits">
                <strong>{lastResult.score}</strong>
                <small>/ 100</small>
              </div>
            </div>
            <div className="score-verdict">
              <Award size={15} />
              <span>
                {isStarved
                  ? 'SHOT STARVATION DETECTED'
                  : lastResult.score >= 70
                  ? 'HIGH ERROR SUPPRESSION'
                  : lastResult.score >= 40
                  ? 'MODERATE SUPPRESSION'
                  : 'HIGH NOISE ATTRITION'}
              </span>
            </div>
          </div>

          {/* Key Metrics Grid - All 7 Required Advanced Track Metrics */}
          <div className="sim-kpi-quad" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
            {/* 1. Raw Baseline Fidelity */}
            <div className="kpi-cell" title="Logical state fidelity before error detection checks">
              <span className="kpi-label">RAW FIDELITY</span>
              <strong className="kpi-val text-muted">
                {(lastResult.raw_fidelity * 100).toFixed(1)}%
              </strong>
              <small>Unprotected baseline</small>
            </div>

            {/* 2. Post-selected Fidelity */}
            <div className="kpi-cell" title="Logical state fidelity after discarding faulty syndrome shots">
              <span className="kpi-label">POST-SELECTED</span>
              <strong className={`kpi-val ${isStarved ? 'text-yellow' : 'text-cyan'}`}>
                {isStarved
                  ? 'UNAVAILABLE'
                  : `${(lastResult.postselected_fidelity * 100).toFixed(1)}%`}
              </strong>
              <small>
                {isStarved
                  ? `Raw Est: ${(lastResult.raw_estimate_fidelity ? (lastResult.raw_estimate_fidelity * 100).toFixed(1) : (lastResult.raw_fidelity * 100).toFixed(1))}%`
                  : 'Syndrome filtered'}
              </small>
            </div>

            {/* 3. Retained-shot fraction */}
            <div className="kpi-cell" title="Percentage of experimental shots kept after post-selection">
              <span className="kpi-label">SHOTS RETAINED</span>
              <strong className={`kpi-val ${isStarved ? 'text-red' : 'text-green'}`}>
                {lastResult.retained_percent}%
              </strong>
              <small>{lastResult.retained_shots_across_stabilizers ?? lastResult.retained_shots} kept</small>
            </div>

            {/* 4. Discarded shots */}
            <div className="kpi-cell" title="Number of corrupted shots detected and discarded">
              <span className="kpi-label">DISCARDED SHOTS</span>
              <strong className={`kpi-val ${isStarved ? 'text-red' : 'text-yellow'}`}>
                {lastResult.discarded_shots ?? 0}
              </strong>
              <small>{isStarved ? 'All rejected (100%)' : 'Faulty syndromes'}</small>
            </div>

            {/* 5. Ancilla-qubit overhead */}
            <div className="kpi-cell" title="Number of auxiliary syndrome qubits used for error checks">
              <span className="kpi-label">ANCILLA OVERHEAD</span>
              <strong className="kpi-val text-purple">
                +{lastResult.ancilla_qubits_added ?? lastResult.checks_used ?? 0}
              </strong>
              <small>Syndrome wires</small>
            </div>

            {/* 6. Added two-qubit gates */}
            <div className="kpi-cell" title="Additional entangling gates required for spacetime checks">
              <span className="kpi-label">ADDED 2Q GATES</span>
              <strong className="kpi-val text-gold">
                +{lastResult.added_two_qubit_gates ?? 0}
              </strong>
              <small>Check couplings</small>
            </div>

            {/* 7. Added circuit depth */}
            <div className="kpi-cell" title="Additional circuit layers added by spacetime checks">
              <span className="kpi-label">ADDED DEPTH</span>
              <strong className="kpi-val text-gold">
                +{lastResult.added_circuit_depth ?? 0}
              </strong>
              <small>Circuit latency</small>
            </div>
          </div>

          {/* Strategy Summary Card */}
          {strategySummary && (
            <div className={`strategy-summary-card strat-${strategySummary.type}`}>
              <div className="strat-head">
                <Sparkles size={14} />
                <strong>{strategySummary.title}</strong>
                <span className="strat-verdict-badge">{strategySummary.verdict}</span>
              </div>
              <p className="strat-desc">{strategySummary.desc}</p>
            </div>
          )}

          {/* Fidelity vs Retained Fraction Comparison Chart */}
          <div className="sim-chart-wrap">
            <div className="chart-header-line">
              <div className="chart-title-box">
                <span>FIDELITY GAIN VS RETAINED SHOT FRACTION</span>
                <small style={{ color: '#8fa3bc', fontSize: 10, display: 'block' }}>
                  Comparing output quality against sample throughput trade-off
                </small>
              </div>
              <span className={`chart-gain-delta ${isStarved ? 'text-yellow' : ''}`}>
                {isStarved
                  ? 'Δ 0.0% (Post-selection unavailable)'
                  : `Δ ${((lastResult.postselected_fidelity - lastResult.raw_fidelity) * 100) >= 0 ? '+' : ''}${((lastResult.postselected_fidelity - lastResult.raw_fidelity) * 100).toFixed(1)}% Fidelity`}
              </span>
            </div>
            <div style={{ width: '100%', height: 130 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 8, right: 15, left: -20, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f334a" vertical={false} />
                  <XAxis dataKey="metric" stroke="#8fa3bc" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#8fa3bc" fontSize={10} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      background: '#0a1726',
                      border: '1px solid #233b54',
                      borderRadius: 6,
                      fontSize: 11,
                    }}
                    formatter={(val, name, item) => [`${val}%`, item.payload.metric]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Circuit Telemetry Strip */}
          <div className="sim-telemetry-strip">
            <div className="strip-item">
              <Cpu size={12} />
              <span>TOTAL DEPTH: <strong>{lastResult.checked_circuit_depth ?? lastResult.depth}</strong></span>
            </div>
            <div className="strip-item">
              <span>PLACEMENT: <strong>{Array.isArray(lastResult.target_qubits) ? (lastResult.target_qubits.length === 2 ? 'q0, q1' : `q${lastResult.target_qubits[0]}`) : 'All'}</strong></span>
            </div>
            <div className="strip-item">
              <span>RAW 2Q: <strong>{lastResult.raw_two_qubit_gates ?? 0}</strong></span>
            </div>
            <div className="strip-item">
              <span>CHECKED 2Q: <strong>{lastResult.checked_two_qubit_gates ?? 0}</strong></span>
            </div>
            <div className="strip-item">
              <Clock size={12} />
              <span>AER RUNTIME: <strong>{lastResult.elapsed_seconds}s</strong></span>
            </div>
          </div>

          {/* Measured Stabilizers Table */}
          {lastResult.stabilizer_telemetry && lastResult.stabilizer_telemetry.length > 0 && (
            <div className="stabilizers-sub-table">
              <div className="sub-table-title">
                MEASURED STABILIZER EXPECTATION VALUES (PAULI GENERATORS)
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>PAULI</th>
                      <th>RAW ⟨P⟩</th>
                      <th>POST-SEL ⟨P⟩</th>
                      <th>GAIN (Δ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastResult.stabilizer_telemetry.map((st, i) => (
                      <tr key={i}>
                        <td><span className="pauli-badge">{st.label}</span></td>
                        <td>{st.raw_expectation}</td>
                        <td className={st.is_starved ? 'text-yellow' : 'text-cyan'}>
                          {st.post_expectation !== null && st.post_expectation !== undefined
                            ? st.post_expectation
                            : `Unavailable (Raw: ${st.raw_expectation})`}
                        </td>
                        <td className={st.is_starved ? 'text-muted' : (st.improvement >= 0 ? 'text-green' : 'text-red')}>
                          {st.is_starved
                            ? '0.0000 (Fallback)'
                            : (st.improvement >= 0 ? `+${st.improvement}` : st.improvement)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 2: ROUND EXPERIMENT HISTORY */}
      {activeTab === 'history' && (
        <div className="sim-history-panel">
          {roundHistory.length === 0 ? (
            <div className="empty-history-box">
              <History size={24} className="text-muted" />
              <p>No round experiments recorded yet. Resolve combat rounds to compare experiments.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>ROUND</th>
                    <th>ACTIONS</th>
                    <th>CHECKS</th>
                    <th>RAW FIDELITY</th>
                    <th>POST-SEL FIDELITY</th>
                    <th>RETAINED</th>
                    <th>DISCARDED</th>
                    <th>SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  {roundHistory.map((h, idx) => {
                    const res = h.result || {};
                    const starvedRow = Boolean(res.shot_starvation || res.postselected_fidelity === null);
                    return (
                      <tr key={idx}>
                        <td><strong>R{h.round}</strong></td>
                        <td>
                          <span className="actions-badge">
                            {h.actions?.attack && '⚔️ ATTACK'}
                            {h.actions?.attack && h.actions?.defend && ' + '}
                            {h.actions?.defend && '🛡️ DEFEND'}
                          </span>
                        </td>
                        <td>{res.checks_used ?? h.checks ?? '—'}</td>
                        <td className="text-muted">
                          {res.raw_fidelity ? `${(res.raw_fidelity * 100).toFixed(1)}%` : '—'}
                        </td>
                        <td className={starvedRow ? 'text-yellow font-bold' : 'text-cyan font-bold'}>
                          {starvedRow
                            ? 'UNAVAILABLE'
                            : (res.postselected_fidelity !== null && res.postselected_fidelity !== undefined
                                ? `${(res.postselected_fidelity * 100).toFixed(1)}%`
                                : '—')}
                        </td>
                        <td className={starvedRow ? 'text-red' : 'text-green'}>
                          {res.retained_percent !== undefined ? `${res.retained_percent}%` : '—'}
                        </td>
                        <td className="text-yellow">{res.discarded_shots ?? 0}</td>
                        <td><strong>{res.score ?? '—'}</strong></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
