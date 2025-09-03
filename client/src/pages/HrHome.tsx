import { useQuery } from '@tanstack/react-query';
import { hrService } from '../service/hrService'; 

export const HrHome = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['hrHome'],
    queryFn: hrService.getHome,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl">HR Dashboard</h1>
      <p>{data?.data.message}</p>
    </div>
  );
};

