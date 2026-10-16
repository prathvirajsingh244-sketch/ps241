import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, BookOpen, AlertCircle, GraduationCap, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { parseApiError } from '../services/api';

interface SignupForm {
  display_name: string;
  email: string;
  password: string;
  confirm_password: string;
  preferred_language: 'en' | 'hi';
  role: 'learner' | 'parent';
}

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const defaultRole: 'learner' | 'parent' = roleParam === 'parent' ? 'parent' : 'learner';

  const { signup } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'learner' | 'parent'>(defaultRole);
  const [showPwd, setShowPwd] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SignupForm>({
    defaultValues: { preferred_language: 'hi', role: defaultRole },
  });
  const password = watch('password');

  useEffect(() => {
    if (roleParam === 'parent' || roleParam === 'learner') {
      setSelectedRole(roleParam);
      setValue('role', roleParam);
    }
  }, [roleParam, setValue]);

  const setRole = (r: 'learner' | 'parent') => {
    setSelectedRole(r);
    setValue('role', r);
  };

  const onSubmit = async (data: any) => {
    setApiError('');
    setIsLoading(true);
    if (data.student_email) {
      localStorage.setItem('mm_linked_student_email', data.student_email);
    }
    try {
      await signup(data.display_name, data.email, data.password, data.preferred_language, selectedRole);
    } catch (err) {
      setApiError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-10 bg-gradient-to-b from-gray-50 to-emerald-50/30">
      <div className="w-full max-w-lg">
        <div className="card p-8 shadow-xl border border-gray-100 rounded-3xl">
          <div className="text-center mb-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-md mb-3 text-white">
              <BookOpen className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Create your MaargMitra Account</h1>
            <p className="mt-1 text-xs text-gray-500">मार्गमित्र में आपका स्वागत है — निःशुल्क करियर मार्गदर्शन पोर्टल</p>
          </div>

          {/* Visual Role Selector */}
          <div className="mb-6">
            <label className="form-label text-xs font-bold uppercase text-gray-500 mb-2 block">
              Choose Your Role / अपनी भूमिका चुनें <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('learner')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  selectedRole === 'learner'
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-200'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-2 ${selectedRole === 'learner' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold">Student</span>
                <span className="text-[10px] text-gray-500 font-medium">विद्यार्थी</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('parent')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  selectedRole === 'parent'
                    ? 'border-purple-500 bg-purple-50/80 text-purple-900 shadow-sm ring-2 ring-purple-500/20'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-purple-200'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-2 ${selectedRole === 'parent' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold">Parent</span>
                <span className="text-[10px] text-gray-500 font-medium">अभिभावक</span>
              </button>
            </div>
            <input type="hidden" {...register('role')} value={selectedRole} />
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
                placeholder={selectedRole === 'learner' ? 'e.g. Arjun Sharma' : 'e.g. Rajesh Sharma'}
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

            {selectedRole === 'parent' && (
              <div className="form-field rounded-2xl border border-purple-200 bg-purple-50/50 p-4">
                <label htmlFor="signup-student-email" className="form-label font-bold text-purple-950">
                  Student's Registered Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="signup-student-email"
                  type="email"
                  className="form-input bg-white mt-1"
                  placeholder="child.student@example.com"
                  {...register('student_email' as any, {
                    required: selectedRole === 'parent' ? "Enter your student's email to link family accounts" : false,
                    pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Enter a valid student email address' },
                  })}
                />
                <p className="text-[11px] text-purple-700 font-medium mt-1">
                  Enter your child's email address so MaargMitra can link their assessment results to your parent report.
                </p>
                {(errors as any).student_email && <p className="form-error">{(errors as any).student_email.message}</p>}
              </div>
            )}

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
