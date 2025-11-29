'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageOptionsProps {
  bannerUrl: string;
  imageWidth: number;
  onChange: (key: string, value: string | number) => void;
}

export function ImageOptions({ bannerUrl, imageWidth, onChange }: ImageOptionsProps) {
  return (
    <div className="col-span-2 grid grid-cols-2 gap-1.5">
      <div className="space-y-0.5">
        <Label htmlFor="banner-url" className="text-[10px] text-zinc-500">
          Banner URL
        </Label>
        <Input
          id="banner-url"
          type="url"
          placeholder="https://example.com/banner.png"
          value={bannerUrl}
          onChange={(e) => onChange('bannerUrl', e.target.value)}
          className="h-7 text-xs bg-zinc-900/50 border border-white/5 focus:border-[#5865F2] focus:ring-0 rounded-md"
        />
      </div>
      
      <div className="space-y-0.5">
        <Label htmlFor="image-width" className="text-[10px] text-zinc-500">
          Width (px)
        </Label>
        <Input
          id="image-width"
          type="number"
          min={100}
          max={2048}
          value={imageWidth}
          onChange={(e) => onChange('imageWidth', parseInt(e.target.value) || 512)}
          className="h-7 text-xs bg-zinc-900/50 border border-white/5 focus:border-[#5865F2] focus:ring-0 rounded-md tabular-nums"
        />
      </div>
    </div>
  );
}
