# 🎯 MAJOR FEATURE ADDITIONS - IMPLEMENTATION PLAN

## 📋 **New Requirements Summary**

### **1. Admin Dashboard Enhancements**
- ✅ Add DELETE buttons for Locations (DONE - backend ready)
- ✅ Add DELETE buttons for Gold Bars (DONE - backend ready)
- ❌ Add DELETE buttons for Team Leads (NEW)
- ❌ Add "Participants Manager" - View all logged-in users
- ❌ Promote users to Team Lead
- ❌ Remove users from game
- ❌ Add "Teams Manager" - View all teams with members
- ❌ Disqualify teams

### **2. Authentication System Overhaul**
- ❌ Add Social Login (Google) for players
- ❌ Restrict to @vit.ac.in email only
- ❌ Track all logged-in participants
- ❌ Remove spectator view for logged-in students

### **3. Student Portal (Complete New Build)**
- ❌ Landing page: "Wait for Team Reveal"
- ❌ Team Lead QR scan flow
- ❌ Team name entry
- ❌ Team type reveal (Innocent/Traitor)
- ❌ Dynamic UI theming (Blue for Innocent, Red for Traitor)
- ❌ Team QR code generation for Team Lead
- ❌ Member join flow via QR scan
- ❌ Team dashboard

---

## 🏗️ **Implementation Phases**

### **PHASE 1: Admin Dashboard Completion** ⏱️ 30 mins
1. Add delete functionality to UI components
2. Create Participants Manager component
3. Create Teams Manager component
4. Add promote/remove/disqualify actions

### **PHASE 2: Authentication Enhancement** ⏱️ 45 mins
1. Set up Google OAuth with Firebase
2. Add email domain restriction
3. Update user tracking system
4. Modify role assignment logic

### **PHASE 3: Student Portal Foundation** ⏱️ 1 hour
1. Create student dashboard structure
2. Build team reveal flow
3. Implement QR scanning for team formation
4. Create dynamic theming system

### **PHASE 4: Team Management** ⏱️ 45 mins
1. Team creation and QR generation
2. Member joining system
3. Team dashboard UI
4. Real-time team updates

---

## 📊 **Database Schema Changes Needed**

### **New Tables:**
```sql
-- Participants tracking
CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    is_disqualified BOOLEAN DEFAULT false,
    logged_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Modified Tables:**
```sql
-- Add to teams table
ALTER TABLE teams ADD COLUMN is_disqualified BOOLEAN DEFAULT false;
ALTER TABLE teams ADD COLUMN team_qr_code VARCHAR(255) UNIQUE;

-- Add to users table
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);
ALTER TABLE users ADD COLUMN photo_url TEXT;
ALTER TABLE users ADD COLUMN is_removed BOOLEAN DEFAULT false;
```

---

## 🎨 **New Components Needed**

### **Admin Components:**
1. `ParticipantsManager.tsx` - View/manage all participants
2. `TeamsManager.tsx` - View all teams with members
3. Delete buttons for existing managers

### **Student Components:**
1. `StudentDashboard.tsx` - Main student portal
2. `TeamRevealWaiting.tsx` - Waiting screen
3. `TeamLeadQRScan.tsx` - QR scan for team leads
4. `TeamNameEntry.tsx` - Team name input
5. `TeamReveal.tsx` - Reveal innocent/traitor
6. `TeamDashboard.tsx` - Team main view
7. `JoinTeamQRScan.tsx` - For members to join
8. `ThemeProvider.tsx` - Dynamic theming

---

## 🔄 **User Flow Diagrams**

### **Team Lead Flow:**
```
Login (Google @vit.ac.in)
    ↓
Wait for Team Reveal Screen
    ↓
Admin promotes to Team Lead
    ↓
Scan Assignment QR Code
    ↓
Enter Team Name
    ↓
Team Type Revealed (Innocent/Traitor)
    ↓
UI Changes Color (Blue/Red)
    ↓
Team QR Code Generated
    ↓
Team Dashboard
```

### **Team Member Flow:**
```
Login (Google @vit.ac.in)
    ↓
Wait for Team Reveal Screen
    ↓
Scan Team QR Code (from Team Lead)
    ↓
Join Team
    ↓
UI Changes Color (Blue/Red)
    ↓
Team Dashboard
```

### **Admin Flow:**
```
View Participants
    ↓
Promote to Team Lead / Remove from Game
    ↓
View Teams
    ↓
Disqualify Team (if cheating)
```

---

## 🚀 **Priority Order**

### **IMMEDIATE (Do First):**
1. ✅ Add delete buttons to existing managers (UI only)
2. ✅ Create Participants Manager
3. ✅ Create Teams Manager

### **HIGH PRIORITY:**
4. Set up Google OAuth
5. Build student portal foundation
6. Implement team reveal flow

### **MEDIUM PRIORITY:**
7. Dynamic theming system
8. Team QR generation
9. Member joining system

### **POLISH:**
10. Real-time updates
11. Animations
12. Error handling

---

## ⚠️ **Important Notes**

1. **Google OAuth Setup Required:**
   - Need to create Google Cloud Project
   - Enable Google Sign-In in Firebase Console
   - Add authorized domains

2. **Email Restriction:**
   - Implement server-side validation for @vit.ac.in
   - Reject non-VIT emails

3. **QR Code System:**
   - Assignment cards (already exists)
   - Team QR codes (new - for members to join)

4. **UI Theming:**
   - Need to create two theme variants
   - Switch based on team type
   - Persist across sessions

5. **Real-time Updates:**
   - Use Socket.IO for:
     - Team formation
     - Member joins
     - Team disqualification
     - Participant status changes

---

## 📝 **Estimated Timeline**

- **Phase 1 (Admin UI)**: 30-45 minutes
- **Phase 2 (Auth)**: 45-60 minutes
- **Phase 3 (Student Portal)**: 1-1.5 hours
- **Phase 4 (Team Management)**: 45-60 minutes
- **Testing & Polish**: 30 minutes

**Total: 3.5 - 4.5 hours**

---

## 🎯 **Let's Start!**

I'll begin with **Phase 1** - completing the admin dashboard with delete buttons and new managers.

**Ready to proceed?**
