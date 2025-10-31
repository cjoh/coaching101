import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { daysApi, sessionsApi } from '@/lib/api';
import { ChevronRight, ChevronDown, BookOpen, Calendar, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Course } from '@/types/course';

type SelectedItem =
  | { type: 'course'; id: number }
  | { type: 'day'; id: number }
  | { type: 'session'; id: number }
  | null;

interface ContentTreeProps {
  courses: Course[];
  selectedItem: SelectedItem;
  onSelectItem: (item: SelectedItem) => void;
}

export function ContentTree({ courses, selectedItem, onSelectItem }: ContentTreeProps) {
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(new Set());
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());

  const toggleCourse = (courseId: number) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const toggleDay = (dayId: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayId)) {
      newExpanded.delete(dayId);
    } else {
      newExpanded.add(dayId);
    }
    setExpandedDays(newExpanded);
  };

  return (
    <div className="space-y-1">
      {courses.map((course) => (
        <CourseNode
          key={course.id}
          course={course}
          isExpanded={expandedCourses.has(course.id)}
          isSelected={selectedItem?.type === 'course' && selectedItem.id === course.id}
          onToggle={() => toggleCourse(course.id)}
          onSelect={() => onSelectItem({ type: 'course', id: course.id })}
          expandedDays={expandedDays}
          toggleDay={toggleDay}
          selectedItem={selectedItem}
          onSelectItem={onSelectItem}
        />
      ))}
    </div>
  );
}

interface CourseNodeProps {
  course: Course;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onSelect: () => void;
  expandedDays: Set<number>;
  toggleDay: (id: number) => void;
  selectedItem: SelectedItem;
  onSelectItem: (item: SelectedItem) => void;
}

function CourseNode({
  course,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  expandedDays,
  toggleDay,
  selectedItem,
  onSelectItem,
}: CourseNodeProps) {
  const { data: days } = useQuery({
    queryKey: ['days', course.id],
    queryFn: () => daysApi.getByCourseId(course.id),
    enabled: isExpanded,
  });

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer',
          isSelected && 'bg-navy/10 hover:bg-navy/10'
        )}
      >
        <button onClick={onToggle} className="p-0.5 hover:bg-gray-200 rounded">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <div onClick={onSelect} className="flex items-center gap-2 flex-1">
          <BookOpen className="h-4 w-4 text-navy" />
          <span className="text-sm font-medium">{course.name}</span>
        </div>
      </div>

      {isExpanded && days && (
        <div className="ml-4 mt-1 space-y-1">
          {days.map((day) => (
            <DayNode
              key={day.id}
              day={day}
              isExpanded={expandedDays.has(day.id)}
              isSelected={selectedItem?.type === 'day' && selectedItem.id === day.id}
              onToggle={() => toggleDay(day.id)}
              onSelect={() => onSelectItem({ type: 'day', id: day.id })}
              selectedItem={selectedItem}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DayNodeProps {
  day: any;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onSelect: () => void;
  selectedItem: SelectedItem;
  onSelectItem: (item: SelectedItem) => void;
}

function DayNode({
  day,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  selectedItem,
  onSelectItem,
}: DayNodeProps) {
  const { data: sessions } = useQuery({
    queryKey: ['sessions', day.id],
    queryFn: () => sessionsApi.getByDayId(day.id),
    enabled: isExpanded,
  });

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer',
          isSelected && 'bg-navy/10 hover:bg-navy/10'
        )}
      >
        <button onClick={onToggle} className="p-0.5 hover:bg-gray-200 rounded">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <div onClick={onSelect} className="flex items-center gap-2 flex-1">
          <Calendar className="h-4 w-4 text-gold" />
          <span className="text-sm">{day.title}</span>
        </div>
      </div>

      {isExpanded && sessions && (
        <div className="ml-4 mt-1 space-y-1">
          {sessions.map((session) => (
            <SessionNode
              key={session.id}
              session={session}
              isSelected={selectedItem?.type === 'session' && selectedItem.id === session.id}
              onSelect={() => onSelectItem({ type: 'session', id: session.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SessionNodeProps {
  session: any;
  isSelected: boolean;
  onSelect: () => void;
}

function SessionNode({ session, isSelected, onSelect }: SessionNodeProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 pl-6 rounded hover:bg-gray-100 cursor-pointer',
        isSelected && 'bg-navy/10 hover:bg-navy/10'
      )}
    >
      <FileText className="h-4 w-4 text-gray-500" />
      <span className="text-sm">{session.title}</span>
    </div>
  );
}
