import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { ContentTree } from './ContentTree';
import { CourseEditor } from './CourseEditor';
import { DayEditor } from './DayEditor';
import { SessionEditor } from './SessionEditor';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Course, Day, Session } from '@/types/course';

type SelectedItem =
  | { type: 'course'; id: number }
  | { type: 'day'; id: number }
  | { type: 'session'; id: number }
  | null;

export function ContentTab() {
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [showNewCourseDialog, setShowNewCourseDialog] = useState(false);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: coursesApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
      {/* Left sidebar - Tree navigation */}
      <div className="col-span-3 bg-white rounded-lg border p-4 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Courses</h2>
          <Button
            size="sm"
            onClick={() => setShowNewCourseDialog(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
        <ContentTree
          courses={courses || []}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
        />
      </div>

      {/* Right content area - Editors */}
      <div className="col-span-9 bg-white rounded-lg border p-6 overflow-auto">
        {!selectedItem && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No item selected</p>
              <p className="text-sm mt-1">Select a course, day, or session from the tree</p>
            </div>
          </div>
        )}

        {selectedItem?.type === 'course' && (
          <CourseEditor courseId={selectedItem.id} />
        )}

        {selectedItem?.type === 'day' && (
          <DayEditor dayId={selectedItem.id} />
        )}

        {selectedItem?.type === 'session' && (
          <SessionEditor sessionId={selectedItem.id} />
        )}
      </div>
    </div>
  );
}
