export interface Question {
  id: number;
  module_id: string;
  user_id: number | null;
  question_text: string;
  answer_text: string | null;
  created_at: string;
  answered_at: string | null;
  user_name?: string; // Joined from users table
}

export interface SubmitQuestionData {
  moduleId: string;
  questionText: string;
}

export interface AnswerQuestionData {
  answerText: string;
}
