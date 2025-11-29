'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserIdInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function UserIdInput({ value, onChange }: UserIdInputProps) {
  return (
    <div className="space-y-0.5">
      <Label htmlFor="user-id-input" className="text-[10px] text-zinc-500">
        User ID
      </Label>
      <Input
        id="user-id-input"
        type="text"
        placeholder="915480322328649758"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        className="h-7 text-xs bg-zinc-900/50 border border-white/5 focus:border-[#5865F2] focus:ring-0 rounded-md tabular-nums font-mono transition-all"
      />
    </div>
  );
}
