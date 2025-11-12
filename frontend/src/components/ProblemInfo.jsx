import { getDifficultyBadgeClassName } from "../lib/utils";
import { Lightbulb, Clock, Database } from "lucide-react";

function ProblemInfo({ problemId, problem, onProblemChange, allProblems }) {
  const {
    title,
    category,
    difficulty,
    description: { text, notes },
    examples,
    hints,
    timeComplexity,
    spaceComplexity,
  } = problem;

  return (
    <article className="h-full bg-base-200 overflow-y-auto">
      {/* Header */}
      <header className="bg-base-100 border-b border-b-base-300 p-4 sm:p-6">
        <div className="mb-3 flex flex-wrap justify-between items-center gap-2">
          <h1 className="text-base-content text-2xl sm:text-3xl font-bold wrap-break-word">
            {title}
          </h1>

          <span
            className={`badge ${getDifficultyBadgeClassName(
              difficulty
            )} font-medium shrink-0`}
          >
            {difficulty}
          </span>
        </div>

        <p className="text-base-content/60 text-sm sm:text-base">{category}</p>

        {/* Problem selector */}
        <div className="mt-4">
          <select
            value={problemId}
            onChange={(event) => onProblemChange(event.target.value)}
            className="select select-sm w-full max-w-full"
          >
            {allProblems.map((problem) => (
              <option key={problem.id} value={problem.id}>
                {problem.title} &mdash; {problem.difficulty}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Description */}
        <section className="bg-base-100 border border-base-300 rounded-xl p-4 sm:p-5 shadow-sm">
          <h2 className="text-base-content text-lg sm:text-xl font-semibold mb-1">
            Description
          </h2>

          <div className="text-base-content/90 leading-relaxed space-y-3 text-sm sm:text-base">
            <p>{text}</p>

            {notes && notes.length > 0 && (
              <ul className="list-disc pl-5 sm:pl-6 grid grid-cols-1 gap-y-1">
                {notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Examples */}
        <section className="bg-base-100 border border-base-300 rounded-xl p-4 sm:p-5 shadow-sm">
          <h2 className="text-base-content text-lg sm:text-xl font-semibold mb-4">
            Examples
          </h2>

          <ol className="space-y-4">
            {examples.map((example, index) => (
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
                    <span className="break-all">{example.input}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="min-w-[70px] text-secondary font-medium shrink-0">
                      Output:
                    </span>
                    <span className="break-all">{example.output}</span>
                  </div>

                  {example.explanation && (
                    <div className="border-t border-base-300 pt-2 mt-2">
                      <span className="font-sans text-base-content/60 text-xs">
                        <span className="font-semibold">Explanation:</span>
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
            {problem.constraints.map((constraint, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-primary shrink-0">&bull;</span>
                <code className="text-xs sm:text-sm break-all">
                  {constraint}
                </code>
              </li>
            ))}
          </ul>
        </section>

        {/* Hints */}
        {hints && hints.length > 0 && (
          <section className="bg-base-100 border border-base-300 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="size-5 text-warning" />

              <h2 className="text-base-content text-lg sm:text-xl font-bold">
                Hints
              </h2>
            </div>

            <div className="space-y-3">
              {hints.map((hint, index) => (
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
        {(timeComplexity || spaceComplexity) && (
          <section className="bg-base-100 border border-base-300 rounded-xl p-4 sm:p-5 shadow-sm">
            <h2 className="text-base-content text-lg sm:text-xl font-bold mb-4">
              Complexity Analysis
            </h2>

            <div className="space-y-3">
              {/* Time complexity */}
              {timeComplexity && (
                <div className="flex items-start gap-3 p-3 bg-base-200 rounded-lg border border-base-300">
                  <div className="shrink-0 mt-0.5">
                    <Clock className="size-5 text-info" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base-content font-semibold text-sm sm:text-base mb-1">
                      Time Complexity
                    </h3>

                    <code className="text-accent font-mono text-xs sm:text-sm break-all">
                      {timeComplexity}
                    </code>
                  </div>
                </div>
              )}

              {/* Space complexity */}
              {spaceComplexity && (
                <div className="flex items-start gap-3 p-3 bg-base-200 rounded-lg border border-base-300">
                  <div className="shrink-0 mt-0.5">
                    <Database className="size-5 text-success" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base-content font-semibold text-sm sm:text-base mb-1">
                      Space Complexity
                    </h3>

                    <code className="text-accent font-mono text-xs sm:text-sm break-all">
                      {spaceComplexity}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

export default ProblemInfo;
