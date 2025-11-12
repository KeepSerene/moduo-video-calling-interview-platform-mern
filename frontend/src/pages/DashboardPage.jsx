import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import {
  ActiveSessions,
  CreateSessionModal,
  Greeting,
  ProtectedRouteNavbar,
  RecentSessions,
  SessionStatsCards,
} from "../components";
import { useState } from "react";
import {
  useActiveSessions,
  useCreateSession,
  useRecentSessions,
} from "../hooks/useSessions";
import toast from "react-hot-toast";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [openCreateSessionModal, setOpenCreateSessionModal] = useState(false);
  const [sessionConfig, setSessionConfig] = useState({
    problemTitle: "",
    difficulty: "",
  });

  const createSessionMutation = useCreateSession();
  const { data: activeSessionsData, isLoading: activeSessionsDataLoading } =
    useActiveSessions();
  const { data: recentSessionsData, isLoading: recentSessionsDataLoading } =
    useRecentSessions();

  const handleCreateSession = () => {
    if (!sessionConfig.problemTitle || !sessionConfig.difficulty) return;

    // prevent double submission
    if (createSessionMutation.isPending) return;

    createSessionMutation.mutate(
      {
        problemTitle: sessionConfig.problemTitle,
        difficulty: sessionConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess(data) {
          if (!data?.session?._id) {
            toast.error("Invalid response from server!");
            return;
          }

          // Close modal and reset config BEFORE navigation
          setOpenCreateSessionModal(false);
          setSessionConfig({ problemTitle: "", difficulty: "" });

          navigate(`/sessions/${data.session._id}`);
        },
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const userInSession = (session) => {
    if (!user || !session) return false;

    return (
      user.id === session.hostId?.clerkId ||
      user.id === session.participantId?.clerkId
    );
  };

  return (
    <>
      <main className="min-h-screen bg-base-300">
        <ProtectedRouteNavbar />
        <Greeting
          user={user}
          onCreateSession={() => setOpenCreateSessionModal(true)}
        />

        {/* Grid layout */}
        <div className="container px-6 pb-16 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SessionStatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />

            <ActiveSessions
              isLoading={activeSessionsDataLoading}
              sessions={activeSessions}
              userInSession={userInSession}
            />
          </div>

          <RecentSessions
            isLoading={recentSessionsDataLoading}
            sessions={recentSessions}
          />
        </div>
      </main>

      <CreateSessionModal
        isOpen={openCreateSessionModal}
        onClose={() => setOpenCreateSessionModal(false)}
        sessionConfig={sessionConfig}
        setSessionConfig={setSessionConfig}
        onCreateSession={handleCreateSession}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;
