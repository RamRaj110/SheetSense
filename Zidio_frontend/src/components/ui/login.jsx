import React from 'react';
import {Link} from 'react-router-dom';


const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-zinc-400 dark:text-zinc-400">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// --- Main App Component ---
export default function Login1( { onSubmit, error }) {
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };


  return (
    // Main container with a custom background pattern and flexbox for centering. This setup is inherently responsive.
    <div
      className="relative w-full flex items-center justify-center font-sans overflow-hidden p-4 bg-zinc-9000 dark:bg-zinc-950">
      {/* Login Card. max-w-md ensures it doesn't get too wide on large screens, while w-full ensures it shrinks on small screens. */}
      <div
        className="relative w-full max-w-md p-8 sm:p-10 space-y-6 bg-white-600 text-white dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black">
        
        {/* Header section with icon and title */}
        <div className="text-center space-y-4">
          <div
            className="inline-flex p-3 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-full border border-zinc-200/50 dark:border-white/10">
            <UserIcon />
          </div>
          <h1 className="text-3xl font-bold  dark:text-white">Welcome back</h1>
        </div>

        {/* Social login buttons. The grid is responsive by default and will stack on very small screens if needed, but grid-cols-3 is robust. */}
        <div className="grid grid-cols-3 gap-3">
          {/* Icons are mapped to create buttons. Apple icon is correctly positioned first. */}
          {/* {[{ icon: <AppleIcon /> }, { icon: <GoogleIcon /> }, { icon: <XIcon /> }].map((item, index) => (
            <button
              key={index}
              className="flex items-center justify-center p-3 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-white/10 shadow-[inset_0_1px_0_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500/50 dark:focus:ring-white/50">
              {item.icon}
            </button>
          ))} */}
        </div>

        {/* OR Divider */}
        {/* <div className="flex items-center gap-4">
          <div className="h-px flex-grow bg-zinc-300 dark:bg-zinc-700"></div>
          <span className="text-zinc-500 dark:text-zinc-400 text-sm">OR</span>
          <div className="h-px flex-grow bg-zinc-300 dark:bg-zinc-700"></div>
        </div> */}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-400 dark:text-zinc-400 mb-2">
              Email Address
            </label>
            <input
            value={formData.email}
              onChange={handleChange}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 shadow-[inset_0_1px_0_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] focus:outline-none focus:ring-2 focus:ring-zinc-500/50 dark:focus:ring-white/50 focus:border-transparent transition-all" />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-400 dark:text-zinc-400 mb-2">
              Password
            </label>
            <input
              value={formData.password}
              onChange={handleChange}
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full p-3 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 shadow-[inset_0_1px_0_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] focus:outline-none focus:ring-2 focus:ring-zinc-500/50 dark:focus:ring-white/50 focus:border-transparent transition-all" />
          </div>
          <button
            type="submit"
            className="w-full p-3 mt-2 rounded-lg bg-zinc-900 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-white/10 text-white dark:text-white font-semibold shadow-[inset_0_1px_0_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-zinc-500/50 dark:focus:ring-white/50">
            Sign In
          </button>
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
        </form>

        {/* Footer links */}
        <div
          className="text-center text-sm text-zinc-400 dark:text-zinc-400 space-y-2">
          {/* <p>
            Don&apos;t have an account yet?{' '}
            <a
              href="signup"
              className="font-medium text-zinc-100 dark:text-white hover:underline">
              Sign Up
            </a>
          </p> */}

          {/* <a
            href="#"
            className="font-medium text-zinc-400 dark:text-white hover:underline">
            Forgot your password
          </a> */}
          <p>
        Don&apos;t have an account yet?{' '}
        <Link
          to="/signup"
          className="font-medium text-zinc-100 dark:text-white hover:underline"
        >
          Sign Up
        </Link>
      </p>
      <Link
        to="/forgot-password"
        className="font-medium text-zinc-400 dark:text-white hover:underline"
      >
        Forgot your password
      </Link>
        </div>

      </div>
    </div>
  );
}


