import { Trophy, Users2 } from "lucide-react";

function SessionStatsCards({ activeSessionsCount, recentSessionsCount }) {
  const sessionStats = [
    {
      badgeText: "Live",
      icon: Users2,
      iconColor: "text-primary",
      label: "Active sessions",
      borderColor: "border-primary/20",
      hoverAndFocusClassNames:
        "hover:border-primary/40 focus-within:border-primary/40",
      count: activeSessionsCount,
      ariaLabel: `${activeSessionsCount} active ${
        activeSessionsCount === 1 ? "session" : "sessions"
      }`,
    },
    {
      badgeText: "",
      icon: Trophy,
      iconColor: "text-secondary",
      label: "Total sessions",
      borderColor: "border-secondary/20",
      hoverAndFocusClassNames:
        "hover:border-secondary/40 focus-within:border-secondary/40",
      count: recentSessionsCount,
      ariaLabel: `${recentSessionsCount} total ${
        recentSessionsCount === 1 ? "session" : "sessions"
      }`,
    },
  ];

  return (
    <ul className="lg:col-span-1 grid grid-cols-1 gap-4 sm:gap-6" role="list">
      {sessionStats.map(
        ({
          badgeText,
          icon: StatIcon,
          iconColor,
          label,
          borderColor,
          hoverAndFocusClassNames,
          count,
          ariaLabel,
        }) => (
          <li
            key={label}
            className={`card bg-base-100 border-2 ${borderColor} transition-colors duration-200 ${hoverAndFocusClassNames}`}
            aria-label={ariaLabel}
            role="article"
          >
            <div className="card-body p-4 sm:p-6">
              <div className="flex justify-between items-start sm:items-center mb-2 sm:mb-3">
                <div className="bg-primary/10 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-sm">
                  <StatIcon
                    aria-hidden="true"
                    className={`size-5 sm:size-6 lg:size-7 ${iconColor}`}
                  />
                </div>

                {badgeText && (
                  <span className="badge badge-primary badge-xs sm:badge-sm font-semibold">
                    {badgeText}
                  </span>
                )}
              </div>

              <div
                aria-label={`Count: ${count}`}
                className="text-3xl sm:text-4xl lg:text-5xl font-black mb-0.5 sm:mb-1 leading-none"
              >
                {count}
              </div>

              <p className="text-xs sm:text-sm capitalize opacity-60 font-medium">
                {label}
              </p>
            </div>
          </li>
        )
      )}
    </ul>
  );
}

export default SessionStatsCards;
