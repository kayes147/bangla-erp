"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, User, ShieldCheck } from "lucide-react";

export default function Login() {
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      username: role,
      password: password,
      redirect: false
    });

    if (res?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/select-company");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-center bg-slate-50 border-b border-gray-100">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to <span className="text-blue-600">Bangla</span> ERP</h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to access your dashboard</p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 font-medium" 
                />
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 font-medium" 
                />
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            <button type="submit" className="w-full flex justify-center py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors mt-4 shadow-md">
              Sign In
            </button>
          </form>
          
          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">
                Create New Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
