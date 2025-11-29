'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RawgApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function RawgApiKeyInput({ value, onChange }: RawgApiKeyInputProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-0.5">
        <Label htmlFor="rawg-api-key-input" className="text-[10px] text-zinc-500">
          RAWG API Key
        </Label>
        <Input
          id="rawg-api-key-input"
          type="password"
          placeholder="Enter your RAWG API key"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          className="h-7 text-xs bg-zinc-900/50 border border-white/5 focus:border-[#5865F2] focus:ring-0 rounded-md font-mono transition-all"
        />
      </div>
      <p className="text-[9px] text-zinc-600 leading-tight">
        Get a free API key from{' '}
        <a
          href="https://rawg.io/apidocs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5865F2] hover:text-[#4752C4] underline"
        >
          rawg.io/apidocs
        </a>
        {' '}to enable better game activity images and metadata.
      </p>
    </div>
  );
}

