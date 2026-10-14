import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi, parseApiError } from '../services/api';
import PageWrapper from '../components/PageWrapper';

interface ProfileForm {
  display_name: string;
  preferred_language: 'en' | 'hi';
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      display_name: user?.display_name ?? '',
      preferred_language: user?.preferred_language ?? 'en',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setApiError('');
    setSuccess(false);
    setIsLoading(true);
    try {
      await authApi.updateProfile(data);
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setApiError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
            <User className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500">
              {user?.email} · <span className="capitalize badge-gray">{user?.role}</span>
            </p>
          </div>
        </div>

        <div className="card">
          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-3">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700">Profile updated successfully.</p>
            </div>
          )}
          {apiError && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3">
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="form-field">
              <label htmlFor="profile-name" className="form-label">Display name <span className="text-red-500">*</span></label>
              <input
                id="profile-name"
                type="text"
                className="form-input"
                {...register('display_name', { required: 'Name is required', minLength: { value: 2, message: 'Minimum 2 characters' } })}
              />
              {errors.display_name && <p className="form-error">{errors.display_name.message}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="profile-language" className="form-label">Preferred language</label>
              <select id="profile-language" className="form-input" {...register('preferred_language')}>
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>

            <button id="profile-save" type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
