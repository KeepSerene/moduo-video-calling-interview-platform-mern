import { useEffect, useState, useRef } from "react";
import { sessionsApi } from "../api/sessions";
import {
  disconnectUserFromStreamVideoClient,
  initStreamVideoClient,
} from "../lib/stream";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { CallingState } from "@stream-io/video-react-sdk";

const accessKey = import.meta.env.VITE_STREAM_ACCESS_KEY;

if (!accessKey) {
  throw new Error("Stream access/API key is missing!");
}

export default function useStream(
  sessionDataLoading,
  session,
  isHost,
  isParticipant
) {
  const [streamVideoClient, setStreamVideoClient] = useState(null);
  const [streamChatClient, setStreamChatClient] = useState(null);
  const [chatChannel, setChatChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(false);
  const [call, setCall] = useState(null);
  const [streamError, setStreamError] = useState(null);
  const [hasMediaPermissions, setHasMediaPermissions] = useState(true);

  // refs to track cleanup state and prevent duplicate initializations
  const videoCallRef = useRef(null);
  const chatClientRef = useRef(null);
  const isInitializingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    const initCall = async () => {
      // prevent initialization if already in progress or completed
      if (isInitializingRef.current || hasInitializedRef.current) {
        return;
      }

      if (
        !session?.callId ||
        session?.status === "completed" ||
        (!isHost && !isParticipant)
      ) {
        return;
      }

      // mark as initializing
      isInitializingRef.current = true;
      setIsInitializingCall(true);
      setStreamError(null);

      try {
        // 1. Check camera/microphone permissions first
        try {
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setHasMediaPermissions(true);
        } catch (permError) {
          console.warn("Media permissions issue:", permError);
          setHasMediaPermissions(false);

          if (permError.name === "NotAllowedError") {
            toast.error(
              "Camera/microphone access denied. Please enable in browser settings.",
              { duration: 5000 }
            );
          } else if (permError.name === "NotFoundError") {
            toast.error(
              "No camera or microphone found. Audio-only mode recommended.",
              { duration: 5000 }
            );
          }
          // Continue initialization even without camera - Stream supports audio-only
        }

        // 2. Get Stream token
        const { streamToken, userClerkId, username, userAvatarUrl } =
          await sessionsApi.getStreamToken();

        // validate token data
        if (!streamToken || !userClerkId) {
          throw new Error("Invalid Stream token data received");
        }

        // 3. Initialize video client
        const client = await initStreamVideoClient(
          { id: userClerkId, name: username, image: userAvatarUrl },
          streamToken
        );
        setStreamVideoClient(client);

        // 4. Join video call
        const videoCall = client.call("default", session.callId);

        // check if call is already joined before attempting to join
        try {
          await videoCall.join({ create: true });
        } catch (joinError) {
          // if already joined, get or create will handle it
          if (joinError.message && joinError.message.includes("already")) {
            console.log("Call already joined, continuing...");
          } else {
            throw joinError;
          }
        }

        setCall(videoCall);
        videoCallRef.current = videoCall;

        // 5. Initialize chat client
        const chatClient = StreamChat.getInstance(accessKey);
        await chatClient.connectUser(
          { id: userClerkId, name: username, image: userAvatarUrl },
          streamToken
        );
        setStreamChatClient(chatClient);
        chatClientRef.current = chatClient;

        // 6. Watch chat channel
        const channel = chatClient.channel("messaging", session.callId);
        await channel.watch();
        setChatChannel(channel);

        // mark initialization as complete
        hasInitializedRef.current = true;
        toast.success("Connected to session!");
      } catch (error) {
        console.error("Stream initialization error:", error);
        setStreamError(error.message);
        toast.error("Failed to join the call. Please refresh and try again.");

        // reset initialization flag on error to allow retry
        hasInitializedRef.current = false;
      } finally {
        setIsInitializingCall(false);
        isInitializingRef.current = false;
      }
    };

    if (!sessionDataLoading && session) {
      initCall();
    }

    return () => {
      const cleanup = async () => {
        try {
          // leave video call only if it exists and hasn't been left already
          if (videoCallRef.current) {
            try {
              // check call state before attempting to leave
              const callState = videoCallRef.current.state;

              if (callState && callState.callingState !== CallingState.LEFT) {
                await videoCallRef.current.leave();
              }
            } catch (leaveError) {
              console.error("Error leaving call:", leaveError);
            }
            videoCallRef.current = null;
          }

          // disconnect chat client
          if (chatClientRef.current) {
            try {
              await chatClientRef.current.disconnectUser();
            } catch (disconnectError) {
              console.error("Error disconnecting chat:", disconnectError);
            }
            chatClientRef.current = null;
          }

          // disconnect video client
          try {
            await disconnectUserFromStreamVideoClient();
          } catch (videoError) {
            console.error("Error disconnecting video client:", videoError);
          }

          // reset all state
          setStreamVideoClient(null);
          setStreamChatClient(null);
          setChatChannel(null);
          setCall(null);
          hasInitializedRef.current = false;
          isInitializingRef.current = false;
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      };

      cleanup();
    };
  }, [sessionDataLoading, session, isHost, isParticipant]);

  return {
    streamVideoClient,
    streamChatClient,
    chatChannel,
    isInitializingCall,
    call,
    streamError,
    hasMediaPermissions,
  };
}
