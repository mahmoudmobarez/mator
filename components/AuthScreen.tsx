
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Button from './common/Button';
import Input from './common/Input';
import MatorLogoIcon from './icons/MatorLogoIcon';
import { BRAND_COLORS } from '../constants';

const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.RIDER);
  const [error, setError] = useState('');

  const { login, isLoading, setLoading } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    
    setLoading(true);
    try {
      // In a real app, you'd call your backend for signup/login
      // For this mock, we just use the login function from context
      await login(email, selectedRole);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
      <MatorLogoIcon className="w-40 h-auto mb-8" />
      
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
          />
          {isSignUp && (
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          )}

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">I am a:</label>
              <div className="flex space-x-4">
                {(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((roleKey) => (
                  <Button
                    key={roleKey}
                    type="button"
                    variant={selectedRole === UserRole[roleKey] ? 'primary' : 'ghost'}
                    onClick={() => setSelectedRole(UserRole[roleKey])}
                    className="flex-1 capitalize"
                    disabled={isLoading}
                  >
                    {UserRole[roleKey].toLowerCase()}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
            {isLoading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-sm text-yellow-400 hover:text-yellow-500 hover:underline"
            disabled={isLoading}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {/* Mock Social Login Buttons */}
            <Button variant="secondary" disabled={isLoading}>Google</Button>
            <Button variant="secondary" disabled={isLoading}>Facebook</Button>
            <Button variant="secondary" disabled={isLoading}>Apple</Button>
          </div>
           <div className="mt-4 text-center">
             <Button variant="ghost" fullWidth disabled={isLoading}>Use Biometric Login</Button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
    