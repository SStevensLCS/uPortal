import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { School } from '@admissions-compass/shared';

async function fetchSchool(id: string): Promise<School> {
  const res = await fetch(`/api/v1/schools/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch school');
  }
  const json = await res.json();
  return json.data;
}

async function updateSchool(
  id: string,
  data: Partial<School>
): Promise<School> {
  const res = await fetch(`/api/v1/schools/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update school');
  }
  const json = await res.json();
  return json.data;
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: ['school', id],
    queryFn: () => fetchSchool(id),
    enabled: !!id,
  });
}

export function useUpdateSchool(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<School>) => updateSchool(id, data),
    onSuccess: (updatedSchool) => {
      queryClient.setQueryData(['school', id], updatedSchool);
    },
  });
}
