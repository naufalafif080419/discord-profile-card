'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface DisplayOptionsProps {
  options: {
    disableAnimatedAvatarDecoration: boolean;
    hideServerTag: boolean;
    hideSpotify: boolean;
    hideDisplayName: boolean;
    hideActivityTime: boolean;
    hideBadges: boolean;
    hideActivity: boolean;
    hideRecentActivity: boolean;
    hideLastSeen: boolean;
  };
  onChange: (key: string, value: boolean) => void;
}

const optionItems = [
  { key: 'disableAnimatedAvatarDecoration', label: 'Disable Animated Avatar Decoration' },
  { key: 'hideServerTag', label: 'Hide Server Tag' },
  { key: 'hideSpotify', label: 'Hide Spotify' },
  { key: 'hideDisplayName', label: 'Hide Display Name' },
  { key: 'hideActivityTime', label: 'Hide Activity Time' },
  { key: 'hideBadges', label: 'Hide Badges' },
  { key: 'hideActivity', label: 'Hide Activity' },
  { key: 'hideRecentActivity', label: 'Hide Recent Activity' },
  { key: 'hideLastSeen', label: 'Hide Last Seen' },
];

export function DisplayOptions({ options, onChange }: DisplayOptionsProps) {
  return (
    <div className="col-span-2 grid grid-cols-3 gap-1">
      {optionItems.map((item) => (
        <div
          key={item.key}
          className="flex items-center justify-between gap-1.5 hover:bg-white/5 transition-colors rounded-md p-1"
        >
          <Label
            htmlFor={item.key}
            className="text-[10px] text-zinc-500 cursor-pointer flex-1 truncate leading-tight"
          >
            {item.label}
          </Label>
          <Switch
            id={item.key}
            checked={options[item.key as keyof typeof options]}
            onCheckedChange={(checked) => onChange(item.key, checked)}
            className="flex-shrink-0 scale-75"
          />
        </div>
      ))}
    </div>
  );
}
