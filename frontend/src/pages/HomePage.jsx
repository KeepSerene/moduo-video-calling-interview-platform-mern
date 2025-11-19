import { Link } from "react-router";
import {
  ArrowRight,
  Check,
  Code2,
  CodeSquare,
  Layers,
  Sparkles,
  Users2,
  Video,
  Zap,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

const stats = [
  {
    figure: "10K+",
    text: "Active users",
    colorClassName: "text-primary",
  },
  {
    figure: "50K+",
    text: "Sessions",
    colorClassName: "text-secondary",
  },
  {
    figure: "99.9%",
    text: "Uptime",
    colorClassName: "text-accent",
  },
];

const feats = [
  {
    title: "HD video call",
    desc: "Crystal clear video, audio, and chat messaging support",
    icon: Video,
  },
  {
    title: "Live code editor",
    desc: "Syntax highlighting and multiple language support",
    icon: CodeSquare,
  },
  {
    title: "Easy collaboration",
    desc: "Share your screen and discuss solutions",
    icon: Users2,
  },
];

const HomePage = () => (
  <main className="bg-linear-to-br from-base-100 via-base-200 to-base-300 min-h-screen">
    {/* Navbar */}
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 shadow-lg sticky left-0 top-0 z-50">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 mx-auto flex justify-between items-center gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 sm:gap-3 transition-transform duration-200 hover:scale-105 focus-visible:scale-105"
        >
          <span className="size-8 sm:size-10 bg-linear-to-br from-primary via-secondary to-accent rounded-lg sm:rounded-xl shadow-lg inline-flex justify-center items-center shrink-0">
            <Sparkles className="size-4 sm:size-6 text-white" />
          </span>

          <span className="inline-flex flex-col">
            <code className="text-gradient font-mono text-lg sm:text-xl font-extrabold tracking-wider leading-none">
              Moduo
            </code>
            <span className="text-base-content/60 text-[10px] sm:text-xs font-medium capitalize leading-tight">
              Code together, live.
            </span>
          </span>
        </Link>

        {/* Sign-in button */}
        <SignInButton mode="modal">
          <button
            type="button"
            className="btn btn-primary btn-sm sm:btn-md text-white text-xs sm:text-sm font-medium capitalize rounded-lg sm:rounded-xl group"
          >
            <span className="hidden sm:inline">Get started</span>
            <span className="sm:hidden">Start</span>
            <ArrowRight className="size-3 sm:size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5" />
          </button>
        </SignInButton>
      </div>
    </nav>

    {/* Hero section */}
    <section className="max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 mx-auto">
      <div className="grid lg:grid-cols-2 items-center gap-8 sm:gap-10 lg:gap-12">
        {/* Left column */}
        <div className="space-y-6 sm:space-y-8">
          <div className="badge badge-primary font-medium badge-sm sm:badge-md lg:badge-lg gap-1.5 sm:gap-2">
            <Zap className="size-3 sm:size-4" />
            <span className="capitalize text-xs sm:text-sm">
              Real-time collaboration
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold capitalize leading-tight">
            <span className="text-gradient block mb-1 sm:mb-2">
              Modular interviews,
            </span>
            <span className="block">unified experience</span>
          </h1>

          <p className="max-w-xl text-base-content/70 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
            Real-time video, collaborative coding, and chat for seamless
            technical interviews. Powered by GetStream.
          </p>

          {/* Feature badges */}
          <ul className="flex flex-wrap gap-2 sm:gap-3">
            {["Live video chat", "code editor", "multi-language"].map(
              (featText, index) => (
                <li
                  key={index}
                  className="badge badge-outline badge-sm sm:badge-md lg:badge-lg gap-1.5 sm:gap-2"
                >
                  <Check className="size-3 sm:size-4 text-success" />
                  <span className="capitalize text-xs sm:text-sm">
                    {featText}
                  </span>
                </li>
              )
            )}
          </ul>

          {/* CTA */}
          <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4">
            <SignInButton mode="modal">
              <button
                type="button"
                className="btn btn-primary btn-sm sm:btn-md lg:btn-lg gap-2"
              >
                <Code2 className="size-4 sm:size-5" />
                <span className="capitalize text-xs sm:text-sm lg:text-base">
                  Start coding now
                </span>
              </button>
            </SignInButton>

            <a
              href="#features"
              className="btn btn-primary btn-outline btn-sm sm:btn-md lg:btn-lg gap-2"
            >
              <Layers className="size-4 sm:size-5" />
              <span className="text-xs sm:text-sm lg:text-base">
                View Features
              </span>
            </a>
          </div>

          {/* Stats */}
          <div className="bg-base-100 shadow-xl rounded-lg sm:rounded-xl overflow-hidden">
            <ul className="stats stats-vertical xs:stats-horizontal w-full">
              {stats.map(({ figure, text, colorClassName }) => (
                <li key={text} className="stat px-4 py-3 sm:px-6 sm:py-4">
                  <span
                    className={`stat-value text-2xl sm:text-3xl lg:text-4xl ${colorClassName}`}
                  >
                    {figure}
                  </span>
                  <span className="stat-title capitalize text-xs sm:text-sm mt-1">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column */}
        <div className="order-first lg:order-last">
          <img
            src="/images/hero.png"
            alt="Moduo platform illustration"
            className="w-full h-auto rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-base-100 shadow-2xl"
          />
        </div>
      </div>
    </section>

    {/* Features section */}
    <section
      id="features"
      className="max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 mx-auto"
    >
      <div className="text-center mb-10 sm:mb-12 lg:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold capitalize mb-3 sm:mb-4">
          Where <span className="text-primary font-mono">coders</span> click
        </h2>

        <p className="max-w-2xl text-base-content/70 text-sm sm:text-base md:text-lg mx-auto">
          Real skills. Real time.
        </p>
      </div>

      {/* Features grid */}
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {feats.map(({ title, desc, icon: FeatIcon }) => (
          <li
            key={title}
            className="card bg-base-100 shadow-xl transition-transform duration-200 hover:scale-105"
          >
            <div className="card-body p-5 sm:p-6 items-center text-center">
              <div className="size-12 sm:size-14 lg:size-16 bg-primary/10 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 flex justify-center items-center shrink-0">
                <FeatIcon className="size-6 sm:size-7 lg:size-8 text-primary" />
              </div>

              <h3 className="card-title text-base sm:text-lg capitalize">
                {title}
              </h3>

              <p className="text-base-content/70 text-xs sm:text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>

    {/* Footer */}
    <footer className="border-t border-base-300 bg-base-100/50 backdrop-blur-sm">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-8">
          {/* Brand section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 sm:gap-3">
              <span className="size-8 sm:size-10 bg-linear-to-br from-primary via-secondary to-accent rounded-lg sm:rounded-xl shadow-lg inline-flex justify-center items-center shrink-0">
                <Sparkles className="size-4 sm:size-6 text-white" />
              </span>

              <code className="text-gradient font-mono text-lg sm:text-xl font-extrabold tracking-wider">
                Moduo
              </code>
            </div>

            <p className="text-base-content/70 text-xs sm:text-sm leading-relaxed max-w-xs">
              Real-time collaborative coding interview platform. Practice,
              conduct, and experience technical interviews like never before.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-sm sm:text-base uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="text-base-content/70 transition-colors duration-200 hover:text-primary focus-visible:text-primary"
                  >
                    Get Started
                  </button>
                </SignInButton>
              </li>

              <li>
                <a
                  href="https://math-to-dev.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content/70 transition-colors duration-200 hover:text-primary focus-visible:text-primary"
                >
                  Portfolio
                </a>
              </li>
            </ul>
          </div>

          {/* Technologies */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-sm sm:text-base uppercase tracking-wider">
              Built With
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-base-content/70">
              <li>React + Vite</li>
              <li>Node.js + Express</li>
              <li>MongoDB</li>
              <li>GetStream.io</li>
              <li>Clerk Auth</li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-base-300 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-base-content/60">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Moduo. All rights reserved.
          </p>

          <p className="flex items-center gap-2 text-center sm:text-right">
            <span>Developed by</span>

            <a
              href="https://github.com/KeepSerene"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary inline-flex items-center gap-1 transition-all duration-200 hover:underline focus-visible:underline"
            >
              <Code2 className="size-3 sm:size-4" />
              @KeepSerene
            </a>
          </p>
        </div>
      </div>
    </footer>
  </main>
);

export default HomePage;
