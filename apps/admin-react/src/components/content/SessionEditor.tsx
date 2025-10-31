import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { sessionsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Loader2 } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import type { UpdateSessionData } from '@/types/course';

interface SessionEditorProps {
  sessionId: number;
}

export function SessionEditor({ sessionId }: SessionEditorProps) {
  const queryClient = useQueryClient();
  const [facilitatorGuide, setFacilitatorGuide] = useState('');
  const [coachesManual, setCoachesManual] = useState('');
  const [worksheet, setWorksheet] = useState('');
  const [loadedContentFor, setLoadedContentFor] = useState<number | null>(null);

  const { data: session, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => sessionsApi.getById(sessionId),
  });

  // Load content for each type
  const { data: facilitatorContent } = useQuery({
    queryKey: ['session-content', sessionId, 'facilitator_guide'],
    queryFn: () => sessionsApi.getContent(sessionId, 'facilitator_guide'),
    enabled: !!session,
  });

  const { data: manualContent } = useQuery({
    queryKey: ['session-content', sessionId, 'coaches_manual'],
    queryFn: () => sessionsApi.getContent(sessionId, 'coaches_manual'),
    enabled: !!session,
  });

  const { data: worksheetContent } = useQuery({
    queryKey: ['session-content', sessionId, 'worksheet'],
    queryFn: () => sessionsApi.getContent(sessionId, 'worksheet'),
    enabled: !!session,
  });

  // Set content when loaded
  if (session && loadedContentFor !== sessionId) {
    if (facilitatorContent !== undefined) setFacilitatorGuide(facilitatorContent || '');
    if (manualContent !== undefined) setCoachesManual(manualContent || '');
    if (worksheetContent !== undefined) setWorksheet(worksheetContent || '');
    setLoadedContentFor(sessionId);
  }

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<UpdateSessionData>({
    values: session ? {
      title: session.title,
      description: session.description || '',
      duration_minutes: session.duration_minutes,
      session_number: session.session_number,
    } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateSessionData) => sessionsApi.update(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      if (session) {
        queryClient.invalidateQueries({ queryKey: ['sessions', session.day_id] });
      }
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: ({ type, content }: { type: string; content: string }) =>
      sessionsApi.updateContent(sessionId, type, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-content', sessionId] });
    },
  });

  const onSubmit = (data: UpdateSessionData) => {
    updateMutation.mutate(data);
  };

  const handleSaveContent = (type: 'facilitator_guide' | 'coaches_manual' | 'worksheet') => {
    const content = type === 'facilitator_guide' ? facilitatorGuide :
                    type === 'coaches_manual' ? coachesManual : worksheet;
    updateContentMutation.mutate({ type, content });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-navy" />
      </div>
    );
  }

  if (!session) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Session not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Session</h2>
        <p className="text-sm text-gray-600 mt-1">Session ID: {sessionId}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Session Title</Label>
                <Input id="title" {...register('title')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session_number">Session Number</Label>
                <Input
                  id="session_number"
                  type="number"
                  {...register('session_number', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register('description')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                {...register('duration_minutes', { valueAsNumber: true })}
              />
            </div>

            {updateMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to update session. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {updateMutation.isSuccess && (
              <Alert>
                <AlertDescription>Session updated successfully!</AlertDescription>
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
                    Save Details
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

      <Card>
        <CardHeader>
          <CardTitle>Session Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="facilitator">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="facilitator">Facilitator Guide</TabsTrigger>
              <TabsTrigger value="manual">Coaches Manual</TabsTrigger>
              <TabsTrigger value="worksheet">Worksheet</TabsTrigger>
            </TabsList>

            <TabsContent value="facilitator" className="space-y-4">
              <MDEditor
                value={facilitatorGuide}
                onChange={(val) => setFacilitatorGuide(val || '')}
                height={400}
              />
              <Button
                onClick={() => handleSaveContent('facilitator_guide')}
                disabled={updateContentMutation.isPending}
              >
                {updateContentMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Facilitator Guide
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <MDEditor
                value={coachesManual}
                onChange={(val) => setCoachesManual(val || '')}
                height={400}
              />
              <Button
                onClick={() => handleSaveContent('coaches_manual')}
                disabled={updateContentMutation.isPending}
              >
                {updateContentMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Coaches Manual
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="worksheet" className="space-y-4">
              <MDEditor
                value={worksheet}
                onChange={(val) => setWorksheet(val || '')}
                height={400}
              />
              <Button
                onClick={() => handleSaveContent('worksheet')}
                disabled={updateContentMutation.isPending}
              >
                {updateContentMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Worksheet
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {updateContentMutation.isSuccess && (
            <Alert className="mt-4">
              <AlertDescription>Content saved successfully!</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
