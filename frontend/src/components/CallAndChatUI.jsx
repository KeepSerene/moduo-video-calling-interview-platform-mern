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
import { useState } from "react";
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

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full text-center flex items-center justify-center">
        <Loader2 className="size-12 text-primary mx-auto mb-4 animate-spin" />
        <p className="text-lg">Joining call...</p>
      </div>
    );
  }

  return (
    <div className="str-video h-full flex gap-3 relative">
      <div className="flex-1 flex flex-col gap-3">
        {/* Participant count badge and chat toggler */}
        <div className="bg-base-100 rounded-lg p-3 shadow flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Users2 className="size-5 text-primary" />

            <span className="font-semibold">
              {participantCount}{" "}
              {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>

          {chatClient && chatChannel && (
            <button
              type="button"
              onClick={() => setIsChatOpen(!isChatOpen)}
              aria-label={isChatOpen ? "Hide chat" : "Open chat"}
              title={isChatOpen ? "Hide chat" : "Open chat"}
              className={`btn ${
                isChatOpen ? "btn-primary" : "btn-ghost"
              } btn-sm`}
            >
              <MessageSquareCode className="size-4" />
              Chat
            </button>
          )}
        </div>

        {/* Video call UI */}
        <div className="flex-1 bg-base-300 rounded-lg overflow-hidden relative">
          <SpeakerLayout />
        </div>

        <div className="bg-base-100 rounded-lg p-3 shadow flex justify-center items-center">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* Chat UI */}
      {chatClient && chatChannel && (
        <div
          className={`${
            isChatOpen ? "w-80 opacity-100" : "w-0 opacity-0"
          } bg-[#272a30] rounded-lg shadow overflow-hidden  flex flex-col transition-all duration-300 ease-in-out`}
        >
          {isChatOpen && (
            <>
              <section className="bg-[#1c1e22] border-b border-[#3a3d44] p-3 flex justify-between items-center">
                <h3 className="text-white font-semibold">Session Chat</h3>

                <button
                  type="button"
                  onClick={() => setIsChatOpen(false)}
                  aria-label="Close chat"
                  title="Close chat"
                  className="text-gray-400 transition-colors hover:text-white focus-visible:text-white"
                >
                  <X className="size-5" />
                </button>
              </section>

              <div className="flex-1 stream-chat-dark overflow-hidden">
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
    </div>
  );
}

export default CallAndChatUI;
