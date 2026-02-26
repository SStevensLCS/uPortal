import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { EnrollmentSeason } from '@admissions-compass/shared';

async function fetchSeasons(schoolId: string): Promise<EnrollmentSeason[]> {
  const res = await fetch(`/api/v1/schools/${schoolId}/seasons`);
  if (!res.ok) {
    throw new Error('Failed to fetch seasons');
  }
  const json = await res.json();
  return json.data;
}

async function fetchSeason(
  schoolId: string,
  seasonId: string
): Promise<EnrollmentSeason> {
  const res = await fetch(
    `/api/v1/schools/${schoolId}/seasons/${seasonId}`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch season');
  }
  const json = await res.json();
  return json.data;
}

async function createSeason(
  schoolId: string,
  data: Partial<EnrollmentSeason>
): Promise<EnrollmentSeason> {
  const res = await fetch(`/api/v1/schools/${schoolId}/seasons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create season');
  }
  const json = await res.json();
  return json.data;
}

async function updateSeason(
  schoolId: string,
  seasonId: string,
  data: Partial<EnrollmentSeason>
): Promise<EnrollmentSeason> {
  const res = await fetch(
    `/api/v1/schools/${schoolId}/seasons/${seasonId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) {
    throw new Error('Failed to update season');
  }
  const json = await res.json();
  return json.data;
}

export function useSeasons(schoolId: string) {
  return useQuery({
    queryKey: ['seasons', schoolId],
    queryFn: () => fetchSeasons(schoolId),
    enabled: !!schoolId,
  });
}

export function useSeason(schoolId: string, seasonId: string) {
  return useQuery({
    queryKey: ['season', schoolId, seasonId],
    queryFn: () => fetchSeason(schoolId, seasonId),
    enabled: !!schoolId && !!seasonId,
  });
}

export function useCreateSeason(schoolId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EnrollmentSeason>) =>
      createSeason(schoolId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons', schoolId] });
    },
  });
}

export function useUpdateSeason(schoolId: string, seasonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EnrollmentSeason>) =>
      updateSeason(schoolId, seasonId, data),
    onSuccess: (updatedSeason) => {
      queryClient.setQueryData(
        ['season', schoolId, seasonId],
        updatedSeason
      );
      queryClient.invalidateQueries({ queryKey: ['seasons', schoolId] });
    },
  });
}
