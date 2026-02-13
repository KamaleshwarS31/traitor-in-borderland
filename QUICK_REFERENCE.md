# 🎮 ADMIN DASHBOARD - QUICK REFERENCE

## 🔐 LOGIN CREDENTIALS

**URL:** http://localhost:3000/login

**Email:** `admin@vit.ac.in`  
**Password:** `Admin@123`

⚠️ **IMPORTANT:** Create this user in Firebase Authentication first!

---

## 🔥 FIREBASE SETUP (ONE-TIME)

1. Go to https://console.firebase.google.com/
2. Select project: "traitor-in-borderland"
3. Authentication → Users → Add user
4. Email: `admin@vit.ac.in`
5. Password: `Admin@123`
6. Click "Add user"

---

## 🎯 ADMIN DASHBOARD TABS

| # | Tab | What It Does |
|---|-----|--------------|
| 1 | **Leaderboard** | Live rankings, real-time scores |
| 2 | **Game Control** | Start rounds, reset game, timer |
| 3 | **Locations** | Create game locations |
| 4 | **Gold Bars** | Create gold bars with QR codes |
| 5 | **Team Leads** | Create team lead accounts |
| 6 | **Assignment Cards** | Generate innocent/traitor cards |
| 7 | **Settings** | Configure rounds & sabotage |

---

## 📋 GAME SETUP CHECKLIST

### ✅ Before the Event:

1. **Create Locations** (Tab 3)
   - Add 8-10 locations around campus
   - Example: Library, Cafeteria, Sports Complex

2. **Create Gold Bars** (Tab 4)
   - Create 15-20 gold bars
   - Set points, location, clue
   - Download QR codes
   - Print and place at locations

3. **Create Team Leads** (Tab 5)
   - Add 20 team lead emails
   - They'll receive login access

4. **Generate Assignment Cards** (Tab 6)
   - 15 Innocent + 5 Traitor = 20 teams
   - Download all cards
   - Print and distribute

5. **Configure Settings** (Tab 7)
   - 4 rounds, 10 minutes each
   - Sabotage: 60s duration, 120s cooldown

### ✅ During the Event:

1. **Start Round** (Tab 2)
   - Click "Start Round 1"
   - Timer begins automatically

2. **Monitor** (Tab 1)
   - Watch live leaderboard
   - See team progress

3. **Between Rounds**
   - Review scores
   - Start next round

4. **End Game**
   - Announce winners
   - Reset for next event

---

## 🚀 SERVERS

**Backend:** http://localhost:5000 ✅  
**Frontend:** http://localhost:3000 ✅

---

## 🎨 FEATURES

- ✅ Real-time leaderboard
- ✅ Live countdown timer
- ✅ QR code generation
- ✅ Assignment card generator
- ✅ Game reset
- ✅ Settings management
- ✅ Team management
- ✅ Location management

---

## 💡 QUICK TIPS

- **Leaderboard updates automatically** via Socket.IO
- **QR codes are unique** - don't reuse them
- **Timer is live** - no refresh needed
- **Reset clears everything** - use with caution
- **Settings can be changed** anytime

---

**Status:** ✅ 100% COMPLETE  
**Last Updated:** Feb 12, 2026
