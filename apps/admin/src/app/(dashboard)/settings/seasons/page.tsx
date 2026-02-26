'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  enrollmentSeasonSchema,
  type EnrollmentSeasonInput,
} from '@admissions-compass/shared';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@admissions-compass/ui';
import { useToast } from '@admissions-compass/ui';
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Pencil,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useSeasons, useCreateSeason } from '@/hooks/use-seasons';

const SCHOOL_ID = '00000000-0000-0000-0000-000000000001';

export default function SeasonsPage() {
  const { data: seasons, isLoading } = useSeasons(SCHOOL_ID);
  const createSeason = useCreateSeason(SCHOOL_ID);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
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

  const onCreateSeason = (data: EnrollmentSeasonInput) => {
    createSeason.mutate(data, {
      onSuccess: () => {
        setDialogOpen(false);
        reset();
        toast({
          title: 'Season created',
          description: 'New enrollment season has been created.',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to create season.',
          variant: 'destructive',
        });
      },
    });
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Enrollment Seasons
          </h1>
          <p className="text-muted-foreground">
            Create and manage enrollment seasons with date ranges and capacity
            settings.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Season
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit(onCreateSeason)}>
              <DialogHeader>
                <DialogTitle>Create Enrollment Season</DialogTitle>
                <DialogDescription>
                  Set up a new enrollment season with a date range.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="season-name">Season Name</Label>
                  <Input
                    id="season-name"
                    placeholder="e.g. 2026-2027 Enrollment"
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
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
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
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
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
                    id="is-active"
                    checked={isActive}
                    onCheckedChange={(checked) =>
                      setValue('is_active', checked === true)
                    }
                  />
                  <Label htmlFor="is-active">Set as active season</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createSeason.isPending}>
                  {createSeason.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Season
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Seasons Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Seasons</CardTitle>
          <CardDescription>
            {seasons?.length ?? 0} enrollment season
            {(seasons?.length ?? 0) !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!seasons || seasons.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
              <div className="text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2">No enrollment seasons yet.</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seasons.map((season) => (
                  <TableRow key={season.id}>
                    <TableCell className="font-medium">
                      {season.name}
                    </TableCell>
                    <TableCell>
                      {new Date(season.start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(season.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {season.is_active ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/settings/seasons/${season.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
