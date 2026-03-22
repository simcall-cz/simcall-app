-- Lesson progress tracking for structured learning path
-- Each row = one attempt at one sub-scenario of one lesson

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL CHECK (lesson_number BETWEEN 1 AND 100),
  sub_scenario INTEGER NOT NULL CHECK (sub_scenario BETWEEN 1 AND 3),
  attempt INTEGER NOT NULL DEFAULT 1,
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  call_id UUID REFERENCES calls(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_user_lesson ON lesson_progress(user_id, lesson_number);

-- Unique constraint: one record per user/lesson/sub/attempt
CREATE UNIQUE INDEX idx_lesson_progress_unique
  ON lesson_progress(user_id, lesson_number, sub_scenario, attempt);

-- RLS policies
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Users can read their own progress
CREATE POLICY "Users can read own progress" ON lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress" ON lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access" ON lesson_progress
  FOR ALL USING (auth.role() = 'service_role');
