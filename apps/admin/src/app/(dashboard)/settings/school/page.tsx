'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  schoolSettingsSchema,
  type SchoolSettingsInput,
} from '@admissions-compass/shared';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from '@admissions-compass/ui';
import { useToast } from '@admissions-compass/ui';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useSchool, useUpdateSchool } from '@/hooks/use-school';

const SCHOOL_ID = '00000000-0000-0000-0000-000000000001';

const SCHOOL_TYPES = [
  { value: 'independent', label: 'Independent' },
  { value: 'charter', label: 'Charter' },
  { value: 'parochial', label: 'Parochial' },
  { value: 'montessori', label: 'Montessori' },
  { value: 'waldorf', label: 'Waldorf' },
  { value: 'boarding', label: 'Boarding' },
  { value: 'day', label: 'Day' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'other', label: 'Other' },
] as const;

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
];

export default function SchoolProfilePage() {
  const { data: school, isLoading } = useSchool(SCHOOL_ID);
  const updateSchool = useUpdateSchool(SCHOOL_ID);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<SchoolSettingsInput>({
    resolver: zodResolver(schoolSettingsSchema),
    defaultValues: {
      name: '',
      slug: '',
      timezone: 'America/New_York',
      currency: 'USD',
      school_type: 'independent',
      grade_levels: [],
      website_url: '',
      phone: '',
      address: {
        street: '',
        street2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'US',
      },
    },
  });

  const schoolType = watch('school_type');
  const timezone = watch('timezone');

  useEffect(() => {
    if (school) {
      reset({
        name: school.name,
        slug: school.slug,
        timezone: school.timezone,
        currency: school.currency,
        school_type: school.school_type,
        grade_levels: school.grade_levels,
        website_url: school.website_url,
        phone: school.phone,
        address: school.address ?? {
          street: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'US',
        },
      });
    }
  }, [school, reset]);

  const onSubmit = (data: SchoolSettingsInput) => {
    updateSchool.mutate(data, {
      onSuccess: () => {
        toast({
          title: 'Settings saved',
          description: 'School profile has been updated successfully.',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to save settings. Please try again.',
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">School Profile</h1>
          <p className="text-muted-foreground">
            Manage your school&apos;s basic information and contact details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* General Information */}
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>
              Basic details about your school.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">School Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Oakridge Academy"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  placeholder="e.g. oakridge-academy"
                  {...register('slug')}
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">
                    {errors.slug.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  placeholder="https://www.school.edu"
                  {...register('website_url')}
                />
                {errors.website_url && (
                  <p className="text-sm text-destructive">
                    {errors.website_url.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>School Type</Label>
                <Select
                  value={schoolType}
                  onValueChange={(val) =>
                    setValue('school_type', val as SchoolSettingsInput['school_type'], {
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHOOL_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.school_type && (
                  <p className="text-sm text-destructive">
                    {errors.school_type.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={timezone}
                  onValueChange={(val) =>
                    setValue('timezone', val, { shouldDirty: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.timezone && (
                  <p className="text-sm text-destructive">
                    {errors.timezone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  placeholder="USD"
                  maxLength={3}
                  {...register('currency')}
                />
                {errors.currency && (
                  <p className="text-sm text-destructive">
                    {errors.currency.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>
              Your school&apos;s physical mailing address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="123 Main Street"
                {...register('address.street')}
              />
              {errors.address?.street && (
                <p className="text-sm text-destructive">
                  {errors.address.street.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="street2">
                Street Address 2{' '}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="street2"
                placeholder="Suite 100"
                {...register('address.street2')}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Springfield"
                  {...register('address.city')}
                />
                {errors.address?.city && (
                  <p className="text-sm text-destructive">
                    {errors.address.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="IL"
                  {...register('address.state')}
                />
                {errors.address?.state && (
                  <p className="text-sm text-destructive">
                    {errors.address.state.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  placeholder="62701"
                  {...register('address.postal_code')}
                />
                {errors.address?.postal_code && (
                  <p className="text-sm text-destructive">
                    {errors.address.postal_code.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-3">
          <Link href="/settings">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={!isDirty || updateSchool.isPending}>
            {updateSchool.isPending ? (
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
