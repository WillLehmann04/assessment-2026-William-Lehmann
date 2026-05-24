CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    induction_id UUID NOT NULL REFERENCES inductions(id) ON DELETE CASCADE,
    sort_column VARCHAR(100) NOT NULL DEFAULT 'created_at',
    sort_direction VARCHAR(4) NOT NULL DEFAULT 'desc' CHECK (sort_direction IN ('asc', 'desc')),
    status_filter VARCHAR(50) DEFAULT NULL CHECK (status_filter IN ('pending', 'in_progress', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, induction_id)
);
