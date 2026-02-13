# API Reference - Traitor in Borderland

Base URL: `http://localhost:5000` (development)

All endpoints except `/health` and `/api/auth/register-member` require authentication via Firebase token in the Authorization header:

```
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

## Authentication Endpoints

### POST /api/auth/verify
Verify Firebase token and get user info.

**Auth Required**: Yes

**Response**:
```json
{
  "role": "master_admin",
  "email": "admin@vit.ac.in",
  "id": 1
}
```

### POST /api/auth/register-member
Register a new member (auto-creates user if doesn't exist).

**Auth Required**: Yes (Firebase token)

**Response**:
```json
{
  "id": 5,
  "email": "member@vit.ac.in",
  "role": "member",
  "created_at": "2026-02-12T07:00:00.000Z"
}
```

---

## Admin Endpoints (Master Admin Only)

### POST /api/admin/locations
Create a new location.

**Request Body**:
```json
{
  "location_name": "Library Entrance",
  "description": "Main entrance of the library building"
}
```

**Response**:
```json
{
  "id": 1,
  "location_name": "Library Entrance",
  "description": "Main entrance of the library building",
  "created_at": "2026-02-12T07:00:00.000Z"
}
```

### GET /api/admin/locations
Get all locations.

**Response**:
```json
[
  {
    "id": 1,
    "location_name": "Library Entrance",
    "description": "Main entrance of the library building",
    "created_at": "2026-02-12T07:00:00.000Z"
  }
]
```

### POST /api/admin/gold-bars
Create a gold bar with QR code.

**Request Body**:
```json
{
  "points": 100,
  "location_id": 1,
  "clue_text": "Where books meet knowledge",
  "clue_location_id": 2
}
```

**Response**:
```json
{
  "id": 1,
  "qr_code": "550e8400-e29b-41d4-a716-446655440000",
  "points": 100,
  "location_id": 1,
  "clue_text": "Where books meet knowledge",
  "clue_location_id": 2,
  "is_scanned": false,
  "scanned_by_team_id": null,
  "scanned_at": null,
  "created_at": "2026-02-12T07:00:00.000Z",
  "qr_code_image": "data:image/png;base64,iVBORw0KG..."
}
```

### GET /api/admin/gold-bars
Get all gold bars with location names.

**Response**:
```json
[
  {
    "id": 1,
    "qr_code": "550e8400-e29b-41d4-a716-446655440000",
    "points": 100,
    "location_id": 1,
    "location_name": "Library Entrance",
    "clue_text": "Where books meet knowledge",
    "clue_location_id": 2,
    "clue_location_name": "Cafeteria",
    "is_scanned": false,
    "scanned_by_team_id": null,
    "scanned_by_team_name": null,
    "scanned_at": null,
    "created_at": "2026-02-12T07:00:00.000Z"
  }
]
```

### GET /api/admin/gold-bars/:id/qr
Get QR code image for a specific gold bar.

**Response**:
```json
{
  "qr_code_image": "data:image/png;base64,iVBORw0KG..."
}
```

### POST /api/admin/team-leads
Create a team lead.

**Request Body**:
```json
{
  "email": "teamlead1@vit.ac.in"
}
```

**Response**:
```json
{
  "id": 2,
  "email": "teamlead1@vit.ac.in",
  "role": "team_lead",
  "created_at": "2026-02-12T07:00:00.000Z"
}
```

### GET /api/admin/team-leads
Get all team leads with their team info.

**Response**:
```json
[
  {
    "id": 2,
    "email": "teamlead1@vit.ac.in",
    "role": "team_lead",
    "created_at": "2026-02-12T07:00:00.000Z",
    "team_name": "Team Alpha",
    "team_code": "ABC12345",
    "team_type": "innocent"
  }
]
```

### POST /api/admin/generate-cards
Generate assignment cards (innocent/traitor).

**Request Body**:
```json
{
  "num_innocents": 15,
  "num_traitors": 5
}
```

**Response**:
```json
[
  {
    "card_id": "550e8400-e29b-41d4-a716-446655440000",
    "team_type": "innocent",
    "qr_code_image": "data:image/png;base64,iVBORw0KG..."
  },
  {
    "card_id": "660e8400-e29b-41d4-a716-446655440001",
    "team_type": "traitor",
    "qr_code_image": "data:image/png;base64,iVBORw0KG..."
  }
]
```

### GET /api/admin/leaderboard
Get current leaderboard.

**Response**:
```json
[
  {
    "id": 1,
    "team_name": "Team Alpha",
    "team_type": "innocent",
    "total_score": 450,
    "member_count": "4"
  },
  {
    "id": 2,
    "team_name": "Team Beta",
    "team_type": "traitor",
    "total_score": 300,
    "member_count": "3"
  }
]
```

### GET /api/admin/teams/by-type
Get teams grouped by type.

**Response**:
```json
{
  "innocents": [
    {
      "id": 1,
      "team_name": "Team Alpha",
      "team_code": "ABC12345",
      "total_score": 450
    }
  ],
  "traitors": [
    {
      "id": 2,
      "team_name": "Team Beta",
      "team_code": "DEF67890",
      "total_score": 300
    }
  ]
}
```

### PUT /api/admin/game-settings
Update game settings.

**Request Body**:
```json
{
  "total_rounds": 4,
  "round_duration": 600,
  "sabotage_duration": 60,
  "sabotage_cooldown": 120,
  "sabotage_same_person_cooldown": 300
}
```

**Response**:
```json
{
  "id": 1,
  "current_round": 0,
  "total_rounds": 4,
  "round_duration": 600,
  "round_start_time": null,
  "round_end_time": null,
  "sabotage_duration": 60,
  "sabotage_cooldown": 120,
  "sabotage_same_person_cooldown": 300,
  "game_status": "not_started",
  "created_at": "2026-02-12T07:00:00.000Z",
  "updated_at": "2026-02-12T07:05:00.000Z"
}
```

### GET /api/admin/game-settings
Get current game settings.

**Response**: Same as PUT response above.

### POST /api/admin/start-round
Start a new round.

**Response**:
```json
{
  "round": 1,
  "start_time": "2026-02-12T07:00:00.000Z",
  "end_time": "2026-02-12T07:10:00.000Z"
}
```

**Socket Event Emitted**: `round_started` to all clients

### POST /api/admin/reset-game
Reset the entire game.

**Response**:
```json
{
  "message": "Game reset successfully"
}
```

**Socket Event Emitted**: `game_reset` to all clients

---

## Team Endpoints

### POST /api/team/scan-assignment
Scan assignment card (team lead only).

**Request Body**:
```json
{
  "card_data": "{\"type\":\"team_assignment\",\"team_type\":\"innocent\",\"card_id\":\"abc123\"}"
}
```

**Response**:
```json
{
  "team_type": "innocent",
  "card_id": "abc123"
}
```

### POST /api/team/create
Create a team (team lead only).

**Request Body**:
```json
{
  "team_name": "Team Alpha",
  "team_type": "innocent"
}
```

**Response**:
```json
{
  "id": 1,
  "team_name": "Team Alpha",
  "team_code": "ABC12345",
  "team_type": "innocent",
  "total_score": 0,
  "team_lead_id": 2,
  "created_at": "2026-02-12T07:00:00.000Z",
  "qr_code_image": "data:image/png;base64,iVBORw0KG..."
}
```

### POST /api/team/join
Join a team.

**Request Body** (option 1 - team code):
```json
{
  "team_code": "ABC12345"
}
```

**Request Body** (option 2 - QR data):
```json
{
  "qr_data": "{\"type\":\"team_join\",\"team_id\":1,\"team_code\":\"ABC12345\"}"
}
```

**Response**:
```json
{
  "team_id": 1,
  "team_name": "Team Alpha",
  "team_type": "innocent",
  "team_code": "ABC12345"
}
```

### GET /api/team/my-team
Get current user's team info.

**Response**:
```json
{
  "id": 1,
  "team_name": "Team Alpha",
  "team_code": "ABC12345",
  "team_type": "innocent",
  "total_score": 450,
  "team_lead_id": 2,
  "created_at": "2026-02-12T07:00:00.000Z",
  "members": [
    {
      "id": 2,
      "email": "teamlead1@vit.ac.in",
      "role": "team_lead",
      "is_lead": true
    },
    {
      "id": 3,
      "email": "member1@vit.ac.in",
      "role": "member",
      "is_lead": false
    }
  ]
}
```

### GET /api/team/current-clue
Get current clue for team.

**Response**:
```json
{
  "current_clue_text": "Where books meet knowledge",
  "clue_location_name": "Library Entrance"
}
```

### POST /api/team/scan-gold-bar
Scan a gold bar QR code.

**Request Body**:
```json
{
  "qr_code": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response** (success):
```json
{
  "success": true,
  "message": "Gold bar collected!",
  "points": 100,
  "next_clue": "Seek the place where students gather"
}
```

**Response** (already scanned):
```json
{
  "success": false,
  "message": "This gold bar has already been collected",
  "points": 0
}
```

**Response** (sabotaged):
```json
{
  "success": false,
  "message": "Your team is sabotaged!",
  "sabotage_end_time": "2026-02-12T07:05:00.000Z",
  "points": 0
}
```

**Socket Events Emitted**:
- `leaderboard_update` to all clients
- `score_update` to team room

### GET /api/team/members
Get team members (team lead only).

**Response**:
```json
[
  {
    "id": 2,
    "email": "teamlead1@vit.ac.in",
    "role": "team_lead",
    "is_lead": true,
    "joined_at": "2026-02-12T07:00:00.000Z"
  },
  {
    "id": 3,
    "email": "member1@vit.ac.in",
    "role": "member",
    "is_lead": false,
    "joined_at": "2026-02-12T07:01:00.000Z"
  }
]
```

---

## Game Endpoints

### GET /api/game/state
Get current game state.

**Response**:
```json
{
  "id": 1,
  "current_round": 1,
  "total_rounds": 4,
  "round_duration": 600,
  "round_start_time": "2026-02-12T07:00:00.000Z",
  "round_end_time": "2026-02-12T07:10:00.000Z",
  "sabotage_duration": 60,
  "sabotage_cooldown": 120,
  "sabotage_same_person_cooldown": 300,
  "game_status": "in_progress",
  "created_at": "2026-02-12T06:00:00.000Z",
  "updated_at": "2026-02-12T07:00:00.000Z"
}
```

### GET /api/game/leaderboard
Get current leaderboard (same as admin leaderboard).

### POST /api/game/sabotage
Sabotage an innocent team (traitors only).

**Request Body**:
```json
{
  "target_team_id": 1
}
```

**Response** (success):
```json
{
  "message": "Sabotage successful",
  "sabotage_end_time": "2026-02-12T07:05:00.000Z",
  "duration": 60
}
```

**Response** (cooldown):
```json
{
  "message": "You must wait 45 seconds before sabotaging again",
  "remaining_time": 45
}
```

**Socket Event Emitted**: `sabotaged` to target team room

### GET /api/game/innocent-teams
Get list of innocent teams (traitors only).

**Response**:
```json
[
  {
    "id": 1,
    "team_name": "Team Alpha",
    "total_score": 450,
    "member_count": "4",
    "is_sabotaged": false
  },
  {
    "id": 3,
    "team_name": "Team Gamma",
    "total_score": 200,
    "member_count": "3",
    "is_sabotaged": true
  }
]
```

### GET /api/game/sabotage-status
Check if current team is sabotaged.

**Response** (sabotaged):
```json
{
  "is_sabotaged": true,
  "sabotage_end_time": "2026-02-12T07:05:00.000Z"
}
```

**Response** (not sabotaged):
```json
{
  "is_sabotaged": false
}
```

### GET /api/game/sabotage-cooldown
Get sabotage cooldown info (traitors only).

**Response**:
```json
{
  "can_sabotage": false,
  "remaining_time": 45
}
```

---

## Socket.IO Events

### Client → Server

#### join_team
Join a team room for real-time updates.

```javascript
socket.emit('join_team', teamId);
```

#### join_admin
Join admin room for real-time updates.

```javascript
socket.emit('join_admin');
```

### Server → Client

#### leaderboard_update
Leaderboard has been updated.

```javascript
socket.on('leaderboard_update', (teams) => {
  // teams is array of team objects with scores
});
```

#### score_update
Team score has been updated.

```javascript
socket.on('score_update', (data) => {
  // data: { points, total_score, next_clue }
});
```

#### sabotaged
Team has been sabotaged.

```javascript
socket.on('sabotaged', (data) => {
  // data: { sabotage_end_time, duration }
});
```

#### sabotage_ended
Sabotage has ended.

```javascript
socket.on('sabotage_ended', () => {
  // Sabotage is over
});
```

#### round_started
New round has started.

```javascript
socket.on('round_started', (data) => {
  // data: { round, start_time, end_time }
});
```

#### game_reset
Game has been reset.

```javascript
socket.on('game_reset', () => {
  // Game state cleared
});
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

OR

```json
{
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Master admin only."
}
```

OR

```json
{
  "message": "Invalid VIT email domain"
}
```

OR

```json
{
  "message": "User not registered"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message describing the issue"
}
```

---

## Rate Limiting

Currently not implemented. Recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

## CORS

Currently allows all origins in development. For production, restrict to:
- Frontend domain only
- Specific allowed origins

## Authentication Flow

1. User logs in with Firebase (frontend)
2. Firebase returns ID token
3. Frontend sends token in Authorization header
4. Backend verifies token with Firebase Admin SDK
5. Backend checks VIT email domain
6. Backend checks user exists in database
7. Backend returns user info or error

---

**Last Updated**: February 12, 2026
