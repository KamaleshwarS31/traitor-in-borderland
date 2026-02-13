-- Database Schema for Traitor in Borderland Game

-- Drop existing tables if needed (for clean setup)
DROP TABLE IF EXISTS scans_history CASCADE;
DROP TABLE IF EXISTS team_clues CASCADE;
DROP TABLE IF EXISTS sabotages CASCADE;
DROP TABLE IF EXISTS game_state CASCADE;
DROP TABLE IF EXISTS gold_bars CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (for authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams table
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) UNIQUE NOT NULL,
    team_code VARCHAR(50) UNIQUE NOT NULL,
    team_type VARCHAR(50) NOT NULL,
    total_score INTEGER DEFAULT 0,
    team_lead_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team members table
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id)
);

-- Locations table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    location_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gold bars table
CREATE TABLE gold_bars (
    id SERIAL PRIMARY KEY,
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    points INTEGER NOT NULL,
    location_id INTEGER REFERENCES locations(id),
    clue_text TEXT,
    clue_location_id INTEGER REFERENCES locations(id),
    is_scanned BOOLEAN DEFAULT FALSE,
    scanned_by_team_id INTEGER REFERENCES teams(id),
    scanned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game state table
CREATE TABLE game_state (
    id SERIAL PRIMARY KEY,
    current_round INTEGER DEFAULT 0,
    total_rounds INTEGER DEFAULT 4,
    round_duration INTEGER DEFAULT 600,
    round_start_time TIMESTAMP,
    round_end_time TIMESTAMP,
    sabotage_duration INTEGER DEFAULT 60,
    sabotage_cooldown INTEGER DEFAULT 120,
    sabotage_same_person_cooldown INTEGER DEFAULT 300,
    game_status VARCHAR(50) DEFAULT 'not_started',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sabotages table
CREATE TABLE sabotages (
    id SERIAL PRIMARY KEY,
    traitor_team_id INTEGER REFERENCES teams(id),
    target_team_id INTEGER REFERENCES teams(id),
    sabotage_start_time TIMESTAMP NOT NULL,
    sabotage_end_time TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team clues table (tracks which clue each team should see next)
CREATE TABLE team_clues (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    current_clue_text TEXT,
    current_clue_location_id INTEGER REFERENCES locations(id),
    next_gold_bar_id INTEGER REFERENCES gold_bars(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id)
);

-- Scans history table
CREATE TABLE scans_history (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id),
    gold_bar_id INTEGER REFERENCES gold_bars(id),
    user_id INTEGER REFERENCES users(id),
    points_earned INTEGER,
    was_sabotaged BOOLEAN DEFAULT FALSE,
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial game state
INSERT INTO game_state (id, total_rounds, round_duration, sabotage_duration, sabotage_cooldown, sabotage_same_person_cooldown)
VALUES (1, 4, 600, 60, 120, 300);

-- Create indexes for performance
CREATE INDEX idx_teams_team_code ON teams(team_code);
CREATE INDEX idx_gold_bars_qr_code ON gold_bars(qr_code);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_sabotages_active ON sabotages(is_active);
CREATE INDEX idx_scans_history_team_id ON scans_history(team_id);
