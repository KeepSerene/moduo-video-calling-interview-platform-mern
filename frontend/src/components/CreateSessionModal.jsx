import { Code2, Loader2, Plus } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  sessionConfig,
  setSessionConfig,
  onCreateSession,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  const handleProblemSelect = (event) => {
    const problemTitle = event.target.value;
    const selectedProblem = problems.find(
      (problem) => problem.title === problemTitle
    );
    setSessionConfig((prev) => ({
      ...prev,
      problemTitle,
      difficulty: selectedProblem.difficulty,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isCreating && sessionConfig.problemTitle) {
      onCreateSession();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="modal modal-open"
    >
      <section className="modal-box max-w-2xl">
        <form onSubmit={handleSubmit}>
          <h3
            id="modal-title"
            className="text-xl sm:text-2xl font-semibold capitalize mb-4 sm:mb-6"
          >
            New interview session
          </h3>

          <div className="space-y-6 sm:space-y-8">
            {/* Problem selector */}
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="problem-select" className="label gap-0">
                <span className="font-medium text-sm sm:text-base">
                  Choose Problem
                </span>
                <span className="text-error" aria-label="required">
                  *
                </span>
              </label>

              <select
                id="problem-select"
                value={sessionConfig.problemTitle}
                onChange={handleProblemSelect}
                disabled={isCreating}
                aria-required="true"
                aria-describedby={
                  sessionConfig.problemTitle ? "session-summary" : undefined
                }
                className="select w-full text-sm sm:text-base"
              >
                <option value="" disabled>
                  Select one...
                </option>

                {problems.map(({ id, title, difficulty }) => (
                  <option key={id} value={title}>
                    {title} &mdash; {difficulty}
                  </option>
                ))}
              </select>
            </div>

            {/* Session summary/Config */}
            {sessionConfig.problemTitle && (
              <div
                id="session-summary"
                role="status"
                aria-live="polite"
                className="alert alert-success text-sm sm:text-base py-3 sm:py-4"
              >
                <Code2 className="size-4 sm:size-5 shrink-0" />

                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base">
                    Configuration
                  </p>

                  <p className="text-xs sm:text-sm wrap-break-word">
                    Problem: {sessionConfig.problemTitle}
                  </p>

                  <p className="text-xs sm:text-sm">
                    Max Participants:{" "}
                    <span className="font-medium">2 (1-1 session)</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <footer className="modal-action mt-6 sm:mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              aria-label="Cancel session creation"
              className="btn btn-ghost text-sm sm:text-base"
            >
              Cancel
            </button>

            {/* Changed to submit button for better form handling */}
            <button
              type="submit"
              disabled={isCreating || !sessionConfig.problemTitle}
              aria-label={
                isCreating ? "Creating session" : "Start new interview session"
              }
              aria-busy={isCreating}
              className="btn btn-primary text-sm sm:text-base"
            >
              {isCreating ? (
                <>
                  <Loader2
                    className="size-3.5 sm:size-4 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5 sm:size-4" aria-hidden="true" />
                  <span>Create</span>
                </>
              )}
            </button>
          </footer>
        </form>
      </section>

      {/* only allow backdrop click to close if not creating */}
      <div
        onClick={isCreating ? undefined : onClose}
        className="modal-backdrop"
      />
    </div>
  );
}

export default CreateSessionModal;
