import { useState } from "react";
import {
  ArrowRight,
  Code2,
  Crown,
  ListX,
  Loader2,
  Users2,
  Zap,
} from "lucide-react";
import { Link } from "react-router";
import { getDifficultyBadgeClassName } from "../lib/utils";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 3;

function ActiveSessions({ isLoading, sessions, userInSession }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSessions = sessions.slice(startIndex, endIndex);

  return (
    <div className="lg:col-span-2 card h-full bg-base-100 border-2 border-primary/20 hover:border-primary/40 focus-within:border-primary/40 transition-colors duration-200">
      <article className="card-body p-4 sm:p-6 flex flex-col">
        {/* Header section */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Icon container */}
            <div className="p-1.5 sm:p-2 bg-linear-to-br from-primary to-secondary rounded-lg sm:rounded-xl shadow-lg">
              <Zap aria-hidden="true" className="size-4 sm:size-5 text-white" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold">Live Sessions</h2>
          </div>

          {/* Status indicator */}
          <div
            className="flex items-center gap-2 self-start sm:self-auto"
            role="status"
            aria-live="polite"
            aria-label={`${sessions.length} active ${
              sessions.length === 1 ? "session" : "sessions"
            }`}
          >
            <div
              aria-hidden="true"
              className="size-2 bg-success rounded-full animate-pulse"
            />

            <span className="text-xs sm:text-sm font-medium text-success">
              {sessions.length} active
            </span>
          </div>
        </header>

        {/* Sessions list */}
        <ul
          className="space-y-2 sm:space-y-3 flex-1 overflow-y-auto pr-1 sm:pr-2 mb-4"
          role="list"
          aria-label="Active coding sessions"
        >
          {isLoading ? (
            <li
              className="flex items-center justify-center py-16 sm:py-20"
              role="status"
            >
              <Loader2
                className="size-8 sm:size-10 animate-spin text-primary"
                aria-label="Loading sessions"
              />
              <span className="sr-only">Loading active sessions</span>
            </li>
          ) : sessions.length > 0 ? (
            paginatedSessions.map((session) => (
              <li
                key={session._id}
                className="card bg-base-200 border-2 border-base-300 hover:border-primary/50 focus-within:border-primary/50 transition-colors duration-200"
              >
                {/* Session items */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-5">
                  {/* Left size */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Icon container with status indicator */}
                    <div className="relative size-12 sm:size-14 rounded-lg sm:rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-md">
                      <Code2
                        aria-hidden="true"
                        className="size-6 sm:size-7 text-primary-content"
                      />

                      {/* Status indicator */}
                      <div
                        aria-label="Session is live"
                        className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 size-3 sm:size-4 bg-success rounded-full border-2 border-base-100 animate-pulse"
                      />
                    </div>

                    {/* Session info */}
                    <section className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <h3
                          title={session.problemTitle}
                          className="max-w-[100px] md:max-w-[150px] lg:max-w-[32ch] text-sm sm:text-lg font-semibold truncate"
                        >
                          {session.problemTitle}
                        </h3>

                        {/* Badge */}
                        <span
                          className={`badge badge-xs sm:badge-sm capitalize shrink-0 ${getDifficultyBadgeClassName(
                            session.difficulty
                          )}`}
                          aria-label={`Difficulty: ${session.difficulty}`}
                        >
                          {session.difficulty}
                        </span>
                      </div>

                      {/* Metadata section */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm opacity-80">
                        <div className="max-sm:hidden flex items-center gap-1.5">
                          <Crown
                            className="size-3 sm:size-4"
                            aria-hidden="true"
                          />

                          <span
                            title={session.hostId.name}
                            className="sm:max-w-[100px] lg:max-w-[32ch] font-medium truncate"
                          >
                            {session.hostId.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <Users2
                            className="size-3 sm:size-4"
                            aria-hidden="true"
                          />

                          <span
                            className="text-xs"
                            aria-label={`${
                              session.participantId ? 2 : 1
                            } out of 2 participants`}
                          >
                            {session.participantId ? "2/2" : "1/2"}
                          </span>
                        </div>

                        {/* Status badges */}
                        {session.participantId && !userInSession(session) ? (
                          <span
                            className="badge badge-ghost badge-xs sm:badge-sm text-error font-semibold"
                            role="status"
                            aria-label="Session is full"
                          >
                            FULL
                          </span>
                        ) : (
                          <span
                            className="badge badge-ghost badge-xs sm:badge-sm text-success font-semibold"
                            role="status"
                            aria-label="Session is open"
                          >
                            OPEN
                          </span>
                        )}
                      </div>
                    </section>
                  </div>

                  {/* Right side */}
                  <div className="flex sm:block justify-end sm:justify-start">
                    {session.participantId && !userInSession(session) ? (
                      <button
                        type="button"
                        disabled
                        aria-label="Session is full and cannot be joined"
                        className="btn btn-disabled btn-xs sm:btn-sm w-20 sm:w-auto"
                      >
                        Full
                      </button>
                    ) : (
                      <Link
                        to={`/sessions/${session._id}`}
                        aria-label={
                          userInSession(session)
                            ? `Rejoin session: ${session.problemTitle}`
                            : `Join session: ${session.problemTitle}`
                        }
                        className="btn btn-primary btn-xs sm:btn-sm gap-1.5 sm:gap-2 w-24 sm:w-auto transition-transform duration-200 hover:scale-105 focus-visible:scale-105"
                      >
                        <span>
                          {userInSession(session) ? "Rejoin" : "Join"}
                        </span>

                        <ArrowRight
                          aria-hidden="true"
                          className="size-3 sm:size-4"
                        />
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            // Empty state
            <li>
              <div role="status" className="text-center py-12 sm:py-16 px-4">
                <div
                  aria-hidden="true"
                  className="size-15 sm:size-20 bg-linear-to-br from-primary/20 to-secondary/20 rounded-2xl sm:rounded-3xl mx-auto mb-4 flex justify-center items-center"
                >
                  <ListX className="size-8 sm:size-10 text-primary/50" />
                </div>

                <p className="text-base sm:text-lg font-semibold opacity-70 mb-1">
                  No active sessions yet!
                </p>

                <p className="text-xs sm:text-sm opacity-50">
                  Be the first to create one...
                </p>
              </div>
            </li>
          )}
        </ul>

        {/* Pagination */}
        {!isLoading && sessions.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalItems={sessions.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </article>
    </div>
  );
}

export default ActiveSessions;
