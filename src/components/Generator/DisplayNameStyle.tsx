'use client';

import { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';

interface DisplayNameStyleProps {
  font: string;
  effect: string;
  color: string;
  gradientStart?: string;
  gradientEnd?: string;
  onChange: (key: string, value: string) => void;
}

const fonts = [
  { value: 'gg-sans', label: 'Gg Sans' },
  { value: 'tempo', label: 'Tempo' },
  { value: 'sakura', label: 'Sakura' },
  { value: 'jellybean', label: 'Jellybean' },
  { value: 'modern', label: 'Modern' },
  { value: 'medieval', label: 'Medieval' },
  { value: '8bit', label: '8Bit' },
  { value: 'vampyre', label: 'Vampyre' },
];

const effects = [
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'neon', label: 'Neon' },
  { value: 'toon', label: 'Toon' },
  { value: 'pop', label: 'Pop' },
];

const presetColors = [
  '#FF6B9D', '#FFB3D9', '#00D4AA', '#7ED321', '#4A90E2', '#9013FE', '#FF1493', '#FFD700',
  '#00CED1', '#228B22', '#1E90FF', '#8B008B', '#FF4500', '#FF8C00'
];

// Helper function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper function to generate color variants (matches ProfileCard logic exactly)
function generateColorVariants(baseColor: string) {
  // Convert hex to RGB if needed
  let r = 255, g = 255, b = 255;
  if (baseColor.startsWith('#')) {
    const hex = baseColor.slice(1);
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else if (baseColor.startsWith('rgb')) {
    const match = baseColor.match(/\d+/g);
    if (match) {
      r = parseInt(match[0]);
      g = parseInt(match[1]);
      b = parseInt(match[2]);
    }
  }
  
  // Generate lighter and darker variants (matches ProfileCard)
  const lighten = (amount: number) => {
    return `rgb(${Math.min(255, r + amount)}, ${Math.min(255, g + amount)}, ${Math.min(255, b + amount)})`;
  };
  const darken = (amount: number) => {
    return `rgb(${Math.max(0, r - amount)}, ${Math.max(0, g - amount)}, ${Math.max(0, b - amount)})`;
  };
  
  return {
    main: baseColor.startsWith('#') ? baseColor : `rgb(${r}, ${g}, ${b})`,
    light1: lighten(40),
    light2: lighten(80),
    dark1: darken(60),
    dark2: darken(120),
  };
}

// Helper function to generate gradient for effects
function generateGradientBackground(startColor: string, endColor: string) {
  return `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`;
}

// Helper function to generate toon gradient (matches ProfileCard logic)
function generateToonGradient(colorVariants: ReturnType<typeof generateColorVariants>) {
  const toRgb = (color: string): string => {
    if (color.startsWith('rgb')) return color;
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return color;
  };
  const white = 'rgb(255, 255, 255)';
  const mainRgb = toRgb(colorVariants.main);
  const light1Rgb = toRgb(colorVariants.light1);
  const light2Rgb = toRgb(colorVariants.light2);
  // Vertical gradient (no angle = top to bottom) - matches ProfileCard
  return `linear-gradient(${white} 0px, ${light2Rgb} 8%, ${light1Rgb} 15%, ${mainRgb} 25%, ${light2Rgb} 45%, ${mainRgb} 55%, ${white} 75%, ${light2Rgb} 83%, ${light1Rgb} 90%, ${mainRgb} 100%)`;
}

// Helper function to generate pop gradient (matches ProfileCard logic)
function generatePopGradient(colorVariants: ReturnType<typeof generateColorVariants>) {
  const toRgb = (color: string): string => {
    if (color.startsWith('rgb')) return color;
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return color;
  };
  const mainRgb = toRgb(colorVariants.main);
  const dark1Rgb = toRgb(colorVariants.dark1);
  const dark2Rgb = toRgb(colorVariants.dark2);
  // Gradient for shadow effect: main color -> darker shades
  return `linear-gradient(${mainRgb} 0%, ${dark1Rgb} 50%, ${dark2Rgb} 100%)`;
}

// Helper function to generate neon glow gradient (matches ProfileCard logic)
function generateNeonGlowGradient(colorVariants: ReturnType<typeof generateColorVariants>) {
  const toRgb = (color: string): string => {
    if (color.startsWith('rgb')) return color;
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return color;
  };
  const mainRgb = toRgb(colorVariants.main);
  const light1Rgb = toRgb(colorVariants.light1);
  const light2Rgb = toRgb(colorVariants.light2);
  // Gradient for glow effect: main color -> lighter shades
  return `linear-gradient(${mainRgb} 0%, ${light1Rgb} 50%, ${light2Rgb} 100%)`;
}

export function DisplayNameStyle({ font, effect, color, gradientStart = '#FF6B9D', gradientEnd = '#FFB3D9', onChange }: DisplayNameStyleProps) {
  const [hoveredFont, setHoveredFont] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);

  const handleFontMouseEnter = (fontValue: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setHoveredFont(fontValue);
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });
  };

  const handleFontMouseLeave = () => {
    setHoveredFont(null);
    setTooltipPosition(null);
  };

  // Get the color to use for effects (use gradient start for gradient effect, otherwise use color)
  const effectColor = effect === 'gradient' ? gradientStart : (color.startsWith('linear-gradient') ? '#FF6B9D' : color);
  const colorVariants = generateColorVariants(effectColor);

  return (
    <div className="col-span-2 space-y-1.5">
      {/* Choose Font */}
      <div className="space-y-0.5 relative">
        <Label className="text-xs md:text-[10px] text-zinc-500">Choose Font</Label>
        <div className="grid grid-cols-4 gap-1">
          {fonts.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange('displayNameFont', f.value)}
              onMouseEnter={(e) => handleFontMouseEnter(f.value, e)}
              onMouseLeave={handleFontMouseLeave}
              className={`h-10 md:h-8 rounded-md border transition-all text-xs md:text-[10px] font-bold cursor-pointer relative min-w-[44px] ${
                font === f.value
                  ? 'border-[#5865F2] bg-[#5865F2]/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              aria-label={`Select ${f.label} font`}
              aria-pressed={font === f.value}
              style={{
                fontFamily: f.value === '8bit' ? '"Pixelify Sans", monospace' : 
                           f.value === 'tempo' ? '"Neo Castel", serif' :
                           f.value === 'sakura' ? '"Cherry Bomb One", sans-serif' :
                           f.value === 'jellybean' ? 'Chicle, sans-serif' :
                           f.value === 'modern' ? '"Museo Moderno", sans-serif' :
                           f.value === 'medieval' ? '"Zilla Slab", serif' :
                           f.value === 'vampyre' ? 'Sinistre, serif' :
                           '"gg sans", sans-serif',
              }}
            >
              Gg
            </button>
          ))}
        </div>
        {/* Tooltip */}
        {hoveredFont && tooltipPosition && (
          <div
            className="font-tooltip"
            style={{
              position: 'fixed',
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: 'translate(-50%, -100%)',
              zIndex: 10000,
              pointerEvents: 'none',
            }}
          >
            <div className="font-tooltip-content">
              {fonts.find(f => f.value === hoveredFont)?.label}
            </div>
            <div className="font-tooltip-arrow" />
          </div>
        )}
      </div>

      {/* Choose Effect */}
      <div className="space-y-0.5">
        <Label className="text-xs md:text-[10px] text-zinc-500">Choose Effect</Label>
        <div className="grid grid-cols-3 gap-1">
          {effects.map((e) => {
            const isSelected = effect === e.value;
            const buttonColor = e.value === 'gradient' ? gradientStart : (color.startsWith('linear-gradient') ? '#FF6B9D' : color);
            const variants = generateColorVariants(buttonColor);
            
            // Generate gradients like ProfileCard does
            const gradientBg = e.value === 'gradient' 
              ? `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`
              : undefined;
            
            const toonGradient = e.value === 'toon' ? generateToonGradient(variants) : undefined;
            const popGradient = e.value === 'pop' ? generatePopGradient(variants) : undefined;
            const neonGlowGradient = e.value === 'neon' ? generateNeonGlowGradient(variants) : undefined;
            
            // Map effect to Discord CSS class
            const effectClass = `${e.value}_dfb989`;
            
            return (
              <button
                key={e.value}
                type="button"
                onClick={() => onChange('displayNameEffect', e.value)}
                className={`h-8 rounded-md border transition-all text-[10px] font-bold cursor-pointer relative overflow-hidden flex items-center justify-center ${
                  isSelected
                    ? 'border-[#5865F2] bg-[#5865F2]/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  '--custom-display-name-styles-main-color': variants.main,
                  '--custom-display-name-styles-light-1-color': variants.light1,
                  '--custom-display-name-styles-light-2-color': variants.light2,
                  '--custom-display-name-styles-dark-1-color': variants.dark1,
                  '--custom-display-name-styles-dark-2-color': variants.dark2,
                  '--custom-display-name-styles-wrap': 'wrap',
                  '--custom-display-name-styles-font-opacity': '1',
                  '--white-500': 'rgb(255, 255, 255)',
                  ...(toonGradient ? { '--toon-gradient': toonGradient } : {}),
                  ...(popGradient ? { '--pop-gradient': popGradient } : {}),
                  ...(neonGlowGradient ? { '--neon-glow-gradient': neonGlowGradient } : {}),
                } as React.CSSProperties}
              >
                <div 
                  className={`container_dfb989 showEffect_dfb989 animated_dfb989 loop_dfb989 ${effectClass}`}
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Neon glow background (like ProfileCard) */}
                  {e.value === 'neon' && (
                    <span 
                      className="neonGlow_dfb989 innerContainer_dfb989" 
                      data-username-with-effects={e.label}
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                      }}
                    >
                      {e.label}
                    </span>
                  )}
                  {/* Main effect text */}
                  <span 
                    className={`innerContainer_dfb989 ${effectClass}`}
                    data-username-with-effects={e.label}
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      ...(e.value === 'gradient' && gradientBg ? {
                        backgroundImage: gradientBg,
                      } : {}),
                    }}
                  >
                    {e.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Choose Color */}
      <div className="space-y-0.5">
        <Label className="text-[10px] text-zinc-500">Choose Color</Label>
        {effect === 'gradient' ? (
          <>
            {/* Gradient Color Pickers - Two colors to combine */}
            <div className="flex gap-1.5 items-center">
              {/* Start Color */}
              <div className="flex-1 space-y-0.5">
                <Label className="text-[9px] text-zinc-500">Start</Label>
                <div className="flex gap-1 items-center">
                  <input
                    type="color"
                    value={gradientStart}
                    onChange={(e) => onChange('displayNameGradientStart', e.target.value)}
                    className="h-7 w-7 rounded-md border border-white/10 cursor-pointer bg-white/5 flex-shrink-0"
                  />
                  <div 
                    className="h-7 flex-1 rounded-md border border-white/10"
                    style={{ background: gradientStart }}
                  />
                  <input
                    type="text"
                    value={gradientStart}
                    onChange={(e) => {
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        onChange('displayNameGradientStart', e.target.value);
                      }
                    }}
                    placeholder="#FF6B9D"
                    className="w-16 h-7 text-[10px] font-mono bg-zinc-900/50 border border-white/5 focus:border-[#5865F2] focus:ring-0 rounded-md px-1.5"
                  />
                </div>
              </div>
              {/* End Color */}
              <div className="flex-1 space-y-0.5">
                <Label className="text-[9px] text-zinc-500">End</Label>
                <div className="flex gap-1 items-center">
                  <input
                    type="color"
                    value={gradientEnd}
                    onChange={(e) => onChange('displayNameGradientEnd', e.target.value)}
                    className="h-7 w-7 rounded-md border border-white/10 cursor-pointer bg-white/5 flex-shrink-0"
                  />
                  <div 
                    className="h-7 flex-1 rounded-md border border-white/10"
                    style={{ background: gradientEnd }}
                  />
                  <input
                    type="text"
                    value={gradientEnd}
                    onChange={(e) => {
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        onChange('displayNameGradientEnd', e.target.value);
                      }
                    }}
                    placeholder="#FFB3D9"
                    className="w-16 h-7 text-[10px] font-mono bg-zinc-900/50 border border-white/5 focus:border-[#5865F2] focus:ring-0 rounded-md px-1.5"
                  />
                </div>
              </div>
            </div>
            {/* Preview Gradient */}
            <div 
              className="h-7 rounded-md border border-white/10"
              style={{ background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)` }}
            />
          </>
        ) : (
          <>
            {/* Solid Color Presets */}
            <div className="grid grid-cols-7 gap-1">
              {presetColors.map((presetColor, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onChange('displayNameColor', presetColor)}
                  className={`h-7 w-7 rounded-md border transition-all cursor-pointer ${
                    color === presetColor
                      ? 'ring-2 ring-[#5865F2] ring-offset-1 ring-offset-[#000000]/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  style={{ backgroundColor: presetColor }}
                  title={presetColor}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'color';
                  const currentColor = color.startsWith('linear-gradient') ? '#FF6B9D' : color;
                  input.value = currentColor;
                  input.onchange = (e) => {
                    const target = e.target as HTMLInputElement;
                    onChange('displayNameColor', target.value);
                  };
                  input.click();
                }}
                className="h-7 w-7 rounded-md border border-white/10 bg-white/5 hover:border-white/20 flex items-center justify-center"
                title="Custom Color"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4 12H2M6.314 6.314l2.828 2.828M17.686 17.686l2.828 2.828M6.314 17.686l2.828-2.828M17.686 6.314l2.828-2.828M22 12h-2M2 12h2" />
                </svg>
              </button>
            </div>
            <div className="flex gap-1 items-center">
              <input
                type="color"
                value={color.startsWith('linear-gradient') ? '#FF6B9D' : color}
                onChange={(e) => onChange('displayNameColor', e.target.value)}
                className="h-7 w-7 rounded-md border border-white/5 cursor-pointer bg-white/5 flex-shrink-0"
              />
              <input
                type="text"
                value={color.startsWith('linear-gradient') ? '#FF6B9D' : color}
                onChange={(e) => {
                  if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    onChange('displayNameColor', e.target.value);
                  }
                }}
                placeholder="#FF6B9D"
                className="flex-1 h-7 text-[10px] font-mono bg-zinc-900/50 border border-white/5 focus:border-[#5865F2] focus:ring-0 rounded-md px-1.5"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}



