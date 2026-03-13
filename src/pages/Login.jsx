import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) throw signInError;
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row min-h-[calc(100vh-120px)] w-full max-w-[1440px] mx-auto overflow-hidden">
      {/* Left — image panel */}
      <div className="hidden md:flex flex-1 bg-[#CBE4E8] items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop"
          alt="Shopping"
          className="w-full h-full object-cover mix-blend-multiply opacity-90"
        />
      </div>

      {/* Right — form panel */}
      <div className="flex-1 md:flex-none md:w-[560px] flex items-center justify-center px-6 md:pl-20 md:pr-12 py-12">
        <div className="w-full max-w-[371px]">
          <h1 className="font-inter font-medium text-4xl tracking-wide text-black mb-3">
            Log in to Exclusive
          </h1>
          <p className="font-poppins text-base text-black mb-10">
            Enter your details below
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm mb-4 font-poppins">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <input
              type="email"
              placeholder="Email or Phone Number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b border-black/40 pb-2 bg-transparent outline-none font-poppins text-base text-black placeholder:text-black/40 focus:border-[#DB4444] transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-b border-black/40 pb-2 bg-transparent outline-none font-poppins text-base text-black placeholder:text-black/40 focus:border-[#DB4444] transition-colors"
            />
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="w-36 h-14 bg-[#DB4444] text-white rounded font-poppins font-medium text-base hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              <button
                type="button"
                className="text-[#DB4444] font-poppins text-base hover:underline"
              >
                Forget Password?
              </button>
            </div>
          </form>

            <div className="flex flex-col gap-4 mt-8">
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="w-full h-14 border border-black/40 rounded flex items-center justify-center gap-4 font-poppins text-base hover:bg-gray-50 transition-colors"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                <span>Continue with Google</span>
              </button>
              <button
                type="button"
                onClick={() => signInWithGithub()}
                className="w-full h-14 border border-black/40 rounded flex items-center justify-center gap-4 font-poppins text-base hover:bg-gray-100 transition-colors"
              >
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-6 h-6" />
                <span>Continue with GitHub</span>
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 font-poppins text-base">
              <span className="text-black/70">Don't have an account?</span>
              <Link to="/signup" className="text-black font-medium border-b border-black/50 hover:border-black transition-colors">
                Sign Up
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
