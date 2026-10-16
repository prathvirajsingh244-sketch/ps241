import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, BookOpen, GraduationCap, TrendingUp,
  Wrench, Video, AlertTriangle
} from 'lucide-react';
import { careersApi, parseApiError } from '../services/api';
import type { Career } from '../types';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import SourceCitation from '../components/SourceCitation';
import PageWrapper from '../components/PageWrapper';
import MockBanner from '../components/MockBanner';

export default function CareerDetails() {
  const { id } = useParams<{ id: string }>();
  const [career, setCareer] = useState<Career | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    careersApi.get(id)
      .then(setCareer)
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <LoadingState fullPage message="Loading career profile..." />;
  if (error) return <ErrorMessage fullPage title="Career not found" message={error} />;
  if (!career) return null;

  return (
    <>
      <MockBanner />
      <PageWrapper>
        {/* Back */}
        <Link to="/careers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Careers
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-green-50">
                  <GraduationCap className="h-7 w-7 text-green-600" />
                </div>
                <div className="flex-1">
                  <span className="badge-blue mb-2 inline-block">{career.category}</span>
                  <h1 className="text-2xl font-bold text-gray-900">{career.title}</h1>
                  <p className="mt-2 text-gray-600 leading-relaxed">{career.overview}</p>
                </div>
              </div>
            </div>

            {/* Eligibility */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Eligibility</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{career.eligibility}</p>
            </div>

            {/* Skills */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Key Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {career.skills.map((skill) => (
                  <span key={skill} className="badge-blue">{skill}</span>
                ))}
              </div>
            </div>

            {/* Training path */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Training Path</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{career.training_path}</p>
            </div>

            {/* Progression */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Career Progression</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{career.progression_path}</p>
            </div>

            {/* Video embed */}
            {career.video_url ? (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <Video className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Career Video</h2>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <iframe
                    src={career.video_url}
                    title={`${career.title} career video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                <Video className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No video available for this career yet.</p>
                <Link to="/videos" className="mt-2 inline-block text-sm text-green-600 hover:text-green-700">Browse all career videos →</Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Sources */}
            <div className="card">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Information Sources</h2>
              <SourceCitation sources={career.sources} />
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  This profile is for guidance only. मार्गमित्र (MaargMitra) does not guarantee employment, salary or career outcomes.
                  Verify information with official sources before making decisions.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="card flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-gray-900">Need personalised guidance?</h3>
              <Link to="/counselling" className="btn-primary text-sm w-full">Ask AI Counsellor</Link>
              <Link to="/counsellor-request" className="btn-secondary text-sm w-full">Book Human Meeting</Link>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
