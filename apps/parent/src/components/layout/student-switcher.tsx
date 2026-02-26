'use client';

import { useState } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const PLACEHOLDER_STUDENTS = [
  { id: 'all', name: 'All Students' },
  { id: 'student-1', name: 'Emma Johnson' },
  { id: 'student-2', name: 'Liam Johnson' },
];

export function StudentSwitcher() {
  const { currentStudentId, setCurrentStudentId } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentStudent =
    PLACEHOLDER_STUDENTS.find((s) => s.id === currentStudentId) ??
    PLACEHOLDER_STUDENTS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{currentStudent.name}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-md border bg-popover p-1 shadow-md"
            role="listbox"
            aria-label="Select student"
          >
            {PLACEHOLDER_STUDENTS.map((student) => (
              <button
                key={student.id}
                type="button"
                role="option"
                aria-selected={student.id === currentStudent.id}
                onClick={() => {
                  setCurrentStudentId(
                    student.id === 'all' ? null : student.id
                  );
                  setIsOpen(false);
                }}
                className={`flex w-full min-h-[44px] items-center rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent ${
                  student.id === currentStudent.id
                    ? 'bg-accent font-medium'
                    : ''
                }`}
              >
                {student.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
