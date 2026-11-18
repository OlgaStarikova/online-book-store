import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn } from 'lucide-react';
import { login, register } from '../api/auth';
import { getMe } from '../api/auth';
import { useAuthStore } from '../store/authStore';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  shippingAddress?: string;
}

export function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  const loginForm = useForm<LoginForm>();
  const registerForm = useForm<RegisterForm>();

  const handleLogin = async (data: LoginForm) => {
    setServerError('');
    setLoading(true);
    try {
      const res = await login(data.email, data.password);
      localStorage.setItem('token', res.data.token);
      const meRes = await getMe();
      setAuth(res.data.token, meRes.data.email, meRes.data.isAdmin);
      navigate('/books');
    } catch {
      setServerError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    if (data.password !== data.repeatPassword) {
      registerForm.setError('repeatPassword', { message: 'Passwords do not match' });
      return;
    }
    setServerError('');
    setLoading(true);
    try {
      await register(data);
      const res = await login(data.email, data.password);
      localStorage.setItem('token', res.data.token);
      const meRes = await getMe();
      setAuth(res.data.token, meRes.data.email, meRes.data.isAdmin);
      navigate('/books');
    } catch {
      setServerError('Registration failed. Email may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "appearance-none rounded-lg relative block w-full px-4 py-3 border border-warm-300 placeholder-warm-400 text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent-indigo/50 focus:border-accent-indigo sm:text-sm";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-warm-200">
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-accent-terracotta" />
          <h2 className="mt-6 font-serif text-3xl font-bold text-warm-900">
            {isLoginMode ? 'Sign in to your account' : 'Create an account'}
          </h2>
          {searchParams.get('session') === 'expired' && (
            <p className="mt-2 text-sm text-red-500">Your session expired. Please sign in again.</p>
          )}
          <p className="mt-2 text-sm text-warm-500">
            {isLoginMode ? 'Or ' : 'Already have an account? '}
            <button
              onClick={() => { setIsLoginMode(!isLoginMode); setServerError(''); }}
              className="font-medium text-accent-indigo hover:text-indigo-500 transition-colors"
            >
              {isLoginMode ? 'create a new account' : 'sign in instead'}
            </button>
          </p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {serverError}
          </div>
        )}

        {isLoginMode ? (
          <form className="mt-8 space-y-4" onSubmit={loginForm.handleSubmit(handleLogin)}>
            <div>
              <input
                type="email"
                placeholder="Email address"
                className={inputClass}
                {...loginForm.register('email', { required: 'Required' })}
              />
              {loginForm.formState.errors.email && <p className={errorClass}>{loginForm.formState.errors.email.message}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className={inputClass}
                {...loginForm.register('password', { required: 'Required' })}
              />
              {loginForm.formState.errors.password && <p className={errorClass}>{loginForm.formState.errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-warm-900 hover:bg-warm-800 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={registerForm.handleSubmit(handleRegister)}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="First name"
                  className={inputClass}
                  {...registerForm.register('firstName', { required: 'Required' })}
                />
                {registerForm.formState.errors.firstName && <p className={errorClass}>{registerForm.formState.errors.firstName.message}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last name"
                  className={inputClass}
                  {...registerForm.register('lastName', { required: 'Required' })}
                />
                {registerForm.formState.errors.lastName && <p className={errorClass}>{registerForm.formState.errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <input
                type="email"
                placeholder="Email address"
                className={inputClass}
                {...registerForm.register('email', { required: 'Required' })}
              />
              {registerForm.formState.errors.email && <p className={errorClass}>{registerForm.formState.errors.email.message}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className={inputClass}
                {...registerForm.register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })}
              />
              {registerForm.formState.errors.password && <p className={errorClass}>{registerForm.formState.errors.password.message}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Repeat password"
                className={inputClass}
                {...registerForm.register('repeatPassword', { required: 'Required' })}
              />
              {registerForm.formState.errors.repeatPassword && <p className={errorClass}>{registerForm.formState.errors.repeatPassword.message}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Shipping address (optional)"
                className={inputClass}
                {...registerForm.register('shippingAddress')}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-warm-900 hover:bg-warm-800 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
