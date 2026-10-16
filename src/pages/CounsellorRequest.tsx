import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { CalendarCheck, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { meetingsApi, parseApiError } from '../services/api';
import PageWrapper from '../components/PageWrapper';
import MockBanner from '../components/MockBanner';

interface SlotInput {
  date: string;
  time: string;
}

interface RequestForm {
  summary: string;
  slots: SlotInput[];
  consent: boolean;
}

export default function CounsellorRequest() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<RequestForm>({
    defaultValues: {
      summary: '',
      slots: [{ date: '', time: '10:00' }],
      consent: false,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'slots' });

  const onSubmit = async (data: RequestForm) => {
    setApiError('');
    setIsLoading(true);
    try {
      await meetingsApi.requestMeeting({
        summary: data.summary,
        preferred_slots: data.slots.map((s) => ({ ...s, timezone: 'Asia/Kolkata' })),
        consent: data.consent,
      });
      setSuccess(true);
    } catch (err) {
      setApiError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <PageWrapper>
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Requested!</h1>
          <p className="mt-3 text-gray-500 max-w-sm mx-auto">
            Your request has been submitted. A counsellor will review your preferred slots and confirm.
            You can check the status on the "My Meetings" page.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={() => navigate('/my-requests')} className="btn-primary">
              View My Requests
            </button>
            <button onClick={() => { setSuccess(false); }} className="btn-secondary">
              Request Another Meeting
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <>
      <MockBanner />
      <PageWrapper>
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
              <CalendarCheck className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Book a Counsellor Meeting</h1>
              <p className="text-sm text-gray-500">Request a human counselling session via Google Meet</p>
            </div>
          </div>

          <div className="card">
            {apiError && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Summary */}
              <div className="form-field">
                <label htmlFor="request-summary" className="form-label">
                  What would you like to discuss? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="request-summary"
                  rows={3}
                  className="form-input resize-none"
                  placeholder="E.g. I want to understand the ITI Electrician pathway and admission process..."
                  {...register('summary', { required: 'Please describe what you need help with', minLength: { value: 10, message: 'Please provide more detail (at least 10 characters)' } })}
                />
                {errors.summary && <p className="form-error">{errors.summary.message}</p>}
              </div>

              {/* Preferred slots */}
              <div className="form-field">
                <label className="form-label">Preferred meeting times <span className="text-red-500">*</span></label>
                <p className="text-xs text-gray-400 mb-2">Add 1–3 time slots you're available. Timezone: IST (Asia/Kolkata)</p>
                <div className="space-y-2">
                  {fields.map((field, idx) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        type="date"
                        className="form-input flex-1"
                        {...register(`slots.${idx}.date` as const, { required: 'Date is required' })}
                        min={new Date().toISOString().split('T')[0]}
                        aria-label={`Preferred date ${idx + 1}`}
                      />
                      <input
                        type="time"
                        className="form-input w-28"
                        {...register(`slots.${idx}.time` as const, { required: 'Time is required' })}
                        aria-label={`Preferred time ${idx + 1}`}
                      />
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          aria-label={`Remove slot ${idx + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {fields.length < 3 && (
                  <button
                    type="button"
                    onClick={() => append({ date: '', time: '10:00' })}
                    className="mt-2 inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add another slot
                  </button>
                )}
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3">
                <input
                  id="request-consent"
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  {...register('consent', { required: 'You must agree to proceed' })}
                />
                <label htmlFor="request-consent" className="text-sm text-gray-600">
                  I consent to sharing my meeting request summary with the assigned counsellor for the purpose
                  of this counselling session. <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.consent && <p className="form-error">{errors.consent.message}</p>}

              <button id="request-submit" type="submit" disabled={isLoading} className="btn-primary w-full">
                {isLoading ? 'Submitting...' : 'Submit Meeting Request'}
              </button>
            </form>
          </div>

          <div className="mt-4 text-xs text-gray-400 text-center">
            Meeting confirmation and Google Meet link are provided by the counsellor via the backend.
            मार्गमित्र (MaargMitra) does not create Meet links on the frontend.
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
