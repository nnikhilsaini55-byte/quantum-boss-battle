from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from ai_engine import (
    generate_adaptive_next_level,
    generate_tactical_advice,
    get_quantum_technologies_glossary,
)
from quantum_engine import (
    evaluate_quantum_circuit,
    get_circuit_telemetry,
    run_advanced_tradeoff_study,
    run_battle,
)

app = FastAPI(title="Quantum Boss Battle API", version="0.3.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BattleRequest(BaseModel):
    level: int = Field(default=1, ge=1)
    checks: int = Field(default=1, ge=0, le=2)
    shots: int = Field(default=500, ge=100, le=10000)
    num_t_gates: int = Field(default=0, ge=0, le=8)
    target_qubits: list[int] | None = None
    custom_depth: int | None = None
    custom_gate_noise: float | None = None
    custom_readout_noise: float | None = None
    level_name: str | None = None

class BenchmarkRequest(BaseModel):
    depth: int = Field(default=2, ge=1, le=14)
    num_t_gates: int = Field(default=0, ge=0, le=8)
    checks: int = Field(default=1, ge=0, le=2)
    target_qubits: list[int] | None = None
    shots: int = Field(default=500, ge=100, le=5000)
    gate_noise: float = Field(default=0.012, ge=0.0, le=0.1)
    readout_noise: float = Field(default=0.008, ge=0.0, le=0.1)
    organizer_backend_name: str | None = None

class AdvisorRequest(BaseModel):
    level: int = 1
    player_hp: int = 100
    boss_hp: int = 100
    round: int = 1
    checks: int = 1
    shots: int = 500
    last_fidelity: float | None = None
    last_retained: float | None = None
    recent_actions: list[str] = Field(default_factory=list)

class LevelGenRequest(BaseModel):
    previous_level: int = 1
    average_fidelity: float = 0.95
    shots_retained: float = 90.0
    rounds_taken: int = 3
    core_hp_remaining: int = 70
    checks_used: int = 1

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "app": "Quantum Boss Battle",
        "ai_copilot": "online",
        "procedural_engine": "ready",
        "advanced_track": "active",
    }

@app.post("/api/battle")
def battle(request: BattleRequest):
    try:
        return run_battle(
            level=request.level,
            checks=request.checks,
            shots=request.shots,
            num_t_gates=request.num_t_gates,
            target_qubits=request.target_qubits,
            custom_depth=request.custom_depth,
            custom_gate_noise=request.custom_gate_noise,
            custom_readout_noise=request.custom_readout_noise,
            level_name=request.level_name,
        )
    except Exception as exc:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Simulation failed: {type(exc).__name__}: {exc}") from exc

@app.get("/api/quantum/advanced_evaluation")
def get_advanced_evaluation(force_recompute: bool = False):
    """Return the authoritative Qiskit Fall Fest 2026 Advanced Track evaluation.

    Includes comparison across T-gate counts, circuit depths, check counts, and placements,
    measured Pareto tradeoff analysis, and requirement compliance status.
    """
    try:
        return run_advanced_tradeoff_study(force_recompute=force_recompute)
    except Exception as exc:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Advanced evaluation failed: {exc}") from exc

@app.post("/api/quantum/benchmark")
def run_benchmark(request: BenchmarkRequest):
    """Execute a parameterized benchmark measuring all 7 Advanced Track metrics."""
    try:
        return evaluate_quantum_circuit(
            depth=request.depth,
            num_t_gates=request.num_t_gates,
            checks=request.checks,
            target_qubits=request.target_qubits,
            shots=request.shots,
            gate_noise=request.gate_noise,
            readout_noise=request.readout_noise,
            organizer_backend_name=request.organizer_backend_name,
        )
    except Exception as exc:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Benchmark execution failed: {exc}") from exc

@app.post("/api/ai/advisor")
def ai_advisor(request: AdvisorRequest):
    try:
        return generate_tactical_advice(
            level=request.level,
            player_hp=request.player_hp,
            boss_hp=request.boss_hp,
            round_num=request.round,
            checks=request.checks,
            shots=request.shots,
            last_fidelity=request.last_fidelity,
            last_retained=request.last_retained,
            recent_actions=request.recent_actions,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"AI Advisor failed: {exc}") from exc

@app.post("/api/ai/generate_level")
def ai_generate_level(request: LevelGenRequest):
    try:
        return generate_adaptive_next_level(
            previous_level=request.previous_level,
            average_fidelity=request.average_fidelity,
            shots_retained=request.shots_retained,
            rounds_taken=request.rounds_taken,
            core_hp_remaining=request.core_hp_remaining,
            checks_used=request.checks_used,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"AI Level Generation failed: {exc}") from exc

@app.get("/api/quantum/circuit")
def get_circuit(depth: int = 2, num_t_gates: int = 0):
    try:
        safe_depth = max(1, min(14, depth))
        safe_t = max(0, min(8, num_t_gates))
        return get_circuit_telemetry(depth=safe_depth, num_t_gates=safe_t)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Circuit inspection failed: {exc}") from exc

@app.get("/api/quantum/technologies")
def get_technologies():
    return get_quantum_technologies_glossary()
