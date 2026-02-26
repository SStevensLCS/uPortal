import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/stores/app-store';

interface School {
  id: string;
  name: string;
  address: string;
  logoUrl: string | null;
}

async function fetchSchool(schoolId: string): Promise<School> {
  // TODO: Replace with actual API call
  // const res = await fetch(`/api/schools/${schoolId}`);
  // if (!res.ok) throw new Error('Failed to fetch school');
  // return res.json();

  // Placeholder data
  return {
    id: schoolId,
    name: 'Oakridge Academy',
    address: '123 Oak Street, Springfield',
    logoUrl: null,
  };
}

export function useCurrentSchool() {
  const currentSchoolId = useAppStore((state) => state.currentSchoolId);

  return useQuery({
    queryKey: ['school', currentSchoolId],
    queryFn: () => fetchSchool(currentSchoolId!),
    enabled: !!currentSchoolId,
  });
}
