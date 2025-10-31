import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { daysApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Loader2 } from 'lucide-react';
import type { UpdateDayData } from '@/types/course';

interface DayEditorProps {
  dayId: number;
}

export function DayEditor({ dayId }: DayEditorProps) {
  const queryClient = useQueryClient();

  const { data: day, isLoading } = useQuery({
    queryKey: ['day', dayId],
    queryFn: () => daysApi.getById(dayId),
  });

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<UpdateDayData>({
    values: day ? {
      title: day.title,
      description: day.description || '',
      day_number: day.day_number,
    } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateDayData) => daysApi.update(dayId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['day', dayId] });
      if (day) {
        queryClient.invalidateQueries({ queryKey: ['days', day.course_id] });
      }
    },
  });

  const onSubmit = (data: UpdateDayData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-navy" />
      </div>
    );
  }

  if (!day) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Day not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Day</h2>
        <p className="text-sm text-gray-600 mt-1">Day ID: {dayId}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Day Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Day Title</Label>
              <Input id="title" {...register('title')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register('description')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="day_number">Day Number</Label>
              <Input
                id="day_number"
                type="number"
                {...register('day_number', { valueAsNumber: true })}
              />
            </div>

            {updateMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to update day. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {updateMutation.isSuccess && (
              <Alert>
                <AlertDescription>Day updated successfully!</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={!isDirty || updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={!isDirty}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
