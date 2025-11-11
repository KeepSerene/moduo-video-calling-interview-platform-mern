# Moduo

# Stream.io Setup - Key Takeaways & Best Practices

## ✅ What You Got Right

1. **Separation of concerns**: Backend handles privileged operations, frontend handles user-facing operations
2. **Singleton pattern** for video client in frontend - prevents multiple connections
3. **Using same callId** for both video call and chat channel - clean and logical
4. **Token generation on backend** - keeps secrets secure
5. **Refetch interval** for session data - keeps UI in sync

## 🔧 What Needs Improvement

### 1. **Camera/Microphone Permissions** (CRITICAL)

**Problem**: No handling for when user denies permissions or has no camera

**Solution**: Check permissions BEFORE initializing Stream

```javascript
await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
```

### 2. **Cleanup Function in useEffect**

**Problem**: Async IIFE in cleanup won't complete before component unmounts

**Solution**: Use refs to track resources and cleanup synchronously

```javascript
const videoCallRef = useRef(null);
// ... in cleanup
if (videoCallRef.current) {
  videoCallRef.current.leave(); // synchronous call
}
```

### 3. **Race Condition in Auto-Join**

**Problem**: Multiple effect triggers could cause duplicate join attempts

**Solution**: Use a ref to track join status

```javascript
const hasJoined = useRef(false);
if (hasJoined.current) return;
hasJoined.current = true;
```

### 4. **Missing Error UI States**

**Problem**: User sees nothing when Stream initialization fails

**Solution**: Return error states from hook and display them

```javascript
const { streamError, hasMediaPermissions } = useStream(...);
// Show error banners in UI
```

## 📊 Stream Architecture in Your App

### Backend Responsibilities (Server SDK)

- ✅ Create video calls with `streamClient.video.call().getOrCreate()`
- ✅ Create chat channels with `chatClient.channel().create()`
- ✅ Generate user tokens with `chatClient.createToken()`
- ✅ Delete calls/channels with `.delete({ hard: true })`
- ✅ Add members to channels

**Why backend?** Requires API secret - never expose to browser!

### Frontend Responsibilities (Client SDK)

- ✅ Connect user to video client with token
- ✅ Join existing video calls
- ✅ Connect user to chat with token
- ✅ Watch chat channels
- ✅ Render video/chat UI
- ✅ Leave calls on cleanup

**Why frontend?** User-scoped operations with limited token

## 🔐 Security Flow

```
User requests to join
     ↓
Frontend: "I need a token for userX"
     ↓
Backend: Verifies user with Clerk → Generates Stream token → Returns token
     ↓
Frontend: Uses token to connect to Stream (video + chat)
     ↓
Stream API: Validates token → Allows connection
```

**Key insight**: Token is short-lived and user-specific, generated fresh for each session

## 🎯 Best Practices Applied

### Error Handling Strategy

```javascript
// ✅ GOOD: Specific, actionable messages
toast.error("Camera access denied. Please enable in browser settings.");

// ❌ BAD: Generic, unhelpful
toast.error("Failed to join call");
```

### Cleanup Pattern

```javascript
// ✅ GOOD: Use refs for async resources
const resourceRef = useRef(null);
return () => {
  cleanup(); // sync function that handles async
};

// ❌ BAD: Async IIFE in cleanup
return () => {
  (async () => {
    await cleanup();
  })(); // won't complete!
};
```

### Permission Checking

```javascript
// ✅ GOOD: Check BEFORE initializing
try {
  await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  // Proceed with Stream initialization
} catch (error) {
  // Handle gracefully - offer audio-only mode
}

// ❌ BAD: Let Stream fail and hope for the best
```

## 🧪 Testing Scenarios to Cover

1. **No camera connected**: Should allow audio-only
2. **Camera permission denied**: Should show clear error with instructions
3. **Network disconnect**: Should handle reconnection gracefully
4. **Host ends session**: Participant should be notified and redirected
5. **Participant leaves**: Host should see updated participant count
6. **Multiple tabs**: Should prevent duplicate connections

## 📝 Recommended Next Steps

1. **Add device selection UI**: Let users choose camera/microphone
2. **Add reconnection logic**: Handle temporary network drops
3. **Add screen sharing**: Stream supports this out of the box
4. **Add recording**: Stream can record calls server-side
5. **Add presence indicators**: Show when users are typing in chat
6. **Add call quality indicators**: Stream provides network quality stats

## 💡 Common Pitfalls to Avoid

1. **Don't create new client on every render**: Use singleton pattern
2. **Don't forget to cleanup**: Always leave calls and disconnect users
3. **Don't expose API secret**: Only use it on backend
4. **Don't assume camera exists**: Always check permissions first
5. **Don't ignore Stream events**: They provide useful info (user joined, left, etc.)

## 🎓 Mental Model

Think of Stream.io like a restaurant:

- **Backend (Server SDK)**: The manager who creates reservations (calls/channels) and gives out keys (tokens)
- **Frontend (Client SDK)**: The customer who uses their key (token) to enter and participate
- **Stream API**: The restaurant building that validates keys and provides the space
- **Token**: Your reservation confirmation - proves you're allowed to be there

The manager (backend) has full access, customers (frontend) only have access to their specific reservation!

sequenceDiagram
participant User
participant Frontend
participant Backend
participant MongoDB
participant StreamAPI

    Note over User,StreamAPI: 1. SESSION CREATION (Host)

    User->>Frontend: Click "Create Session"
    Frontend->>Backend: POST /api/sessions
    Backend->>MongoDB: Create Session document
    Backend->>StreamAPI: Create video call (with secret)
    Backend->>StreamAPI: Create chat channel (with secret)
    Backend-->>Frontend: Return session data
    Frontend-->>User: Show session created

    Note over User,StreamAPI: 2. SESSION JOIN (Participant)

    User->>Frontend: Navigate to /sessions/:id
    Frontend->>Backend: GET /api/sessions/:id
    Backend->>MongoDB: Fetch session
    Backend-->>Frontend: Return session data

    Frontend->>Frontend: Check if user is host/participant

    alt User is neither host nor participant
        Frontend->>Backend: POST /api/sessions/:id/join
        Backend->>MongoDB: Update session.participantId
        Backend->>StreamAPI: Add user to chat channel
        Backend-->>Frontend: Return updated session
    end

    Note over User,StreamAPI: 3. STREAM INITIALIZATION

    Frontend->>Backend: GET /api/chats/token
    Note over Backend: Generate token with<br/>user's Clerk ID using<br/>chatClient.createToken()
    Backend-->>Frontend: Return { streamToken, userClerkId, username, avatar }

    Frontend->>Frontend: initStreamVideoClient(user, token)
    Note over Frontend: Store videoClient in memory<br/>(singleton pattern)

    Frontend->>StreamAPI: Connect video client
    StreamAPI-->>Frontend: Video client connected

    Frontend->>StreamAPI: call.join({ create: true })
    Note over Frontend,StreamAPI: Join video call using callId<br/>from session
    StreamAPI-->>Frontend: Joined video call

    Frontend->>StreamAPI: StreamChat.connectUser(user, token)
    StreamAPI-->>Frontend: Chat user connected

    Frontend->>StreamAPI: channel.watch()
    Note over Frontend,StreamAPI: Watch chat channel using<br/>same callId as channel ID
    StreamAPI-->>Frontend: Channel ready

    Frontend-->>User: Show video call + chat UI

    Note over User,StreamAPI: 4. SESSION END (Host only)

    User->>Frontend: Click "End Session"
    Frontend->>Backend: POST /api/sessions/:id/end
    Backend->>StreamAPI: Delete video call (hard delete)
    Backend->>StreamAPI: Delete chat channel (hard delete)
    Backend->>MongoDB: Update session.status = "completed"
    Backend-->>Frontend: Session ended

    Frontend->>StreamAPI: call.leave()
    Frontend->>StreamAPI: chatClient.disconnectUser()
    Frontend->>Frontend: videoClient.disconnectUser()

    Frontend->>Frontend: Navigate to /dashboard
    Frontend-->>User: Show dashboard
