import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/stores/app-store';

interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

async function fetchSeason(seasonId: string): Promise<Season> {
  // TODO: Replace with actual API call
  // const res = await fetch(`/api/seasons/${seasonId}`);
  // if (!res.ok) throw new Error('Failed to fetch season');
  // return res.json();

  // Placeholder data
  return {
    id: seasonId,
    name: '2026-2027',
    startDate: '2026-09-01',
    endDate: '2027-06-30',
    isActive: true,
  };
}

export function useCurrentSeason() {
  const currentSeasonId = useAppStore((state) => state.currentSeasonId);

  return useQuery({
    queryKey: ['season', currentSeasonId],
    queryFn: () => fetchSeason(currentSeasonId!),
    enabled: !!currentSeasonId,
  });
}
