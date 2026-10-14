import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { parseApiError } from '../services/api';

interface SignupForm {
  display_name: string;
  email: string;
  password: string;
  confirm_password: string;
  preferred_language: 'en' | 'hi';
}

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>({
    defaultValues: { preferred_language: 'en' },
  });
  const password = watch('password');

  const onSubmit = async (data: SignupForm) => {
    setApiError('');
    setIsLoading(true);
    try {
      await signup(data.display_name, data.email, data.password, data.preferred_language);
      navigate('/', { replace: true });
    } catch (err) {
      setApiError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 mb-4">
              <BookOpen className="h-7 w-7 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-1 text-sm text-gray-500">Join SkillSaathi — free vocational career guidance</p>
          </div>

          {apiError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="form-field">
              <label htmlFor="signup-name" className="form-label">Full name <span className="text-red-500">*</span></label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                className="form-input"
                placeholder="Arjun Sharma"
                {...register('display_name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
              />
              {errors.display_name && <p className="form-error">{errors.display_name.message}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="signup-email" className="form-label">Email address <span className="text-red-500">*</span></label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                className="form-input"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Enter a valid email address' },
                })}
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="signup-language" className="form-label">Preferred language</label>
              <select id="signup-language" className="form-input" {...register('preferred_language')}>
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="signup-password" className="form-label">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="form-input pr-10"
                  placeholder="At least 8 characters"
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="signup-confirm-password" className="form-label">Confirm password <span className="text-red-500">*</span></label>
              <input
                id="signup-confirm-password"
                type="password"
                autoComplete="new-password"
                className="form-input"
                placeholder="Repeat your password"
                {...register('confirm_password', {
                  required: 'Please confirm your password',
                  validate: (v) => v === password || 'Passwords do not match',
                })}
              />
              {errors.confirm_password && <p className="form-error">{errors.confirm_password.message}</p>}
            </div>

            <button id="signup-submit" type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
