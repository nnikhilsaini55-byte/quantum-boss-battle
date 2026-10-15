import React from 'react';
import { Zap } from 'lucide-react';

/**
 * Animated Quantum Energy Meter (0 - 100%).
 * Shows available quantum charge, with Overcharge status when ready.
 */
export default function QuantumEnergyMeter({ charge = 100, isSimulating = false }) {
  const clampedCharge = Math.max(0, Math.min(100, charge));
  const isSupercharged = clampedCharge >= 100;

  // 10 Segments
  const totalSegments = 10;
  const filledSegments = Math.round((clampedCharge / 100) * totalSegments);

  return (
    <div className={`energy-meter-component ${isSupercharged ? 'supercharged' : ''} ${isSimulating ? 'simulating' : ''}`}>
      <div className="energy-header">
        <div className="energy-title">
          <Zap size={13} className="energy-icon" />
          <span>QUANTUM ENERGY METER</span>
        </div>
        <div className="energy-value">
          {isSupercharged ? (
            <span className="overcharge-badge">SUPERCHARGED (100%)</span>
          ) : (
            <span>{clampedCharge}% CHARGE</span>
          )}
        </div>
      </div>

      <div className="energy-track-segments">
        {Array.from({ length: totalSegments }).map((_, idx) => {
          const isFilled = idx < filledSegments;
          return (
            <div
              key={idx}
              className={`energy-segment ${isFilled ? 'filled' : ''} ${isSupercharged ? 'overdrive' : ''}`}
            />
          );
        })}
      </div>

      <div className="energy-subtext">
        {isSupercharged
          ? '⚡ Quantum Core primed: Maximum state fidelity & critical strike empowered!'
          : 'Defend or Attack to maintain Quantum Core stabilizer coherence.'}
      </div>
    </div>
  );
}
