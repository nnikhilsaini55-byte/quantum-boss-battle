import React from 'react';

/**
 * Animated SVG Player Character: The Quantum Warrior
 * Supports states: 'idle' | 'attack' | 'defend' | 'simulate' | 'hit' | 'defeat' | 'victory'
 */
export default function PlayerCharacter({ state = 'idle', energyLevel = 100, isShielded = false }) {
  return (
    <div className={`character-container player-character state-${state} ${isShielded ? 'has-shield' : ''}`}>
      {/* Dynamic Shield Bubble when Defending */}
      {(state === 'defend' || isShielded) && (
        <div className="player-shield-aura">
          <svg className="shield-hex-svg" viewBox="0 0 200 200">
            <polygon
              points="100,10 180,50 180,150 100,190 20,150 20,50"
              fill="rgba(0, 245, 212, 0.08)"
              stroke="#00f5d4"
              strokeWidth="3"
              strokeDasharray="8 4"
              className="shield-hex-pulse"
            />
            <polygon
              points="100,25 165,58 165,142 100,175 35,142 35,58"
              fill="none"
              stroke="#7000ff"
              strokeWidth="1.5"
              strokeOpacity="0.7"
              className="shield-hex-inner"
            />
            {/* Pauli Glyphs on Shield */}
            <text x="94" y="24" fill="#00f5d4" fontSize="12" fontFamily="monospace" fontWeight="bold">Z</text>
            <text x="168" y="105" fill="#00f5d4" fontSize="12" fontFamily="monospace" fontWeight="bold">X</text>
            <text x="94" y="188" fill="#00f5d4" fontSize="12" fontFamily="monospace" fontWeight="bold">H</text>
            <text x="22" y="105" fill="#00f5d4" fontSize="12" fontFamily="monospace" fontWeight="bold">Y</text>
          </svg>
        </div>
      )}

      {/* Quantum Simulation Energy Focus Aura */}
      {state === 'simulate' && (
        <div className="player-simulate-rings">
          <div className="sim-ring ring-1" />
          <div className="sim-ring ring-2" />
          <div className="sim-ring ring-3" />
        </div>
      )}

      {/* Main SVG Quantum Warrior */}
      <svg
        className="warrior-svg"
        viewBox="0 0 160 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3450" />
            <stop offset="50%" stopColor="#0d1b2d" />
            <stop offset="100%" stopColor="#06101c" />
          </linearGradient>

          <linearGradient id="cyanNeon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7effea" />
            <stop offset="100%" stopColor="#00f5d4" />
          </linearGradient>

          <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#00f5d4" />
            <stop offset="85%" stopColor="#7000ff" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>

          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shadow base */}
        <ellipse cx="80" cy="208" rx="45" ry="8" fill="rgba(0, 245, 212, 0.2)" filter="url(#neonGlow)" />

        {/* Back Cape / Energy Mantle */}
        <path
          d="M62 95 L40 185 Q65 195 80 188 Q95 195 120 185 L98 95 Z"
          fill="rgba(11, 26, 44, 0.85)"
          stroke="#00f5d4"
          strokeWidth="1"
          strokeOpacity="0.4"
          className="warrior-cape"
        />

        {/* Legs / Greaves */}
        <g className="warrior-legs">
          {/* Left Leg */}
          <path d="M60 145 L54 185 L48 205 L66 205 L70 185 L72 145 Z" fill="url(#armorGrad)" stroke="#1f4469" strokeWidth="1.5" />
          <path d="M54 165 L68 165" stroke="#00f5d4" strokeWidth="2" filter="url(#neonGlow)" />
          {/* Right Leg */}
          <path d="M88 145 L90 185 L94 205 L112 205 L106 185 L100 145 Z" fill="url(#armorGrad)" stroke="#1f4469" strokeWidth="1.5" />
          <path d="M92 165 L106 165" stroke="#00f5d4" strokeWidth="2" filter="url(#neonGlow)" />
        </g>

        {/* Torso / Cybernetic Cuirass */}
        <g className="warrior-torso">
          <path
            d="M58 85 L102 85 L96 148 L64 148 Z"
            fill="url(#armorGrad)"
            stroke="#26507c"
            strokeWidth="2"
          />
          {/* Core Conduit Lines */}
          <path d="M65 92 L75 110 L75 142" stroke="#00f5d4" strokeWidth="1.5" strokeOpacity="0.8" />
          <path d="M95 92 L85 110 L85 142" stroke="#00f5d4" strokeWidth="1.5" strokeOpacity="0.8" />

          {/* Quantum Stabilizer Chest Core */}
          <circle cx="80" cy="115" r="14" fill="#061423" stroke="#00f5d4" strokeWidth="2" />
          <circle cx="80" cy="115" r="10" fill="#00f5d4" fillOpacity="0.25" className="core-pulse-circle" />
          <circle cx="80" cy="115" r="5" fill="#ffffff" filter="url(#coreGlow)" />
          {/* Rotating Stabilizer Pauli Cross */}
          <g className="pauli-core-cross">
            <line x1="80" y1="104" x2="80" y2="126" stroke="#00f5d4" strokeWidth="1.5" />
            <line x1="69" y1="115" x2="91" y2="115" stroke="#00f5d4" strokeWidth="1.5" />
          </g>
        </g>

        {/* Helmet / Visor */}
        <g className="warrior-head">
          <path
            d="M66 52 L80 40 L94 52 L96 75 L80 84 L64 75 Z"
            fill="url(#armorGrad)"
            stroke="#2d5e90"
            strokeWidth="2"
          />
          {/* Crest */}
          <path d="M78 35 L82 35 L82 46 L78 46 Z" fill="#00f5d4" filter="url(#neonGlow)" />
          {/* Glowing Visor */}
          <path
            d="M69 60 L91 60 L87 69 L73 69 Z"
            fill="url(#cyanNeon)"
            filter="url(#neonGlow)"
            className="warrior-visor"
          />
        </g>

        {/* Left Arm & Syndrome Gauntlet */}
        <g className="warrior-left-arm">
          <path d="M58 88 L40 105 L44 135 L54 135 L52 110 L62 95 Z" fill="url(#armorGrad)" stroke="#1e4063" strokeWidth="1.5" />
          {/* Gauntlet Emitter */}
          <rect x="38" y="120" width="16" height="15" rx="3" fill="#0a192b" stroke="#00f5d4" strokeWidth="1.5" />
          <circle cx="46" cy="127" r="4" fill="#00f5d4" filter="url(#neonGlow)" />
        </g>

        {/* Right Arm & Quantum Phase Blade */}
        <g className="warrior-right-arm">
          <path d="M102 88 L120 105 L118 135 L108 135 L110 110 L98 95 Z" fill="url(#armorGrad)" stroke="#1e4063" strokeWidth="1.5" />
          {/* Hand Guard */}
          <rect x="110" y="124" width="14" height="14" rx="2" fill="#0e2338" stroke="#00f5d4" strokeWidth="1.5" />

          {/* The Quantum Blade */}
          <g className="warrior-blade">
            {/* Blade Hilt */}
            <rect x="114" y="138" width="6" height="18" rx="1" fill="#1b2a3a" stroke="#486581" strokeWidth="1" />
            <circle cx="117" cy="158" r="4" fill="#00f5d4" filter="url(#neonGlow)" />

            {/* Glowing Blade Emitter */}
            <path
              d="M117 122 L112 40 Q117 10 122 40 L117 122 Z"
              fill="url(#bladeGrad)"
              filter="url(#neonGlow)"
              className="blade-glow"
            />
            {/* White-Hot Core of Blade */}
            <path
              d="M117 115 L115 50 Q117 25 119 50 L117 115 Z"
              fill="#ffffff"
              opacity="0.9"
            />
            {/* Orbiting Photon Particles */}
            <circle cx="112" cy="70" r="2" fill="#00f5d4" className="blade-sparkle-1" />
            <circle cx="123" cy="45" r="2" fill="#ffffff" className="blade-sparkle-2" />
            <circle cx="114" cy="30" r="1.5" fill="#7000ff" className="blade-sparkle-3" />
          </g>
        </g>

        {/* Pauldron / Shoulder Guards */}
        <path d="M52 82 L64 78 L68 94 L50 94 Z" fill="url(#armorGrad)" stroke="#00f5d4" strokeWidth="1.5" />
        <path d="M108 82 L96 78 L92 94 L110 94 Z" fill="url(#armorGrad)" stroke="#00f5d4" strokeWidth="1.5" />
      </svg>

      {/* Floating State Indicators */}
      <div className="character-label">
        <span className="char-badge">WARRIOR</span>
        <span className="char-name">QUANTUM CORE</span>
      </div>
    </div>
  );
}
