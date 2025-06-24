'use client';

import dynamic from 'next/dynamic';

const CommandPalette = dynamic(() => import('./CommandPalette').then(mod => ({ default: mod.CommandPalette })), {
  ssr: false,
  loading: () => null
});

export const CommandPaletteWrapper = () => {
  return <CommandPalette />;
}; 