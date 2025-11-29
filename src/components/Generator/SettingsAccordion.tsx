'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionSection {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

interface SettingsAccordionProps {
  sections: AccordionSection[];
}

export function SettingsAccordion({ sections }: SettingsAccordionProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sections.filter(s => s.defaultOpen).map(s => s.id))
  );

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {sections.map((section) => {
        const isOpen = openSections.has(section.id);
        return (
          <div
            key={section.id}
            className="border border-white/5 rounded-lg bg-white/2 overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-3 md:p-2.5 text-left hover:bg-white/5 transition-colors"
              aria-expanded={isOpen}
              aria-controls={`section-${section.id}`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-[10px] font-semibold text-zinc-200">
                  {section.title}
                </div>
                {section.description && (
                  <div className="text-[10px] md:text-[9px] text-zinc-500 mt-0.5">
                    {section.description}
                  </div>
                )}
              </div>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-zinc-400 transition-transform duration-200 flex-shrink-0 ml-2',
                  isOpen && 'transform rotate-180'
                )}
                aria-hidden="true"
              />
            </button>
            <div
              id={`section-${section.id}`}
              className={cn(
                'overflow-hidden transition-all duration-300 ease-in-out',
                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              )}
              aria-hidden={!isOpen}
            >
              <div className="p-3 md:p-2.5 pt-0 border-t border-white/5">
                {section.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

