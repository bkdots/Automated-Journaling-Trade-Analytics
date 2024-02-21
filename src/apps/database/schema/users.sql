CREATE TABLE IF NOT EXISTS users
(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscription_status VARCHAR(50) NOT NULL CHECK (subscription_status IN ('Free', 'Paid', 'Free with Referral')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
GO