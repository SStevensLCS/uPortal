'use client';

import { ChevronsUpDown, School } from 'lucide-react';
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

const PLACEHOLDER_SCHOOLS = [
  { id: 'school-1', name: 'Oakridge Academy' },
  { id: 'school-2', name: 'Maplewood Prep' },
];

export function SchoolSwitcher() {
  const { currentSchoolId, setCurrentSchoolId } = useAppStore();
  const currentSchool =
    PLACEHOLDER_SCHOOLS.find((s) => s.id === currentSchoolId) ??
    PLACEHOLDER_SCHOOLS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <span className="flex items-center gap-2 truncate">
            <School className="h-4 w-4 shrink-0" />
            <span className="truncate">{currentSchool.name}</span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Switch School</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PLACEHOLDER_SCHOOLS.map((school) => (
          <DropdownMenuItem
            key={school.id}
            onClick={() => setCurrentSchoolId(school.id)}
            className="cursor-pointer"
          >
            <School className="mr-2 h-4 w-4" />
            <span className="truncate">{school.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
