'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AppearanceSettingsProps {
  colorScheme: 'default' | 'dark' | 'light' | 'custom';
  primaryColor: string;
  accentColor: string;
  onChange: (key: string, value: string) => void;
}

const colorSchemes = [
  {
    value: 'default',
    label: 'Default',
    description: 'User\'s Discord color',
    color: '#5865F2',
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Dark theme',
    color: '#2f3136',
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Light theme',
    color: '#ffffff',
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Custom colors',
    color: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
  },
];

export function AppearanceSettings({ colorScheme, primaryColor, accentColor, onChange }: AppearanceSettingsProps) {
  return (
    <div className="col-span-2 space-y-1">
      <Label className="text-xs md:text-[10px] text-zinc-500">Color Scheme</Label>
      <div className="grid grid-cols-2 gap-1">
        {colorSchemes.map((scheme) => (
          <button
            key={scheme.value}
            type="button"
            onClick={() => onChange('colorScheme', scheme.value)}
            className={`flex items-center gap-1.5 px-2 md:px-1.5 py-2 md:py-1 rounded-md transition-all text-left min-h-[44px] md:min-h-0 ${
              colorScheme === scheme.value
                ? 'bg-[#5865F2]/10 border border-[#5865F2]/50'
                : 'hover:bg-white/5 border border-transparent'
            }`}
            aria-label={`Select ${scheme.label} color scheme`}
            aria-pressed={colorScheme === scheme.value}
          >
            <div
              className={`w-4 h-4 rounded-full ring-1 flex-shrink-0 ${
                colorScheme === scheme.value
                  ? 'ring-[#5865F2] ring-2'
                  : 'ring-white/20'
              }`}
              style={{
                background:
                  scheme.value === 'custom'
                    ? `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`
                    : scheme.color,
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium text-zinc-200 leading-tight">{scheme.label}</div>
              <div className="text-[9px] text-zinc-500 leading-tight">{scheme.description}</div>
            </div>
          </button>
        ))}
      </div>

      {colorScheme === 'custom' && (
        <div className="space-y-1 pt-1">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="space-y-0.5">
              <Label htmlFor="primary-color" className="text-[10px] text-zinc-500">
                Primary
              </Label>
              <div className="flex gap-1">
                <input
                  type="color"
                  id="primary-color"
                  value={primaryColor}
                  onChange={(e) => onChange('primaryColor', e.target.value)}
                  className="h-7 w-7 rounded-md border border-white/5 cursor-pointer bg-white/5 flex-shrink-0"
                />
                <Input
                  id="primary-color-hex"
                  value={primaryColor}
                  placeholder="#8180ff"
                  onChange={(e) => {
                    const hex = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(hex)) {
                      onChange('primaryColor', hex);
                    }
                  }}
                  className="h-7 text-xs font-mono bg-zinc-900/50 border border-white/5 focus:border-[#5865F2] focus:ring-0 rounded-md"
                />
              </div>
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="accent-color" className="text-[10px] text-zinc-500">
                Accent
              </Label>
              <div className="flex gap-1">
                <input
                  type="color"
                  id="accent-color"
                  value={accentColor}
                  onChange={(e) => onChange('accentColor', e.target.value)}
                  className="h-7 w-7 rounded-md border border-white/5 cursor-pointer bg-white/5 flex-shrink-0"
                />
                <Input
                  id="accent-color-hex"
                  value={accentColor}
                  placeholder="#fe80c0"
                  onChange={(e) => {
                    const hex = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(hex)) {
                      onChange('accentColor', hex);
                    }
                  }}
                  className="h-7 text-xs font-mono bg-zinc-900/50 border border-white/5 focus:border-[#5865F2] focus:ring-0 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
