import { useEffect, useState, useRef } from "react";
import { sessionsApi } from "../api/sessions";
import {
  disconnectUserFromStreamVideoClient,
  initStreamVideoClient,
} from "../lib/stream";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

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

  // refs to track cleanup state
  const videoCallRef = useRef(null);
  const chatClientRef = useRef(null);

  useEffect(() => {
    const initCall = async () => {
      if (!session?.callId || (!isHost && !isParticipant)) return;

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

        // 3. Initialize video client
        const client = await initStreamVideoClient(
          { id: userClerkId, name: username, image: userAvatarUrl },
          streamToken
        );
        setStreamVideoClient(client);

        // 4. Join video call
        const videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });
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

        toast.success("Connected to session!");
      } catch (error) {
        console.error("Stream initialization error:", error);
        setStreamError(error.message);
        toast.error("Failed to join the call. Please refresh and try again.");
      } finally {
        setIsInitializingCall(false);
      }
    };

    if (!sessionDataLoading && session) {
      initCall();
    }

    return () => {
      const cleanup = async () => {
        try {
          if (videoCallRef.current) {
            await videoCallRef.current.leave();
            videoCallRef.current = null;
          }

          if (chatClientRef.current) {
            await chatClientRef.current.disconnectUser();
            chatClientRef.current = null;
          }

          await disconnectUserFromStreamVideoClient();
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
