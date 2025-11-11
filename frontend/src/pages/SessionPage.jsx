import { useNavigate, useParams } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import {
  useEndSession,
  useGetSessionById,
  useJoinSession,
} from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeUserCode } from "../lib/piston";
import {
  CallAndChatUI,
  CodeEditor,
  OutputPanel,
  ProtectedRouteNavbar,
} from "../components";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClassName } from "../lib/utils";
import {
  Clock,
  Database,
  Lightbulb,
  Loader2,
  AlertCircle,
  CameraOff,
  X,
} from "lucide-react";
import useStream from "../hooks/useStream";
import toast from "react-hot-toast";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";

function SessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const hasJoined = useRef(false); // prevent duplicate call joins

  const {
    data: sessionData,
    isLoading: sessionDataLoading,
    refetch: refetchSessionData,
  } = useGetSessionById(sessionId);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session || {};
  const isHost = user?.id === session?.hostId?.clerkId;
  const isParticipant = user?.id === session?.participantId?.clerkId;

  const problem = session?.problemTitle
    ? Object.values(PROBLEMS).find(
        (problem) => problem.title === session?.problemTitle
      )
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [userCode, setUserCode] = useState(
    problem?.starterCode?.[selectedLanguage] || ""
  );
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const {
    streamVideoClient,
    streamChatClient,
    chatChannel,
    isInitializingCall,
    call,
    streamError,
    hasMediaPermissions,
  } = useStream(sessionDataLoading, session, isHost, isParticipant);

  // Auto-join session (with duplicate prevention)
  useEffect(() => {
    if (
      !user ||
      sessionDataLoading ||
      !session ||
      isHost ||
      isParticipant ||
      hasJoined.current
    ) {
      return;
    }

    hasJoined.current = true;
    joinSessionMutation.mutate(sessionId, {
      onSuccess: refetchSessionData,
      onError: () => {
        hasJoined.current = false; // reset on error to allow retry
      },
    });
  }, [user, sessionDataLoading, session, isHost, isParticipant, sessionId]);

  // Update starter code when problem/language changes
  useEffect(() => {
    if (problem?.starterCode?.[selectedLanguage]) {
      setUserCode(problem.starterCode[selectedLanguage]);
    }
  }, [problem, selectedLanguage]);

  // Redirect when session completes
  useEffect(() => {
    if (sessionDataLoading || !session) return;

    if (session.status === "completed") {
      toast("Session has ended", { icon: "👋" });
      navigate("/dashboard");
    }
  }, [sessionDataLoading, session, navigate]);

  const handleLanguageChange = (language) => {
    language = language || "javascript";
    setSelectedLanguage(language);
    setUserCode(problem?.starterCode?.[language] || "");
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      const result = await executeUserCode(selectedLanguage, userCode);
      setOutput(result);
    } catch (error) {
      console.error("Code execution error:", error);
      toast.error("Failed to run code. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleEndSession = () => {
    if (!confirm("End this session? The participant will also be notified.")) {
      return;
    }

    endSessionMutation.mutate(sessionId, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  return (
    <main className="h-screen bg-base-100 flex flex-col">
      <ProtectedRouteNavbar />

      {/* Stream initialization error banner */}
      {streamError && (
        <div className="bg-error/10 border-b border-error/20 p-3">
          <div className="container mx-auto flex items-center gap-2 text-error">
            <AlertCircle className="size-5" />

            <p className="text-sm">
              Connection issue: {streamError}. Try refreshing the page.
            </p>
          </div>
        </div>
      )}

      {/* Camera permission warning */}
      {!hasMediaPermissions && !streamError && (
        <div className="bg-warning/10 border-b border-warning/20 p-3">
          <div className="container mx-auto flex items-center gap-2 text-warning">
            <CameraOff className="size-5" />

            <p className="text-sm">
              Camera/microphone not accessible. Using audio-only mode.
            </p>
          </div>
        </div>
      )}

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* Left panel - problem details and code editor */}
          <Panel defaultSize={50} minSize={30} maxSize={70}>
            <PanelGroup direction="vertical">
              {/* Top panel - problem description */}
              <Panel defaultSize={50} minSize={10} maxSize={90}>
                <article className="h-full bg-base-200 overflow-y-auto">
                  {/* Header */}
                  <header className="bg-base-100 border-b border-base-300 p-6">
                    <div className="mb-3 flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <h1 className="text-base-content text-3xl font-bold">
                          {session?.problemTitle || "Problem"}
                        </h1>

                        {problem?.category && (
                          <p className="text-base-content/60 mt-1">
                            {problem.category}
                          </p>
                        )}

                        <p className="text-base-content/60 mt-2">
                          Host: {session?.hostId?.name || "User"} &bull;{" "}
                          {session?.participantId
                            ? "2/2 participants"
                            : "1/2 participant"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`badge badge-lg capitalize ${getDifficultyBadgeClassName(
                            session?.difficulty
                          )}`}
                        >
                          {session?.difficulty || "Easy"}
                        </span>

                        {isHost && session?.status === "active" && (
                          <button
                            type="button"
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="btn btn-error btn-sm gap-0.5"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <X className="size-4" />
                            )}
                            End Session
                          </button>
                        )}

                        {session?.status === "completed" && (
                          <span className="badge badge-ghost badge-lg">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </header>

                  <div className="p-6 space-y-6">
                    {/* Description */}
                    {problem?.description && (
                      <section className="bg-base-100 border border-base-300 rounded-xl p-4 sm:p-5 shadow-sm">
                        <h2 className="text-base-content text-lg sm:text-xl font-semibold mb-1">
                          Description
                        </h2>

                        <div className="text-base-content/90 leading-relaxed space-y-3 text-sm sm:text-base">
                          <p>{problem.description?.text || ""}</p>

                          {problem?.description?.notes &&
                            problem.description.notes.length > 0 && (
                              <ul className="list-disc pl-5 sm:pl-6 grid grid-cols-1 gap-y-1">
                                {problem.description.notes.map(
                                  (note, index) => (
                                    <li key={index}>{note}</li>
                                  )
                                )}
                              </ul>
                            )}
                        </div>
                      </section>
                    )}

                    {/* Examples */}
                    <section className="bg-base-100 border border-base-300 rounded-xl p-4 sm:p-5 shadow-sm">
                      <h2 className="text-base-content text-lg sm:text-xl font-semibold mb-4">
                        Examples
                      </h2>

                      <ol className="space-y-4">
                        {problem?.examples.map((example, index) => (
                          <li key={index}>
                            <div className="mb-2">
                              <span className="badge badge-sm font-mono font-medium">
                                {index + 1}.
                              </span>
                            </div>

                            <div className="bg-base-200 font-mono text-xs sm:text-sm rounded-lg p-3 sm:p-4 space-y-1.5 overflow-x-auto">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className="min-w-[70px] text-primary font-medium shrink-0">
                                  Input:
                                </span>
                                <span className="break-all">
                                  {example.input}
                                </span>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className="min-w-[70px] text-secondary font-medium shrink-0">
                                  Output:
                                </span>
                                <span className="break-all">
                                  {example.output}
                                </span>
                              </div>

                              {example.explanation && (
                                <div className="border-t border-base-300 pt-2 mt-2">
                                  <span className="font-sans text-base-content/60 text-xs">
                                    <span className="font-semibold">
                                      Explanation:
                                    </span>
                                    &nbsp;
                                    <span>{example.explanation}</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </section>

                    {/* Constraints */}
                    <section className="bg-base-100 border border-base-300 rounded-xl p-4 sm:p-5 shadow-sm">
                      <h2 className="text-base-content text-lg sm:text-xl font-bold mb-4">
                        Constraints
                      </h2>

                      <ul className="text-base-content/90 space-y-2">
                        {problem?.constraints.map((constraint, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-primary shrink-0">
                              &bull;
                            </span>
                            <code className="text-xs sm:text-sm break-all">
                              {constraint}
                            </code>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Hints */}
                    {problem?.hints && problem.hints.length > 0 && (
                      <section className="bg-base-100 border border-base-300 rounded-xl p-4 sm:p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <Lightbulb className="size-5 text-warning" />

                          <h2 className="text-base-content text-lg sm:text-xl font-bold">
                            Hints
                          </h2>
                        </div>

                        <div className="space-y-3">
                          {problem.hints.map((hint, index) => (
                            <details
                              key={index}
                              className="collapse collapse-arrow bg-base-200 border border-base-300"
                            >
                              <summary className="collapse-title text-sm sm:text-base font-medium cursor-pointer">
                                Hint {index + 1}
                              </summary>

                              <div className="collapse-content">
                                <p className="text-base-content/80 text-xs sm:text-sm leading-relaxed pt-2">
                                  {hint}
                                </p>
                              </div>
                            </details>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Complexity analysis */}
                    {(problem?.timeComplexity || problem?.spaceComplexity) && (
                      <section className="bg-base-100 border border-base-300 rounded-xl p-4 sm:p-5 shadow-sm">
                        <h2 className="text-base-content text-lg sm:text-xl font-bold mb-4">
                          Complexity Analysis
                        </h2>

                        <div className="space-y-3">
                          {/* Time complexity */}
                          {problem.timeComplexity && (
                            <div className="flex items-start gap-3 p-3 bg-base-200 rounded-lg border border-base-300">
                              <div className="shrink-0 mt-0.5">
                                <Clock className="size-5 text-info" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-base-content font-semibold text-sm sm:text-base mb-1">
                                  Time Complexity
                                </h3>

                                <code className="text-accent font-mono text-xs sm:text-sm break-all">
                                  {problem.timeComplexity}
                                </code>
                              </div>
                            </div>
                          )}

                          {/* Space complexity */}
                          {problem.spaceComplexity && (
                            <div className="flex items-start gap-3 p-3 bg-base-200 rounded-lg border border-base-300">
                              <div className="shrink-0 mt-0.5">
                                <Database className="size-5 text-success" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-base-content font-semibold text-sm sm:text-base mb-1">
                                  Space Complexity
                                </h3>

                                <code className="text-accent font-mono text-xs sm:text-sm break-all">
                                  {problem?.spaceComplexity}
                                </code>
                              </div>
                            </div>
                          )}
                        </div>
                      </section>
                    )}
                  </div>
                </article>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 cursor-row-resize transition-colors hover:bg-primary focus-within:bg-primary" />

              {/* Bottom panel - code editor & output */}
              <Panel defaultSize={50} minSize={10} maxSize={90}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={10} maxSize={90}>
                    <CodeEditor
                      selectedLanguage={selectedLanguage}
                      onLanguageChange={handleLanguageChange}
                      userCode={userCode}
                      onCodeChange={(value) => setUserCode(value)}
                      isRunning={isRunning}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-base-300 cursor-row-resize transition-colors hover:bg-primary focus-within:bg-primary" />

                  <Panel defaultSize={30} minSize={10} maxSize={90}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 cursor-col-resize transition-colors hover:bg-primary focus-within:bg-primary" />

          {/* Right panel - video call and chat */}
          <Panel defaultSize={50} minSize={30} maxSize={70}>
            <div className="h-full bg-base-200 p-4 overflow-auto">
              {isInitializingCall ? (
                <div className="h-full text-center flex flex-col justify-center items-center">
                  <Loader2 className="size-8 text-primary mx-auto mb-2 animate-spin" />
                  <p className="text-base-content/70">Connecting to call...</p>
                </div>
              ) : streamError ? (
                <div className="h-full text-center flex flex-col justify-center items-center">
                  <AlertCircle className="size-12 text-error mx-auto mb-3" />

                  <p className="text-error font-medium mb-2">
                    Failed to connect
                  </p>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="btn btn-sm btn-primary"
                  >
                    Refresh Page
                  </button>
                </div>
              ) : (
                <div className="h-full">
                  <StreamVideo client={streamVideoClient}>
                    <StreamCall call={call}>
                      <CallAndChatUI
                        chatClient={streamChatClient}
                        chatChannel={chatChannel}
                      />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </main>
  );
}

export default SessionPage;
