import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { coursesApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Download, Loader2 } from 'lucide-react';
import type { UpdateCourseData } from '@/types/course';

interface CourseEditorProps {
  courseId: number;
}

export function CourseEditor({ courseId }: CourseEditorProps) {
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => coursesApi.getById(courseId),
  });

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<UpdateCourseData>({
    values: course ? {
      name: course.name,
      description: course.description || '',
      is_active: course.is_active === 1,
    } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCourseData) => coursesApi.update(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const generateManualMutation = useMutation({
    mutationFn: () => coursesApi.generateManual(courseId),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${course?.name || 'manual'}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });

  const onSubmit = (data: UpdateCourseData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-navy" />
      </div>
    );
  }

  if (!course) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Course not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Edit Course</h2>
          <p className="text-sm text-gray-600 mt-1">Course ID: {courseId}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => generateManualMutation.mutate()}
          disabled={generateManualMutation.isPending}
        >
          {generateManualMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate Manual
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name</Label>
              <Input id="name" {...register('name')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register('description')} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                {...register('is_active')}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active (visible to users)
              </Label>
            </div>

            {updateMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to update course. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {updateMutation.isSuccess && (
              <Alert>
                <AlertDescription>Course updated successfully!</AlertDescription>
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
