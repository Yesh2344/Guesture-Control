import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { GestureDetector } from "./GestureDetector";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">Gesture Control</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const recentGestures = useQuery(api.gestures.getRecentGestures);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold accent-text mb-4">Gesture Control</h1>
        <Authenticated>
          <p className="text-xl text-slate-600 mb-8">
            Control your computer with hand gestures!
          </p>
          <GestureDetector />
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Interactive Elements</h3>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <button className="p-4 rounded-lg bg-indigo-100 hover:bg-indigo-200 transition-colors">
                Like 👍
              </button>
              <button className="p-4 rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
                Share 🔄
              </button>
              <button className="p-4 rounded-lg bg-red-100 hover:bg-red-200 transition-colors">
                Delete 🗑️
              </button>
            </div>
            <div className="space-y-4 max-h-60 overflow-y-auto p-4 rounded-lg bg-gray-50">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="p-4 bg-white rounded shadow">
                  Scrollable Content #{i + 1}
                </div>
              ))}
            </div>
          </div>
          {recentGestures && recentGestures.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Recent Gestures</h2>
              <ul className="space-y-2">
                {recentGestures.map((gesture) => (
                  <li key={gesture._id} className="text-slate-600">
                    {gesture.gesture} → {gesture.action} at{" "}
                    {new Date(gesture.timestamp).toLocaleTimeString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-slate-600">Sign in to get started</p>
          <SignInForm />
        </Unauthenticated>
      </div>
    </div>
  );
}
