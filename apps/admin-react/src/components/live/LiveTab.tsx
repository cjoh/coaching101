import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/contexts/SocketContext';
import { questionsApi, broadcastApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Send, MessageSquare, Loader2, Radio } from 'lucide-react';
import { marked } from 'marked';
import type { Question } from '@/types/question';

export function LiveTab() {
  const { socket, isConnected } = useSocket();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerText, setAnswerText] = useState<{ [key: number]: string }>({});
  const queryClient = useQueryClient();

  const { data: initialQuestions, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: questionsApi.getAll,
  });

  const { data: broadcastPosition } = useQuery({
    queryKey: ['broadcast-position'],
    queryFn: broadcastApi.getPosition,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (initialQuestions) {
      setQuestions(initialQuestions);
    }
  }, [initialQuestions]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new-question', (question: Question) => {
      setQuestions((prev) => [question, ...prev]);
    });

    socket.on('question-answered', ({ questionId, answerText }: any) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, answer_text: answerText, answered_at: new Date().toISOString() }
            : q
        )
      );
    });

    return () => {
      socket.off('new-question');
      socket.off('question-answered');
    };
  }, [socket]);

  const answerMutation = useMutation({
    mutationFn: ({ questionId, text }: { questionId: number; text: string }) =>
      questionsApi.answer(questionId, text),
    onSuccess: (_, variables) => {
      setAnswerText((prev) => {
        const newState = { ...prev };
        delete newState[variables.questionId];
        return newState;
      });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const updatePositionMutation = useMutation({
    mutationFn: (data: { module: string; day: number; session: number }) =>
      broadcastApi.updatePosition(data.module, data.day, data.session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcast-position'] });
    },
  });

  const handleAnswer = (questionId: number) => {
    const text = answerText[questionId];
    if (text) {
      answerMutation.mutate({ questionId, text });
    }
  };

  const unansweredQuestions = questions.filter((q) => !q.answer_text);
  const answeredQuestions = questions.filter((q) => q.answer_text);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-navy mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Loading live session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-600">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="questions">
            <MessageSquare className="h-4 w-4 mr-2" />
            Questions ({unansweredQuestions.length})
          </TabsTrigger>
          <TabsTrigger value="broadcast">
            <Radio className="h-4 w-4 mr-2" />
            Broadcast
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4 mt-6">
          {/* Unanswered Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Unanswered Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {unansweredQuestions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No unanswered questions
                </p>
              ) : (
                unansweredQuestions.map((question) => (
                  <div key={question.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{question.question_text}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <span>{question.user_name || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{new Date(question.created_at).toLocaleTimeString()}</span>
                          <Badge variant="outline">{question.module_id}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your answer..."
                        value={answerText[question.id] || ''}
                        onChange={(e) =>
                          setAnswerText((prev) => ({
                            ...prev,
                            [question.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAnswer(question.id);
                          }
                        }}
                      />
                      <Button
                        onClick={() => handleAnswer(question.id)}
                        disabled={
                          !answerText[question.id] || answerMutation.isPending
                        }
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Answered Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Answered Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {answeredQuestions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No answered questions yet
                </p>
              ) : (
                answeredQuestions.map((question) => (
                  <div key={question.id} className="border rounded-lg p-4 space-y-2">
                    <div>
                      <p className="font-medium">{question.question_text}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <span>{question.user_name || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{new Date(question.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-700">{question.answer_text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Answered at {new Date(question.answered_at!).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="broadcast" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Broadcast Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Current Position</h3>
                {broadcastPosition ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Module:</span>{' '}
                      {broadcastPosition.module_id}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Day:</span> {broadcastPosition.day_number}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Session:</span>{' '}
                      {broadcastPosition.session_number}
                    </p>
                  </div>
                ) : (
                  <Alert>
                    <AlertDescription>
                      No session is currently being broadcast
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Update Position</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Change the broadcast position manually (normally controlled from participant view)
                </p>
                <Alert>
                  <AlertDescription>
                    Use the participant interface to control broadcast position during live sessions
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
