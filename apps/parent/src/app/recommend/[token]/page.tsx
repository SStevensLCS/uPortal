'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { RecommenderForm } from '@/components/recommend/recommender-form';
import { Skeleton } from '@admissions-compass/ui';
import { GraduationCap, AlertTriangle } from 'lucide-react';

interface RecommendationData {
  token: string;
  student_info: {
    name: string;
    grade: string;
    applying_to: string;
    current_school: string;
  };
  school: {
    name: string;
    logo_url: string | null;
    primary_color: string;
  };
  recommender: {
    name: string;
    email: string;
    type: string;
  };
  status: string;
}

// Mock data for token validation
const MOCK_DATA: RecommendationData = {
  token: 'valid-token',
  student_info: {
    name: 'Emma Thompson',
    grade: '5th Grade',
    applying_to: '6th Grade',
    current_school: 'Lincoln Elementary',
  },
  school: {
    name: 'Oakridge Academy',
    logo_url: null,
    primary_color: '#1e40af',
  },
  recommender: {
    name: 'Ms. Patricia Davis',
    email: 'pdavis@lincolnelementary.edu',
    type: 'current_teacher',
  },
  status: 'sent',
};

export default function RecommendationPage() {
  const params = useParams();
  const token = params.token as string;
  const [data, setData] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendation() {
      try {
        const response = await fetch(`/api/v1/recommendations/${token}`);
        if (response.ok) {
          const result = await response.json();
          setData(result.data);
        } else if (response.status === 404) {
          setError('invalid');
        } else if (response.status === 410) {
          setError('expired');
        } else {
          setError('error');
        }
      } catch {
        // In mock mode, use mock data
        if (token === 'invalid-token') {
          setError('invalid');
        } else {
          setData({ ...MOCK_DATA, token });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendation();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white">
          <div className="mx-auto max-w-3xl px-4 py-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-5 w-64" />
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold">
            {error === 'invalid'
              ? 'Invalid Link'
              : error === 'expired'
                ? 'Link Expired'
                : 'Something Went Wrong'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {error === 'invalid'
              ? 'This recommendation link is not valid. Please check the link from your email and try again.'
              : error === 'expired'
                ? 'This recommendation link has expired. Please contact the family to request a new link.'
                : 'An unexpected error occurred. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  if (data.status === 'completed') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <GraduationCap className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Already Submitted</h1>
          <p className="mt-2 text-muted-foreground">
            This recommendation for {data.student_info.name} has already been submitted.
            Thank you for your contribution!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* School-branded header */}
      <div
        className="border-b bg-white"
        style={{ borderBottomColor: data.school.primary_color }}
      >
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex items-center gap-3">
            {data.school.logo_url ? (
              <img
                src={data.school.logo_url}
                alt={data.school.name}
                className="h-10 w-10 rounded"
              />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded text-white"
                style={{ backgroundColor: data.school.primary_color }}
              >
                <GraduationCap className="h-5 w-5" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{data.school.name}</h1>
              <p className="text-sm text-muted-foreground">
                Admissions Recommendation Form
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation heading */}
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <h2 className="text-2xl font-bold">
          Recommendation for {data.student_info.name}
        </h2>
        <p className="mt-1 text-muted-foreground">
          Hello {data.recommender.name}, please complete the following recommendation form.
          Your feedback is an important part of the admissions process.
        </p>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <RecommenderForm
          token={token}
          studentInfo={data.student_info}
          schoolName={data.school.name}
        />
      </div>

      {/* Footer */}
      <div className="border-t bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 text-center text-xs text-muted-foreground">
          Powered by Admissions Compass &middot; This form is confidential
        </div>
      </div>
    </div>
  );
}
