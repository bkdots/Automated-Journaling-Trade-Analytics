CREATE TABLE IF NOT EXISTS tags
(
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(255) NOT NULL UNIQUE,
    tag_type VARCHAR(100) NOT NULL CHECK (tag_type IN ('entry', 'exit', 'management', 'mistake')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);