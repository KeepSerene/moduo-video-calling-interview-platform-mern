import { useNavigate } from "react-router";
import { ProtectedRouteNavbar } from "../components";
import { PROBLEMS } from "../data/problems";
import { ChevronRight, Code2 } from "lucide-react";
import { getDifficultyBadgeClassName } from "../lib/utils";

const problems = Object.values(PROBLEMS);

const stats = [
  {
    label: "Total problems",
    count: problems.length,
    colorClassName: "text-primary",
  },
  {
    label: "Easy",
    count: problems.filter(
      (problem) => problem.difficulty.toLowerCase() === "easy"
    ).length,
    colorClassName: "text-success",
  },
  {
    label: "Medium",
    count: problems.filter(
      (problem) => problem.difficulty.toLowerCase() === "medium"
    ).length,
    colorClassName: "text-warning",
  },
  {
    label: "Hard",
    count: problems.filter(
      (problem) => problem.difficulty.toLowerCase() === "hard"
    ).length,
    colorClassName: "text-error",
  },
];

function ProblemsPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-base-200">
      <ProtectedRouteNavbar />

      <div className="max-w-6xl px-4 py-12 mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold capitalize mb-2">
            Practice problems
          </h1>

          <p className="text-base-content/70">
            Sharpen your skills with this curated set of problems
          </p>
        </header>

        {/* Problems list */}
        <ul className="space-y-4">
          {problems.map(
            ({ id, title, difficulty, category, description: { text } }) => (
              <li
                key={id}
                onClick={() => navigate(`/problems/${id}`)}
                aria-label={`Click to visit ${title} problem page`}
                className="card bg-base-100 cursor-pointer transition-transform duration-200 hover:scale-[1.01] focus-within:scale-[1.01]"
              >
                <div className="card-body">
                  <div className="flex justify-between items-center gap-4">
                    {/* Left side */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="shrink-0 size-12 bg-primary/10 rounded-lg flex justify-center items-center">
                          <Code2 className="size-6 text-primary" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="sm:text-xl font-semibold">
                              {title}
                            </h2>

                            <span
                              className={`badge ${getDifficultyBadgeClassName(
                                difficulty
                              )} max-sm:badge-sm`}
                            >
                              {difficulty}
                            </span>
                          </div>

                          <span className="text-base-content/60 text-xs sm:text-sm">
                            {category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="max-sm:hidden text-primary flex items-center">
                      <span>Solve</span>
                      <ChevronRight className="size-4" />
                    </div>
                  </div>

                  <p className="text-base-content/70 text-xs sm:text-sm">
                    {text}
                  </p>
                </div>
              </li>
            )
          )}
        </ul>

        {/* Stats */}
        <footer className="card bg-base-100 mt-12 shadow-lg">
          <div className="card-body">
            <ul className="stats stats-vertical lg:stats-horizontal">
              {stats.map(({ label, count, colorClassName }) => (
                <li key={label} className="stat">
                  <span className="stat-title">{label}</span>
                  <span className={`stat-value ${colorClassName}`}>
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default ProblemsPage;
