import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FormDefinition } from '@admissions-compass/shared';

async function fetchForms(formType?: string): Promise<FormDefinition[]> {
  const params = formType && formType !== 'all' ? `?form_type=${formType}` : '';
  const res = await fetch(`/api/v1/forms${params}`);
  if (!res.ok) {
    throw new Error('Failed to fetch forms');
  }
  const json = await res.json();
  return json.data;
}

async function fetchForm(id: string): Promise<FormDefinition> {
  const res = await fetch(`/api/v1/forms/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch form');
  }
  const json = await res.json();
  return json.data;
}

async function createForm(
  data: Partial<FormDefinition>
): Promise<FormDefinition> {
  const res = await fetch('/api/v1/forms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create form');
  }
  const json = await res.json();
  return json.data;
}

async function updateForm(
  id: string,
  data: Partial<FormDefinition>
): Promise<FormDefinition> {
  const res = await fetch(`/api/v1/forms/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update form');
  }
  const json = await res.json();
  return json.data;
}

async function deleteForm(id: string): Promise<void> {
  const res = await fetch(`/api/v1/forms/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete form');
  }
}

export function useForms(formType?: string) {
  return useQuery({
    queryKey: ['forms', formType ?? 'all'],
    queryFn: () => fetchForms(formType),
  });
}

export function useForm(id: string) {
  return useQuery({
    queryKey: ['form', id],
    queryFn: () => fetchForm(id),
    enabled: !!id,
  });
}

export function useCreateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<FormDefinition>) => createForm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
}

export function useUpdateForm(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<FormDefinition>) => updateForm(id, data),
    onSuccess: (updatedForm) => {
      queryClient.setQueryData(['form', id], updatedForm);
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
}

export function useDeleteForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
}
