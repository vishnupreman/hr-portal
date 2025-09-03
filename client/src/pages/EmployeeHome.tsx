import { useQuery } from '@tanstack/react-query';
import api from '../service/api'; 

export const EmployeeHome = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['employeeHome'],
    queryFn: () => api.get('/employee/home'),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl">Employee Dashboard</h1>
      <p>{data?.data.message}</p>
    </div>
  );
};

