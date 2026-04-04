-- ============================================================
-- V3 RESTRUCTURING: Engine alignment
-- ============================================================

-- 1. LESSONS TABLE (new — replaces hardcoded lessons-v2.ts)
CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,                    -- topic_id, e.g. "sales.first_contact"
    lesson_number INTEGER NOT NULL UNIQUE,  -- 1-105
    title_cs TEXT NOT NULL,
    category TEXT NOT NULL,                 -- 14 engine categories
    skills_tested JSONB DEFAULT '[]',
    knowledge_snippets JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons(category);
CREATE INDEX IF NOT EXISTS idx_lessons_number ON lessons(lesson_number);

-- 2. AGENTS TABLE — add V3 columns (existing columns stay for backward compat)
ALTER TABLE agents ADD COLUMN IF NOT EXISTS topic_id TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS tier TEXT CHECK (tier IN ('beginner', 'intermediate', 'advanced'));
ALTER TABLE agents ADD COLUMN IF NOT EXISTS difficulty_overall REAL;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS difficulty_5d JSONB;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS persona_name TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS archetype TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS emotional_state TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS system_prompt TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS internal_brief TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS evaluation_profile TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS scoring JSONB;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS behavior JSONB;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS property JSONB;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS elevenlabs_config JSONB;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS engine_agent_id TEXT UNIQUE;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE agents ADD COLUMN IF NOT EXISTS schema_version TEXT DEFAULT '3.0';

CREATE INDEX IF NOT EXISTS idx_agents_topic_id ON agents(topic_id);
CREATE INDEX IF NOT EXISTS idx_agents_tier ON agents(tier);
CREATE INDEX IF NOT EXISTS idx_agents_engine_id ON agents(engine_agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);

-- 3. LESSON_PROGRESS — add V3 columns
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS topic_id TEXT;
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS tier TEXT CHECK (tier IN ('beginner', 'intermediate', 'advanced'));

-- Extend lesson_number range from 100 to 105
ALTER TABLE lesson_progress DROP CONSTRAINT IF EXISTS lesson_progress_lesson_number_check;

CREATE UNIQUE INDEX IF NOT EXISTS idx_lesson_progress_v3
    ON lesson_progress(user_id, topic_id, tier, attempt);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_topic ON lesson_progress(topic_id);

-- 4. FEEDBACK — missing columns from V2 eval
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS summary_good TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS summary_improve TEXT;

-- 5. SCENARIOS — add control_prompt (referenced in code but missing)
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS control_prompt TEXT;
