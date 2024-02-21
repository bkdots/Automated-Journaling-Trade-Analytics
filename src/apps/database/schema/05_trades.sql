CREATE TABLE IF NOT EXISTS trades
(
    trade_id SERIAL PRIMARY KEY,
    journal_id INTEGER NOT NULL,
    date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    tag_id INTEGER,
    image_id VARCHAR(255), -- Assuming the image_id is a reference or key to an S3 object
    FOREIGN KEY (journal_id) REFERENCES journals(journal_id),
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);