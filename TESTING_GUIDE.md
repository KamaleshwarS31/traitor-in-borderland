# Quick Start Guide - Testing the Backend

## Prerequisites
- Backend server running on port 5000
- Database initialized
- Postman or similar API testing tool

## 1. Test Health Check

```bash
GET http://localhost:5000/health
```

Expected Response:
```json
{
  "status": "ok"
}
```

## 2. Create Master Admin Session

First, you need to authenticate with Firebase and get a token. For testing, you can use the Firebase Auth REST API or the Firebase console.

## 3. Test Admin Endpoints

### Create Location

```bash
POST http://localhost:5000/api/admin/locations
Authorization: Bearer YOUR_FIREBASE_TOKEN
Content-Type: application/json

{
  "location_name": "Library Entrance",
  "description": "Main entrance of the library building"
}
```

### Get All Locations

```bash
GET http://localhost:5000/api/admin/locations
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

### Create Gold Bar

```bash
POST http://localhost:5000/api/admin/gold-bars
Authorization: Bearer YOUR_FIREBASE_TOKEN
Content-Type: application/json

{
  "points": 100,
  "location_id": 1,
  "clue_text": "Where books meet knowledge, seek the golden treasure",
  "clue_location_id": 2
}
```

### Generate Assignment Cards

```bash
POST http://localhost:5000/api/admin/generate-cards
Authorization: Bearer YOUR_FIREBASE_TOKEN
Content-Type: application/json

{
  "num_innocents": 15,
  "num_traitors": 5
}
```

This will return 20 cards with QR code images (base64 data URLs).

### Create Team Lead

```bash
POST http://localhost:5000/api/admin/team-leads
Authorization: Bearer YOUR_FIREBASE_TOKEN
Content-Type: application/json

{
  "email": "teamlead1@vit.ac.in"
}
```

### Get Game Settings

```bash
GET http://localhost:5000/api/admin/game-settings
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

### Update Game Settings

```bash
PUT http://localhost:5000/api/admin/game-settings
Authorization: Bearer YOUR_FIREBASE_TOKEN
Content-Type: application/json

{
  "total_rounds": 4,
  "round_duration": 600,
  "sabotage_duration": 60,
  "sabotage_cooldown": 120,
  "sabotage_same_person_cooldown": 300
}
```

### Start Round

```bash
POST http://localhost:5000/api/admin/start-round
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

### Get Leaderboard

```bash
GET http://localhost:5000/api/admin/leaderboard
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

### Get Teams by Type

```bash
GET http://localhost:5000/api/admin/teams/by-type
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

### Reset Game

```bash
POST http://localhost:5000/api/admin/reset-game
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

## 4. Test Team Lead Endpoints

### Scan Assignment Card

```bash
POST http://localhost:5000/api/team/scan-assignment
Authorization: Bearer TEAM_LEAD_FIREBASE_TOKEN
Content-Type: application/json

{
  "card_data": "{\"type\":\"team_assignment\",\"team_type\":\"innocent\",\"card_id\":\"abc123\"}"
}
```

### Create Team

```bash
POST http://localhost:5000/api/team/create
Authorization: Bearer TEAM_LEAD_FIREBASE_TOKEN
Content-Type: application/json

{
  "team_name": "Team Alpha",
  "team_type": "innocent"
}
```

Response includes team QR code image.

### Get My Team

```bash
GET http://localhost:5000/api/team/my-team
Authorization: Bearer TEAM_MEMBER_FIREBASE_TOKEN
```

### Get Current Clue

```bash
GET http://localhost:5000/api/team/current-clue
Authorization: Bearer TEAM_MEMBER_FIREBASE_TOKEN
```

### Scan Gold Bar

```bash
POST http://localhost:5000/api/team/scan-gold-bar
Authorization: Bearer TEAM_MEMBER_FIREBASE_TOKEN
Content-Type: application/json

{
  "qr_code": "gold-bar-uuid-here"
}
```

## 5. Test Member Endpoints

### Register Member

```bash
POST http://localhost:5000/api/auth/register-member
Authorization: Bearer MEMBER_FIREBASE_TOKEN
```

### Join Team

```bash
POST http://localhost:5000/api/team/join
Authorization: Bearer MEMBER_FIREBASE_TOKEN
Content-Type: application/json

{
  "team_code": "ABC12345"
}
```

OR with QR data:

```json
{
  "qr_data": "{\"type\":\"team_join\",\"team_id\":1,\"team_code\":\"ABC12345\"}"
}
```

## 6. Test Traitor Endpoints

### Get Innocent Teams

```bash
GET http://localhost:5000/api/game/innocent-teams
Authorization: Bearer TRAITOR_FIREBASE_TOKEN
```

### Sabotage Team

```bash
POST http://localhost:5000/api/game/sabotage
Authorization: Bearer TRAITOR_FIREBASE_TOKEN
Content-Type: application/json

{
  "target_team_id": 2
}
```

### Check Sabotage Cooldown

```bash
GET http://localhost:5000/api/game/sabotage-cooldown
Authorization: Bearer TRAITOR_FIREBASE_TOKEN
```

## 7. Test Real-Time with Socket.IO

You can use a Socket.IO client or browser console:

```javascript
const socket = io('http://localhost:5000');

// Join as admin
socket.emit('join_admin');

// Join as team
socket.emit('join_team', 1);

// Listen for events
socket.on('leaderboard_update', (data) => {
  console.log('Leaderboard updated:', data);
});

socket.on('sabotaged', (data) => {
  console.log('Team sabotaged:', data);
});

socket.on('round_started', (data) => {
  console.log('Round started:', data);
});
```

## 8. Complete Game Flow Test

1. **Setup** (as Master Admin):
   - Create 3-4 locations
   - Create 10-15 gold bars with clues
   - Create 2-3 team leads
   - Generate 20 assignment cards
   - Update game settings if needed

2. **Team Formation** (as Team Leads):
   - Scan assignment cards
   - Create teams
   - Note team codes

3. **Join Teams** (as Members):
   - Register as members
   - Join teams using codes
   - Verify team membership

4. **Start Game** (as Master Admin):
   - Start round 1
   - Verify timer starts
   - Verify clues assigned

5. **Play Game** (as Team Members):
   - Get current clue
   - Scan gold bars
   - Verify scores update
   - Check leaderboard

6. **Sabotage** (as Traitors):
   - Get innocent teams list
   - Sabotage an innocent team
   - Verify cooldown
   - Verify sabotaged team can't score

7. **End Round** (as Master Admin):
   - Wait for timer or manually end
   - View leaderboard
   - Start next round

8. **Reset** (as Master Admin):
   - Reset game
   - Verify all data cleared

## Common Issues

### 401 Unauthorized
- Check Firebase token is valid
- Verify Authorization header format: `Bearer TOKEN`
- Ensure user exists in database

### 403 Forbidden
- Check user role (master_admin, team_lead, member)
- Verify email domain (@vit.ac.in or @vitstudent.ac.in)
- Ensure user is registered

### 404 Not Found
- Check endpoint URL
- Verify resource exists (team, gold bar, etc.)

### 500 Internal Server Error
- Check server logs
- Verify database connection
- Check request body format

## Useful SQL Queries for Testing

```sql
-- View all users
SELECT * FROM users;

-- View all teams
SELECT * FROM teams;

-- View all gold bars
SELECT * FROM gold_bars;

-- View leaderboard
SELECT team_name, team_type, total_score 
FROM teams 
ORDER BY total_score DESC;

-- View active sabotages
SELECT * FROM sabotages WHERE is_active = TRUE;

-- View game state
SELECT * FROM game_state;
```

## Environment Variables Checklist

Backend (.env):
- ✅ PORT=5000
- ✅ DATABASE_URL=postgresql://...
- ⚠️ FRONTEND_URL=http://localhost:3000

Frontend (.env.local):
- ⚠️ NEXT_PUBLIC_API_URL=http://localhost:5000
- ⚠️ NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
- ⚠️ NEXT_PUBLIC_FIREBASE_API_KEY=...
- ⚠️ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
- ⚠️ NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

## Next Steps

Once backend testing is complete:
1. Build frontend login page
2. Build admin dashboard
3. Build team interfaces
4. Test end-to-end flow
5. Deploy to production

---

Happy Testing! 🎮
