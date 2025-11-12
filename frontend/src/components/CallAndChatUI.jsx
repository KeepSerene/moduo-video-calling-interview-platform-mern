// Video call stylesheet
import "@stream-io/video-react-sdk/dist/css/styles.css";
// Chat stylesheet
import "stream-chat-react/dist/css/v2/index.css";

import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2, MessageSquareCode, Users2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Channel,
  Chat,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";

function CallAndChatUI({ chatClient, chatChannel }) {
  const navigate = useNavigate();

  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  const [isChatOpen, setIsChatOpen] = useState(false);

  // State to track if screen is large enough for side-by-side layout
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

  // Handle window resize to adjust layout
  useEffect(() => {
    const handleResize = () => {
      const newIsLargeScreen = window.innerWidth >= 992;
      setIsLargeScreen(newIsLargeScreen);

      // Close chat if screen becomes too small
      if (!newIsLargeScreen && isChatOpen) {
        setIsChatOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isChatOpen]);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full text-center flex items-center justify-center">
        <div>
          <Loader2 className="size-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-lg">Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="str-video h-full flex gap-3 relative">
      {/* Main call section */}
      <div
        className={`flex-1 flex flex-col gap-3 min-w-0 ${
          isChatOpen && isLargeScreen ? "lg:flex-[1.5]" : "flex-1"
        }`}
      >
        {/* Participant count badge and chat toggler */}
        <div className="bg-base-100 rounded-lg p-2.5 sm:p-3 shadow flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Users2 className="size-4 sm:size-5 text-primary shrink-0" />

            <span className="font-semibold text-sm sm:text-base">
              {participantCount}{" "}
              {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>

          {/* Only show chat toggle button if chat is available and screen is large enough */}
          {chatClient && chatChannel && isLargeScreen && (
            <button
              type="button"
              onClick={() => setIsChatOpen(!isChatOpen)}
              aria-label={isChatOpen ? "Hide chat" : "Open chat"}
              title={isChatOpen ? "Hide chat" : "Open chat"}
              className={`btn ${
                isChatOpen ? "btn-primary" : "btn-ghost"
              } btn-xs sm:btn-sm`}
            >
              <MessageSquareCode className="size-3.5 sm:size-4" />
              <span className="hidden sm:inline">Chat</span>
            </button>
          )}
        </div>

        {/* Video call UI */}
        <div className="flex-1 bg-base-300 rounded-lg overflow-hidden relative min-h-0">
          <SpeakerLayout />
        </div>

        {/* Call controls */}
        <div className="bg-base-100 rounded-lg p-2.5 sm:p-3 shadow flex justify-center items-center">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* Chat UI - only render if screen is large enough */}
      {chatClient && chatChannel && isLargeScreen && (
        <div
          className={`${
            isChatOpen ? "w-64 sm:w-72 lg:w-80 opacity-100" : "w-0 opacity-0"
          } bg-[#272a30] rounded-lg shadow overflow-hidden flex flex-col transition-all duration-300 ease-in-out shrink-0`}
        >
          {isChatOpen && (
            <>
              {/* Chat header */}
              <section className="bg-[#1c1e22] border-b border-[#3a3d44] p-2.5 sm:p-3 flex justify-between items-center shrink-0">
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  Session Chat
                </h3>

                <button
                  type="button"
                  onClick={() => setIsChatOpen(false)}
                  aria-label="Close chat"
                  title="Close chat"
                  className="text-gray-400 transition-colors hover:text-white focus-visible:text-white"
                >
                  <X className="size-4 sm:size-5" />
                </button>
              </section>

              {/* Chat messages area */}
              <div className="flex-1 stream-chat-dark overflow-hidden min-h-0">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={chatChannel}>
                    <Window>
                      <MessageList />
                      <MessageInput />
                    </Window>

                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}

      {/* Info message for smaller screens */}
      {!isLargeScreen && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-base-100/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-base-300">
          <p className="text-xs text-base-content/70 text-center">
            <MessageSquareCode className="size-3 inline mr-1" />
            Chat available on larger screens
          </p>
        </div>
      )}
    </div>
  );
}

export default CallAndChatUI;
