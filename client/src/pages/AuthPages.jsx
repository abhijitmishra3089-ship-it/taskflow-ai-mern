
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  LoaderCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#09090b] px-4 py-6 text-zinc-100 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

      {/* Brand */}
      <Link
        to="/"
        className="relative z-10 mx-auto flex w-full max-w-7xl items-center gap-2.5"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-500/25">
          <Zap size={21} fill="currentColor" />
        </span>

        <span className="text-xl font-bold tracking-tight">
          taskflow<span className="text-violet-400">.ai</span>
        </span>
      </Link>

      {/* Main content */}
      <div className="relative z-10 mx-auto my-auto grid w-full max-w-6xl items-center gap-12 py-12 lg:grid-cols-2 lg:gap-20 lg:py-16">
        {/* Left promotional section */}
        <section className="hidden lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-3.5 py-2 text-[10px] font-semibold tracking-[0.15em] text-violet-200">
            <Sparkles size={14} />
            YOUR TEAM&apos;S NEW SUPERPOWER
          </span>

          <h1 className="mt-8 text-5xl font-semibold leading-[1.13] tracking-[-0.045em] xl:text-6xl">
            Great work
            <br />
            doesn&apos;t happen
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              by accident.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-zinc-400">
            Bring projects, people, and AI together. Make space for the work
            that matters.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "One calm place for every project",
              "AI that turns goals into action",
              "Built for teams that ship",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-zinc-300"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                  <Check size={14} />
                </span>
                {item}
              </div>
            ))}
          </div>

          {/* Decorative orbit */}
          <div className="relative mt-12 flex h-48 max-w-md items-center justify-center">
            <div className="absolute h-40 w-40 rounded-full border border-violet-400/10" />
            <div className="absolute h-32 w-64 rotate-[-25deg] rounded-[50%] border border-violet-400/20" />
            <div className="absolute h-32 w-64 rotate-[25deg] rounded-[50%] border border-blue-400/15" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-300/20 bg-gradient-to-br from-violet-500/30 to-blue-500/10 text-violet-200 shadow-2xl shadow-violet-500/20">
              <Zap size={30} fill="currentColor" />
            </div>

            <span className="absolute left-16 top-8 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#17151e] text-emerald-400 shadow-xl">
              <Check size={18} />
            </span>

            <span className="absolute right-16 top-8 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#17151e] text-violet-300 shadow-xl">
              <Sparkles size={18} />
            </span>

            <span className="absolute bottom-2 right-24 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#17151e] text-blue-300 shadow-xl">
              <ArrowRight size={18} />
            </span>
          </div>
        </section>

        {/* Authentication card */}
        <section className="mx-auto w-full max-w-md rounded-3xl border border-white/[0.09] bg-[#111116]/95 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div className="mb-7">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-violet-300">
              WELCOME TO TASKFLOW
            </span>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {subtitle}
            </p>
          </div>

          {children}

          <div className="mt-6 text-center text-sm text-zinc-500">
            {footer}
          </div>

          <div className="mt-6 border-t border-white/[0.07] pt-5 text-center text-[11px] leading-5 text-zinc-600">
            By continuing, you agree to our{" "}
            <a
              href="/terms"
              className="text-zinc-400 transition hover:text-violet-300"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-zinc-400 transition hover:text-violet-300"
            >
              Privacy Policy
            </a>
            .
          </div>
        </section>
      </div>

      <footer className="relative z-10 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-2 py-3 text-xs text-zinc-600">
        <span>© {new Date().getFullYear()} TaskFlow AI</span>
        <span className="text-violet-400">•</span>
        <span>Make work flow.</span>
      </footer>
    </main>
  );
}

function AuthInput({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#09090d] px-4 py-3.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-500/10";

function ErrorMessage({ children }) {
  if (!children) return null;

  return (
    <div
      role="alert"
      className="rounded-xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-sm leading-6 text-red-300"
    >
      {children}
    </div>
  );
}

function SubmitButton({ busy, children }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy ? (
        <>
          <LoaderCircle size={17} className="animate-spin" />
          Please wait...
        </>
      ) : (
        <>
          {children}
          <ArrowRight size={16} />
        </>
      )}
    </button>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      await login(form);

      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Pick up where you left off. Your team is waiting."
      footer={
        <>
          New to TaskFlow?{" "}
          <Link
            to="/signup"
            className="inline-flex items-center gap-1 font-medium text-violet-300 hover:text-violet-200"
          >
            Create an account <ArrowRight size={13} />
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <ErrorMessage>{error}</ErrorMessage>

        <AuthInput label="Work email">
          <input
            className={inputClass}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
        </AuthInput>

        <AuthInput label="Password">
          <div className="relative">
            <input
              className={`${inputClass} pr-12`}
              type={show ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            <button
              type="button"
              onClick={() => setShow((previous) => !previous)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500 transition hover:text-violet-300"
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </AuthInput>

        <SubmitButton busy={busy}>Sign in</SubmitButton>
      </form>
    </AuthLayout>
  );
}

export function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Make room for great work"
      subtitle="Create your workspace. It only takes a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="inline-flex items-center gap-1 font-medium text-violet-300 hover:text-violet-200"
          >
            Sign in <ArrowRight size={13} />
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <ErrorMessage>{error}</ErrorMessage>

        <AuthInput label="Full name">
          <input
            className={inputClass}
            autoComplete="name"
            placeholder="Alex Morgan"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            minLength={2}
            maxLength={80}
            required
          />
        </AuthInput>

        <AuthInput label="Work email">
          <input
            className={inputClass}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
        </AuthInput>

        <AuthInput label="Password">
          <div className="relative">
            <input
              className={`${inputClass} pr-12`}
              type={show ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              minLength={8}
              required
            />

            <button
              type="button"
              onClick={() => setShow((previous) => !previous)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500 transition hover:text-violet-300"
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </AuthInput>

        <AuthInput label="Confirm password">
          <input
            className={inputClass}
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={form.confirm}
            onChange={(e) =>
              setForm({ ...form, confirm: e.target.value })
            }
            minLength={8}
            required
          />
        </AuthInput>

        <div className="pt-2">
          <SubmitButton busy={busy}>Create free account</SubmitButton>
        </div>
      </form>
    </AuthLayout>
  );
}
