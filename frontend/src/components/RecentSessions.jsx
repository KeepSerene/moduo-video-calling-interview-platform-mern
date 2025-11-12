import { useState } from "react";
import { Clock, Code2, Loader2, Users2, History } from "lucide-react";
import { getDifficultyBadgeClassName } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 10;

function RecentSessions({ isLoading, sessions }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSessions = sessions.slice(startIndex, endIndex);

  return (
    <section
      className="card bg-base-100 border-2 border-accent/20 hover:border-accent/40 focus-within:border-accent/40 transition-colors duration-200 mt-6 sm:mt-8"
      aria-labelledby="recent-sessions-heading"
    >
      <div className="card-body p-4 sm:p-6">
        <header className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          {/* Icon container with improved gradient */}
          <div className="p-1.5 sm:p-2 bg-linear-to-br from-accent to-secondary rounded-lg sm:rounded-xl shadow-lg shrink-0">
            <Clock aria-hidden="true" className="size-4 sm:size-5 text-white" />
          </div>
          <h2
            id="recent-sessions-heading"
            className="text-xl sm:text-2xl font-black"
          >
            Your Past Sessions
          </h2>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {isLoading ? (
            <div
              className="col-span-full flex items-center justify-center py-16 sm:py-20"
              role="status"
            >
              <Loader2
                className="size-8 sm:size-10 animate-spin text-primary"
                aria-label="Loading recent sessions"
              />
              <span className="sr-only">Loading your past sessions</span>
            </div>
          ) : sessions.length > 0 ? (
            paginatedSessions.map((session) => (
              <article
                key={session._id}
                className={`card relative transition-all duration-200 border-2 ${
                  session.status === "active"
                    ? "bg-success/10 border-success/30 hover:border-success/60 focus-within:border-success/60"
                    : "bg-base-200 border-base-300 hover:border-primary/40 focus-within:border-primary/40"
                }`}
                aria-label={`${session.problemTitle} session - ${session.difficulty} difficulty`}
              >
                {/* Active badge positioning and styling */}
                {session.status === "active" && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                    <span className="badge badge-success badge-xs sm:badge-sm gap-1 font-semibold shadow-md">
                      <div
                        className="size-1.5 bg-success-content rounded-full animate-pulse"
                        aria-hidden="true"
                      />
                      ACTIVE
                    </span>
                  </div>
                )}

                {/* Card body */}
                <div className="card-body p-4 sm:p-5">
                  <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                    {/* Icon container */}
                    <div
                      className={`size-10 sm:size-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                        session.status === "active"
                          ? "bg-linear-to-br from-success to-success/70"
                          : "bg-linear-to-br from-primary to-secondary"
                      }`}
                      aria-hidden="true"
                    >
                      <Code2 className="size-5 sm:size-6 text-primary-content" />
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold text-sm sm:text-base mb-1 truncate"
                        title={session.problemTitle}
                      >
                        {session.problemTitle}
                      </h3>
                      <span
                        className={`badge badge-xs sm:badge-sm capitalize ${getDifficultyBadgeClassName(
                          session.difficulty
                        )}`}
                        aria-label={`Difficulty: ${session.difficulty}`}
                      >
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Metadata section */}
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm opacity-80 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Clock
                        className="size-3 sm:size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Users2
                        className="size-3 sm:size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span
                        aria-label={`${
                          session.participantId ? 2 : 1
                        } participant${session.participantId ? "s" : ""}`}
                      >
                        {session.participantId ? "2" : "1"} participant
                        {session.participantId ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <footer className="flex items-center justify-between pt-2 sm:pt-3 border-t border-base-300">
                    <span className="text-xs font-semibold opacity-80 uppercase tracking-wide">
                      {session.status === "active"
                        ? "In Progress"
                        : "Completed"}
                    </span>
                    <time
                      className="text-xs opacity-50"
                      dateTime={new Date(session.updatedAt).toISOString()}
                    >
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </time>
                  </footer>
                </div>
              </article>
            ))
          ) : (
            // Empty state
            <div className="col-span-full">
              <div className="text-center py-12 sm:py-16 px-4" role="status">
                <div className="size-16 sm:size-20 mx-auto mb-3 sm:mb-4 bg-linear-to-br from-accent/20 to-secondary/20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-inner">
                  <History
                    aria-hidden="true"
                    className="size-8 sm:size-10 text-accent/50"
                  />
                </div>

                <p className="text-base sm:text-lg font-semibold opacity-70 mb-1">
                  No past sessions yet!
                </p>

                <p className="text-xs sm:text-sm opacity-50 max-w-sm mx-auto">
                  Your completed interview sessions will appear here
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && sessions.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalItems={sessions.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </section>
  );
}

export default RecentSessions;
