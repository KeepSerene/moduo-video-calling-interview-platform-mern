import { ArrowRight, Zap } from "lucide-react";

const Greeting = ({ user, onCreateSession }) => (
  <section className="max-w-7xl px-4 sm:px-6 py-8 sm:py-12 lg:py-14 mx-auto overflow-hidden flex flex-col sm:flex-row sm:flex-wrap justify-between items-start sm:items-center gap-6 sm:gap-4 relative">
    <div className="flex-1 min-w-0 grid grid-cols-1 gap-1">
      <h1
        style={{ textTransform: "unset" }}
        className="text-gradient text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight"
      >
        {user?.firstName || "User"}, you're all set!
      </h1>

      <p className="text-base sm:text-lg text-base-content/60">
        Start your next modular interview
      </p>
    </div>

    <button
      type="button"
      onClick={onCreateSession}
      className="btn btn-primary shrink-0 w-full sm:w-auto text-white rounded-xl sm:rounded-2xl group"
    >
      <Zap className="size-5 sm:size-6" />
      <span className="text-sm sm:text-base">New Session</span>
      <ArrowRight className="size-4 sm:size-5 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
    </button>
  </section>
);

export default Greeting;
