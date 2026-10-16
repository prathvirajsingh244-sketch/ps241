import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, MapPin, Video, Users, FileText,
  ArrowRight, TrendingUp
} from 'lucide-react';
import { adminApi, parseApiError } from '../../services/api';
import type { AdminOverview } from '../../types/admin';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import PageWrapper from '../../components/PageWrapper';
import MockBanner from '../../components/MockBanner';

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getOverview()
      .then(setOverview)
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState fullPage message="Loading admin dashboard..." />;
  if (error) return <ErrorMessage fullPage message={error} />;
  if (!overview) return null;

  const stats = [
    { label: 'Career Profiles', value: overview.career_count, sub: `${overview.published_career_count} published`, icon: BookOpen, color: 'bg-blue-50 text-blue-600', link: '/admin/careers' },
    { label: 'Sources', value: overview.source_count, sub: 'Verified references', icon: FileText, color: 'bg-green-50 text-green-600', link: '/admin/sources' },
    { label: 'Skill Locations', value: overview.active_locations, sub: 'Active centres', icon: MapPin, color: 'bg-amber-50 text-amber-600', link: '/admin/locations' },
    { label: 'Career Videos', value: overview.video_count, sub: 'Published videos', icon: Video, color: 'bg-red-50 text-red-600', link: '/admin/videos' },
    { label: 'Meeting Requests', value: overview.total_meeting_requests, sub: `${overview.pending_meeting_requests} pending`, icon: Users, color: 'bg-purple-50 text-purple-600', link: '/admin/requests' },
    { label: 'Assessments Today', value: overview.assessment_attempts_today, sub: 'Attempts', icon: TrendingUp, color: 'bg-teal-50 text-teal-600', link: '#' },
  ];

  return (
    <>
      <MockBanner />
      <PageWrapper>
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <LayoutDashboard className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">मार्गमित्र (MaargMitra) operational overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} to={stat.link} className="card group hover:border-green-200 transition-all">
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{stat.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick links */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link to="/admin/careers" className="card flex items-center gap-4 hover:border-green-200">
            <BookOpen className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold text-gray-900">Manage Careers</p>
              <p className="text-sm text-gray-500">Create, edit, publish career profiles</p>
            </div>
          </Link>
          <Link to="/admin/requests" className="card flex items-center gap-4 hover:border-green-200">
            <Users className="h-6 w-6 text-purple-600" />
            <div>
              <p className="font-semibold text-gray-900">Meeting Requests</p>
              <p className="text-sm text-gray-500">Review and confirm pending requests</p>
            </div>
          </Link>
        </div>
      </PageWrapper>
    </>
  );
}
