import React from 'react';

/**
 * Animated SVG Boss Character with 3 distinct bosses:
 * 1. THE GLITCHLING (Level 1, Easy) - Digital glitch entity with pixel disintegration & chromatic aberration
 * 2. THE NOISE WRAITH (Level 2, Medium) - Ethereal phantom with undulating violet/magenta tendrils & distortion halo
 * 3. THE FIDELITY TITAN (Level 3, Hard) - Colossal armored mecha-titan with golden arc reactor & crackling lightning
 *
 * States: 'idle' | 'attack' | 'defend' | 'hit' | 'defeat'
 */
export default function BossCharacter({
  bossType = 'THE GLITCHLING',
  state = 'idle',
  levelId = 1,
  attackName = 'Glitch Pulse',
}) {
  const normName = (bossType || '').toUpperCase();

  const isGlitchling = normName.includes('GLITCH') || levelId === 1;
  const isNoiseWraith = (normName.includes('WRAITH') || normName.includes('NOISE')) && !normName.includes('TITAN') && levelId === 2;
  const isFidelityTitan = normName.includes('TITAN') || levelId >= 3;

  return (
    <div className={`character-container boss-character boss-lvl-${levelId} state-${state}`}>
      {/* Glitchling Visuals */}
      {isGlitchling && <GlitchlingSVG state={state} />}

      {/* Noise Wraith Visuals */}
      {isNoiseWraith && <NoiseWraithSVG state={state} />}

      {/* Fidelity Titan Visuals */}
      {isFidelityTitan && !isGlitchling && !isNoiseWraith && <FidelityTitanSVG state={state} />}

      {/* Fallback to Glitchling if unexpected name */}
      {!isGlitchling && !isNoiseWraith && !isFidelityTitan && <GlitchlingSVG state={state} />}

      {/* Floating State Indicators */}
      <div className="character-label boss-label">
        <span className="char-badge boss-badge">LEVEL {levelId < 10 ? `0${levelId}` : levelId} BOSS</span>
        <span className="char-name">{bossType}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. THE GLITCHLING (Level 1)
// ---------------------------------------------------------------------------
function GlitchlingSVG({ state }) {
  return (
    <div className={`boss-svg-wrap glitchling-wrap state-${state}`}>
      {/* Floating Glitch Pixels */}
      <div className="glitch-particles">
        <span className="px-dot px-1" />
        <span className="px-dot px-2" />
        <span className="px-dot px-3" />
        <span className="px-dot px-4" />
        <span className="px-dot px-5" />
      </div>

      <svg
        className="boss-svg glitchling-svg"
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="glitchGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f5d4" />
            <stop offset="50%" stopColor="#052e36" />
            <stop offset="100%" stopColor="#02141a" />
          </linearGradient>

          <linearGradient id="glitchNeon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#55e6c1" />
            <stop offset="50%" stopColor="#00f5d4" />
            <stop offset="100%" stopColor="#ff007f" />
          </linearGradient>

          <filter id="glitchGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Pulsing Shadow */}
        <ellipse cx="100" cy="205" rx="55" ry="10" fill="rgba(0, 245, 212, 0.25)" filter="url(#glitchGlow)" />

        {/* Orbiting Matrix Wireframe Cube */}
        <g className="glitch-wireframe">
          <polygon
            points="100,45 150,75 150,135 100,165 50,135 50,75"
            fill="none"
            stroke="#00f5d4"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.8"
          />
          <line x1="100" y1="45" x2="100" y2="105" stroke="#00f5d4" strokeWidth="1" opacity="0.6" />
          <line x1="150" y1="75" x2="100" y2="105" stroke="#00f5d4" strokeWidth="1" opacity="0.6" />
          <line x1="50" y1="75" x2="100" y2="105" stroke="#00f5d4" strokeWidth="1" opacity="0.6" />
          <line x1="100" y1="165" x2="100" y2="105" stroke="#ff007f" strokeWidth="1" opacity="0.5" />
        </g>

        {/* Main Diamond Glitch Core */}
        <g className="glitch-core">
          <polygon
            points="100,60 142,105 100,150 58,105"
            fill="url(#glitchGrad1)"
            stroke="#55e6c1"
            strokeWidth="2.5"
            filter="url(#glitchGlow)"
          />

          {/* Inner Pixel Matrix Grid */}
          <rect x="80" y="88" width="10" height="10" fill="#00f5d4" opacity="0.9" />
          <rect x="94" y="88" width="10" height="10" fill="#ff007f" opacity="0.85" />
          <rect x="108" y="88" width="10" height="10" fill="#00f5d4" opacity="0.9" />

          <rect x="87" y="102" width="10" height="10" fill="#ffffff" opacity="0.95" />
          <rect x="101" y="102" width="10" height="10" fill="#55e6c1" opacity="0.9" />

          <rect x="94" y="116" width="10" height="10" fill="#00f5d4" opacity="0.9" />

          {/* Menacing Digital Optics (Glitch Eyes) */}
          <g className="glitch-eyes">
            <polygon points="76,82 92,86 78,92" fill="#ff007f" filter="url(#glitchGlow)" />
            <polygon points="124,82 108,86 122,92" fill="#ff007f" filter="url(#glitchGlow)" />
            <circle cx="85" cy="87" r="2.5" fill="#ffffff" />
            <circle cx="115" cy="87" r="2.5" fill="#ffffff" />
          </g>
        </g>

        {/* Floating Fractured Wing Fragments */}
        <g className="glitch-wings">
          {/* Left Wing Fragments */}
          <rect x="30" y="65" width="14" height="14" fill="#052e36" stroke="#00f5d4" strokeWidth="1.5" className="frag-1" />
          <rect x="22" y="85" width="16" height="10" fill="#ff007f" opacity="0.8" className="frag-2" />
          <rect x="36" y="105" width="12" height="18" fill="#02141a" stroke="#55e6c1" strokeWidth="1.5" className="frag-3" />
          <rect x="25" y="130" width="18" height="8" fill="#00f5d4" opacity="0.75" className="frag-4" />

          {/* Right Wing Fragments */}
          <rect x="156" y="65" width="14" height="14" fill="#052e36" stroke="#00f5d4" strokeWidth="1.5" className="frag-5" />
          <rect x="162" y="85" width="16" height="10" fill="#ff007f" opacity="0.8" className="frag-6" />
          <rect x="152" y="105" width="12" height="18" fill="#02141a" stroke="#55e6c1" strokeWidth="1.5" className="frag-7" />
          <rect x="157" y="130" width="18" height="8" fill="#00f5d4" opacity="0.75" className="frag-8" />
        </g>

        {/* Binary Stream Tail / Tendrils */}
        <text x="82" y="172" fill="#00f5d4" fontSize="10" fontFamily="monospace" opacity="0.8">0 1 0 1</text>
        <text x="75" y="186" fill="#ff007f" fontSize="10" fontFamily="monospace" opacity="0.7">1 1 0 0 1</text>
        <text x="86" y="200" fill="#55e6c1" fontSize="9" fontFamily="monospace" opacity="0.6">0 1 0</text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. THE NOISE WRAITH (Level 2)
// ---------------------------------------------------------------------------
function NoiseWraithSVG({ state }) {
  return (
    <div className={`boss-svg-wrap wraith-wrap state-${state}`}>
      {/* Ghostly purple aura rings */}
      <div className="wraith-distortion-field" />

      <svg
        className="boss-svg wraith-svg"
        viewBox="0 0 220 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wraithGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8338ec" />
            <stop offset="50%" stopColor="#3a0ca3" />
            <stop offset="100%" stopColor="#10002b" />
          </linearGradient>

          <linearGradient id="purpleNeon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff007f" />
            <stop offset="100%" stopColor="#7000ff" />
          </linearGradient>

          <filter id="wraithGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ground Dark Void Shadow */}
        <ellipse cx="110" cy="214" rx="60" ry="10" fill="rgba(131, 56, 236, 0.3)" filter="url(#wraithGlow)" />

        {/* Ghostly Flowing Shroud / Tendrils */}
        <g className="wraith-shroud">
          {/* Back tendrils */}
          <path
            d="M75 100 C50 130, 40 180, 55 210 C70 190, 85 160, 95 120 Z"
            fill="#3a0ca3"
            opacity="0.75"
            className="tendril-left-back"
          />
          <path
            d="M145 100 C170 130, 180 180, 165 210 C150 190, 135 160, 125 120 Z"
            fill="#3a0ca3"
            opacity="0.75"
            className="tendril-right-back"
          />

          {/* Central Spectral Body */}
          <path
            d="M85 65 C60 85, 60 140, 75 205 C90 185, 105 195, 110 215 C115 195, 130 185, 145 205 C160 140, 160 85, 135 65 Z"
            fill="url(#wraithGrad1)"
            stroke="#b5179e"
            strokeWidth="2"
            filter="url(#wraithGlow)"
          />

          {/* Front Undulating Tendrils */}
          <path
            d="M90 120 C80 150, 65 175, 80 200 C88 175, 96 150, 100 125 Z"
            fill="#7209b7"
            className="tendril-front-1"
          />
          <path
            d="M130 120 C140 150, 155 175, 140 200 C132 175, 124 150, 120 125 Z"
            fill="#7209b7"
            className="tendril-front-2"
          />
        </g>

        {/* Decoherence Singularity at Chest */}
        <g className="wraith-core">
          <circle cx="110" cy="115" r="18" fill="#10002b" stroke="#ff007f" strokeWidth="2" />
          <circle cx="110" cy="115" r="12" fill="#7209b7" opacity="0.6" className="singularity-pulse" />
          <circle cx="110" cy="115" r="6" fill="#ffffff" filter="url(#wraithGlow)" />

          {/* Orbiting Phase Noise Ellipses */}
          <ellipse
            cx="110"
            cy="115"
            rx="26"
            ry="9"
            fill="none"
            stroke="#ff007f"
            strokeWidth="1.5"
            transform="rotate(25 110 115)"
            className="core-orbit-1"
          />
          <ellipse
            cx="110"
            cy="115"
            rx="26"
            ry="9"
            fill="none"
            stroke="#7000ff"
            strokeWidth="1.5"
            transform="rotate(-35 110 115)"
            className="core-orbit-2"
          />
        </g>

        {/* Phantom Cowl & Eyes */}
        <g className="wraith-cowl">
          <path
            d="M88 45 C95 28, 125 28, 132 45 C142 62, 135 85, 110 88 C85 85, 78 62, 88 45 Z"
            fill="#10002b"
            stroke="#ff007f"
            strokeWidth="1.5"
          />
          {/* Glowing Violet Slit Eyes */}
          <path d="M96 56 Q103 54 105 60 Q101 62 96 56 Z" fill="#ff007f" filter="url(#wraithGlow)" />
          <path d="M124 56 Q117 54 115 60 Q119 62 124 56 Z" fill="#ff007f" filter="url(#wraithGlow)" />
          <circle cx="102" cy="57" r="1.5" fill="#ffffff" />
          <circle cx="118" cy="57" r="1.5" fill="#ffffff" />
        </g>

        {/* Floating Dark Matter Runes */}
        <text x="52" y="70" fill="#b5179e" fontSize="12" fontFamily="serif" opacity="0.8">Ψ</text>
        <text x="160" y="70" fill="#b5179e" fontSize="12" fontFamily="serif" opacity="0.8">†</text>
        <text x="45" y="140" fill="#ff007f" fontSize="11" fontFamily="sans-serif" opacity="0.7">⊗</text>
        <text x="166" y="140" fill="#ff007f" fontSize="11" fontFamily="sans-serif" opacity="0.7">ℏ</text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. THE FIDELITY TITAN (Level 3)
// ---------------------------------------------------------------------------
function FidelityTitanSVG({ state }) {
  return (
    <div className={`boss-svg-wrap titan-wrap state-${state}`}>
      {/* Crackling electric field */}
      <div className="titan-electric-sparks" />

      <svg
        className="boss-svg titan-svg"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="titanArmor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3d2a10" />
            <stop offset="40%" stopColor="#1c160e" />
            <stop offset="100%" stopColor="#090704" />
          </linearGradient>

          <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffe600" />
            <stop offset="50%" stopColor="#ffb703" />
            <stop offset="100%" stopColor="#fb8500" />
          </linearGradient>

          <linearGradient id="reactorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#ffe600" />
            <stop offset="100%" stopColor="#ff0055" />
          </linearGradient>

          <filter id="titanGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Heavy Ground Shadow */}
        <ellipse cx="120" cy="225" rx="80" ry="12" fill="rgba(255, 183, 3, 0.3)" filter="url(#titanGlow)" />

        {/* Massive Hydraulic Legs */}
        <g className="titan-legs">
          {/* Left Leg */}
          <path d="M70 145 L50 220 L86 220 L96 150 Z" fill="url(#titanArmor)" stroke="#ffb703" strokeWidth="2" />
          <rect x="52" y="180" width="28" height="8" rx="2" fill="#ffb703" />
          {/* Right Leg */}
          <path d="M170 145 L190 220 L154 220 L144 150 Z" fill="url(#titanArmor)" stroke="#ffb703" strokeWidth="2" />
          <rect x="160" y="180" width="28" height="8" rx="2" fill="#ffb703" />
        </g>

        {/* Massive Hydraulic Arms */}
        <g className="titan-arms">
          {/* Left Arm & Power Fist */}
          <path d="M55 75 L25 110 L30 165 L58 165 L52 115 L70 85 Z" fill="url(#titanArmor)" stroke="#ffb703" strokeWidth="2" />
          {/* Knuckle energy emitter */}
          <rect x="26" y="145" width="30" height="20" rx="4" fill="#150f08" stroke="#ffb703" strokeWidth="2" />
          <circle cx="36" cy="155" r="4" fill="#ffe600" filter="url(#titanGlow)" />
          <circle cx="46" cy="155" r="4" fill="#ffe600" filter="url(#titanGlow)" />

          {/* Right Arm & Power Fist */}
          <path d="M185 75 L215 110 L210 165 L182 165 L188 115 L170 85 Z" fill="url(#titanArmor)" stroke="#ffb703" strokeWidth="2" />
          {/* Knuckle energy emitter */}
          <rect x="184" y="145" width="30" height="20" rx="4" fill="#150f08" stroke="#ffb703" strokeWidth="2" />
          <circle cx="194" cy="155" r="4" fill="#ffe600" filter="url(#titanGlow)" />
          <circle cx="204" cy="155" r="4" fill="#ffe600" filter="url(#titanGlow)" />
        </g>

        {/* Colossal Chassis / Torso */}
        <g className="titan-torso">
          <polygon
            points="65,65 175,65 155,160 85,160"
            fill="url(#titanArmor)"
            stroke="#ffb703"
            strokeWidth="2.5"
          />

          {/* Heavy Armor Plates */}
          <polygon points="75,72 110,72 105,100 78,100" fill="url(#goldPlate)" />
          <polygon points="165,72 130,72 135,100 162,100" fill="url(#goldPlate)" />

          {/* Shoulder Exhaust Vents */}
          <rect x="50" y="55" width="22" height="15" rx="3" fill="#ffb703" stroke="#ff0055" strokeWidth="1" />
          <rect x="168" y="55" width="22" height="15" rx="3" fill="#ffb703" stroke="#ff0055" strokeWidth="1" />

          {/* Quantum Fusion Reactor (Heart) */}
          <g className="titan-reactor">
            <circle cx="120" cy="115" r="24" fill="#080603" stroke="#ffb703" strokeWidth="3" />
            <circle cx="120" cy="115" r="17" fill="url(#reactorGlow)" filter="url(#titanGlow)" className="reactor-core-blast" />
            <circle cx="120" cy="115" r="9" fill="#ffffff" />

            {/* Rotating Magnetic Stabilizer Ring */}
            <circle
              cx="120"
              cy="115"
              r="20"
              fill="none"
              stroke="#ff0055"
              strokeWidth="2"
              strokeDasharray="14 10"
              className="reactor-gyro"
            />
          </g>
        </g>

        {/* Armored Titan Head & Crown */}
        <g className="titan-head">
          <polygon
            points="100,28 120,15 140,28 142,55 120,62 98,55"
            fill="url(#titanArmor)"
            stroke="#ffb703"
            strokeWidth="2"
          />
          {/* Crown Spikes */}
          <polygon points="110,18 120,5 130,18" fill="url(#goldPlate)" />
          <polygon points="96,28 90,16 102,24" fill="url(#goldPlate)" />
          <polygon points="144,28 150,16 138,24" fill="url(#goldPlate)" />

          {/* Fiery Eye Visor */}
          <rect x="106" y="38" width="28" height="8" rx="2" fill="#ff0055" filter="url(#titanGlow)" />
          <rect x="114" y="40" width="12" height="4" rx="1" fill="#ffffff" />
        </g>

        {/* Electric Arc Overlays */}
        <path d="M58 60 Q80 40 100 50" stroke="#ffe600" strokeWidth="1.5" className="arc-1" />
        <path d="M140 50 Q160 40 182 60" stroke="#ffe600" strokeWidth="1.5" className="arc-2" />
        <path d="M95 145 Q120 160 145 145" stroke="#ff0055" strokeWidth="1.5" className="arc-3" />
      </svg>
    </div>
  );
}
