'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Separator,
  Badge,
} from '@admissions-compass/ui';
import { useToast } from '@admissions-compass/ui';
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useSchool, useUpdateSchool } from '@/hooks/use-school';
import type { Division } from '@admissions-compass/shared';

const SCHOOL_ID = '00000000-0000-0000-0000-000000000001';

const ALL_GRADES = [
  'PK3',
  'PK4',
  'K',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
];

export default function GradesPage() {
  const { data: school, isLoading } = useSchool(SCHOOL_ID);
  const updateSchool = useUpdateSchool(SCHOOL_ID);
  const { toast } = useToast();

  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (school) {
      setSelectedGrades(school.grade_levels);
      setDivisions(school.divisions ?? []);
    }
  }, [school]);

  const toggleGrade = useCallback(
    (grade: string) => {
      setSelectedGrades((prev) => {
        const next = prev.includes(grade)
          ? prev.filter((g) => g !== grade)
          : [...prev, grade];
        setIsDirty(true);
        return next;
      });
    },
    []
  );

  const addDivision = () => {
    setDivisions((prev) => [
      ...prev,
      { name: '', grade_levels: [] },
    ]);
    setIsDirty(true);
  };

  const removeDivision = (index: number) => {
    setDivisions((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const updateDivisionName = (index: number, name: string) => {
    setDivisions((prev) =>
      prev.map((d, i) => (i === index ? { ...d, name } : d))
    );
    setIsDirty(true);
  };

  const toggleDivisionGrade = (divisionIndex: number, grade: string) => {
    setDivisions((prev) =>
      prev.map((d, i) => {
        if (i !== divisionIndex) return d;
        const grades = d.grade_levels.includes(grade)
          ? d.grade_levels.filter((g) => g !== grade)
          : [...d.grade_levels, grade];
        return { ...d, grade_levels: grades };
      })
    );
    setIsDirty(true);
  };

  const handleSave = () => {
    if (selectedGrades.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one grade level is required.',
        variant: 'destructive',
      });
      return;
    }

    updateSchool.mutate(
      {
        grade_levels: selectedGrades,
        divisions,
      },
      {
        onSuccess: () => {
          setIsDirty(false);
          toast({
            title: 'Grades updated',
            description: 'Grade configuration has been saved.',
          });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to save grade configuration.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Grades &amp; Divisions
          </h1>
          <p className="text-muted-foreground">
            Configure which grade levels your school offers and organize them
            into divisions.
          </p>
        </div>
      </div>

      {/* Grade Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Available Grade Levels</CardTitle>
          <CardDescription>
            Select all grade levels your school offers for enrollment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8">
            {ALL_GRADES.map((grade) => {
              const isSelected = selectedGrades.includes(grade);
              return (
                <label
                  key={grade}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border p-3 transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleGrade(grade)}
                  />
                  <span className="text-sm font-medium">{grade}</span>
                </label>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {selectedGrades.length} grade{selectedGrades.length !== 1 ? 's' : ''}{' '}
            selected
          </p>
        </CardContent>
      </Card>

      {/* Division Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Divisions</CardTitle>
              <CardDescription>
                Group grade levels into divisions (e.g. Lower School, Middle
                School, Upper School).
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addDivision}>
              <Plus className="mr-2 h-4 w-4" />
              Add Division
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {divisions.length === 0 && (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              No divisions configured. Click &quot;Add Division&quot; to create one.
            </div>
          )}

          {divisions.map((division, index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Label htmlFor={`division-${index}`}>Division Name</Label>
                  <Input
                    id={`division-${index}`}
                    value={division.name}
                    onChange={(e) => updateDivisionName(index, e.target.value)}
                    placeholder="e.g. Lower School"
                    className="mt-1"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-6 text-destructive hover:text-destructive"
                  onClick={() => removeDivision(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">
                  Assigned Grades
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedGrades.map((grade) => {
                    const isInDivision =
                      division.grade_levels.includes(grade);
                    return (
                      <Badge
                        key={grade}
                        variant={isInDivision ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleDivisionGrade(index, grade)}
                      >
                        {grade}
                      </Badge>
                    );
                  })}
                </div>
                {division.grade_levels.length === 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Click on grade badges above to assign them to this division.
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-3">
        <Link href="/settings">
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </Link>
        <Button
          onClick={handleSave}
          disabled={!isDirty || updateSchool.isPending}
        >
          {updateSchool.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
