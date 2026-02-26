'use client';

import { ChevronsUpDown, CalendarRange } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from '@admissions-compass/ui';
import { useAppStore } from '@/stores/app-store';

const PLACEHOLDER_SEASONS = [
  { id: 'season-2026', name: '2026-2027' },
  { id: 'season-2025', name: '2025-2026' },
  { id: 'season-2024', name: '2024-2025' },
];

export function SeasonSwitcher() {
  const { currentSeasonId, setCurrentSeasonId } = useAppStore();
  const currentSeason =
    PLACEHOLDER_SEASONS.find((s) => s.id === currentSeasonId) ??
    PLACEHOLDER_SEASONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[160px] justify-between">
          <span className="flex items-center gap-2 truncate">
            <CalendarRange className="h-4 w-4 shrink-0" />
            <span className="truncate">{currentSeason.name}</span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[160px]">
        <DropdownMenuLabel>Switch Season</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PLACEHOLDER_SEASONS.map((season) => (
          <DropdownMenuItem
            key={season.id}
            onClick={() => setCurrentSeasonId(season.id)}
            className="cursor-pointer"
          >
            <CalendarRange className="mr-2 h-4 w-4" />
            {season.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
