import { Link } from "react-router";
import {
  ArrowRight,
  Check,
  Code2,
  CodeSquare,
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
    desc: " Share your screen and discuss solutions",
    icon: Users2,
  },
];

const HomePage = () => (
  <main className="bg-linear-to-br from-base-100 via-base-200 to-base-300">
    {/* Navbar */}
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 shadow-lg sticky left-0 top-0 z-50">
      <div className="max-w-7xl p-4 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="inline-flex items-center gap-3 transition-transform duration-200 hover:scale-105 focus-visible:scale-105"
        >
          <span className="size-10 bg-linear-to-br from-primary via-secondary to-accent rounded-xl shadow-lg inline-flex justify-center items-center">
            <Sparkles className="shrink-0 size-6 text-white" />
          </span>

          <span className="inline-flex flex-col">
            <code className="text-gradient font-mono text-xl font-extrabold tracking-wider">
              Moduo
            </code>
            <span className="text-base-content/60 text-xs font-medium capitalize">
              Code together, live.
            </span>
          </span>
        </Link>

        {/* Sign-in button */}
        <SignInButton mode="modal">
          <button
            type="button"
            className="btn btn-primary text-white text-sm font-medium capitalize rounded-xl group"
          >
            <span>Get started</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5" />
          </button>
        </SignInButton>
      </div>
    </nav>

    {/* Hero section */}
    <section className="max-w-7xl px-4 py-20 mx-auto">
      <div className="grid lg:grid-cols-2 items-center gap-12">
        {/* Left column */}
        <div className="space-y-8">
          <div className="badge badge-primary badge-lg">
            <Zap size={16} />
            <span className="capitalize">Real-time collaboration</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold capitalize leading-tight">
            <span className="text-gradient">Modular interviews,</span>
            <br />
            <span>unified experience</span>
          </h1>

          <p className="max-w-xl text-base-content/70 text-xl leading-relaxed">
            Moduo brings together real-time video calls, collaborative coding,
            and chat powered by GetStream — a complete, modular platform for
            engineers to practice, conduct, or experience technical interviews
            like never before.
          </p>

          {/* Feature badges */}
          <ul className="flex flex-wrap gap-3">
            {["Live video chat", "code editor", "multi-language"].map(
              (featText, index) => (
                <li key={index} className="badge badge-outline badge-lg">
                  <Check className="size-4 text-success" />
                  <span className="capitalize">{featText}</span>
                </li>
              )
            )}
          </ul>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4">
            <SignInButton mode="modal">
              <button type="button" className="btn btn-primary btn-lg">
                <Code2 className="size-5" />
                <span className="capitalize">Start coding now</span>
              </button>
            </SignInButton>

            <button type="button" disabled className="btn btn-outline btn-lg">
              <Video className="size-5" />
              <span className="capitalize">Watch demo</span>
            </button>
          </div>

          {/* Stats */}
          <ul className="bg-base-100 shadow-xl stats stats-vertical lg:stats-horizontal">
            {stats.map(({ figure, text, colorClassName }) => (
              <li key={text} className="stat">
                <span className={`stat-value ${colorClassName}`}>{figure}</span>
                <span className="stat-title capitalize">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column */}
        <img
          src="/images/hero.png"
          alt="Moduo platform illustration"
          className="w-full h-auto rounded-3xl border-4 border-base-100 shadow-2xl"
        />
      </div>
    </section>

    {/* Features section */}
    <section className="max-w-7xl px-4 py-20 mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold capitalize mb-4">
          Where <span className="text-primary font-mono">coders</span> click
        </h2>

        <p className="max-w-2xl text-base-content/70 text-lg mx-auto">
          Real skills. Real time.
        </p>
      </div>

      {/* Features grid */}
      <ul className="grid md:grid-cols-3 gap-8">
        {feats.map(({ title, desc, icon: FeatIcon }) => (
          <li key={title} className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl mb-4 flex justify-center items-center">
                <FeatIcon className="size-8 text-primary" />
              </div>

              <h3 className="card-title capitalize">{title}</h3>

              <p className="text-base-content/70">{desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  </main>
);

export default HomePage;
