'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  enrollmentSeasonSchema,
  type EnrollmentSeasonInput,
} from '@admissions-compass/shared';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@admissions-compass/ui';
import { useToast } from '@admissions-compass/ui';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useSeason, useUpdateSeason } from '@/hooks/use-seasons';
import { useSchool } from '@/hooks/use-school';

const SCHOOL_ID = '00000000-0000-0000-0000-000000000001';

export default function SeasonDetailPage() {
  const params = useParams();
  const seasonId = params.id as string;

  const { data: school } = useSchool(SCHOOL_ID);
  const { data: season, isLoading } = useSeason(SCHOOL_ID, seasonId);
  const updateSeason = useUpdateSeason(SCHOOL_ID, seasonId);
  const { toast } = useToast();

  const [capacityMap, setCapacityMap] = useState<Record<string, number>>({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<EnrollmentSeasonInput>({
    resolver: zodResolver(enrollmentSeasonSchema),
    defaultValues: {
      name: '',
      start_date: '',
      end_date: '',
      is_active: false,
    },
  });

  const isActive = watch('is_active');

  useEffect(() => {
    if (season) {
      reset({
        name: season.name,
        start_date: season.start_date,
        end_date: season.end_date,
        is_active: season.is_active,
      });
      const settings = season.settings as Record<string, unknown> | undefined;
      const cap = (settings?.capacity ?? {}) as Record<string, number>;
      setCapacityMap(cap);
    }
  }, [season, reset]);

  const gradelevels = school?.grade_levels ?? [];

  const updateCapacity = (grade: string, value: string) => {
    const num = parseInt(value, 10);
    setCapacityMap((prev) => ({
      ...prev,
      [grade]: isNaN(num) ? 0 : num,
    }));
  };

  const onSubmit = (data: EnrollmentSeasonInput) => {
    updateSeason.mutate(
      {
        ...data,
        settings: {
          ...((season?.settings as Record<string, unknown>) ?? {}),
          capacity: capacityMap,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: 'Season updated',
            description: 'Enrollment season has been saved.',
          });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to update season.',
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
        <Link href="/settings/seasons">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {season?.name ?? 'Season Details'}
          </h1>
          <p className="text-muted-foreground">
            Edit season settings and configure per-grade capacity.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Season Details</CardTitle>
            <CardDescription>
              Name, date range, and active status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Season Name</Label>
              <Input
                id="name"
                placeholder="e.g. 2025-2026 Enrollment"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register('start_date')}
                />
                {errors.start_date && (
                  <p className="text-sm text-destructive">
                    {errors.start_date.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...register('end_date')}
                />
                {errors.end_date && (
                  <p className="text-sm text-destructive">
                    {errors.end_date.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked) =>
                  setValue('is_active', checked === true, { shouldDirty: true })
                }
              />
              <Label htmlFor="is_active">Active Season</Label>
            </div>
          </CardContent>
        </Card>

        {/* Capacity per Grade */}
        <Card>
          <CardHeader>
            <CardTitle>Capacity per Grade</CardTitle>
            <CardDescription>
              Set the maximum number of seats available for each grade level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gradelevels.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No grade levels configured.{' '}
                <Link
                  href="/settings/grades"
                  className="text-primary underline"
                >
                  Configure grades
                </Link>{' '}
                first.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grade</TableHead>
                    <TableHead className="w-[200px]">Max Capacity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradelevels.map((grade) => (
                    <TableRow key={grade}>
                      <TableCell className="font-medium">{grade}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          value={capacityMap[grade] ?? 0}
                          onChange={(e) =>
                            updateCapacity(grade, e.target.value)
                          }
                          className="w-[120px]"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-3">
          <Link href="/settings/seasons">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={updateSeason.isPending}>
            {updateSeason.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
