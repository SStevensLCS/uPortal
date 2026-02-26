import { NextRequest, NextResponse } from 'next/server';

// Mock recommendation data accessible by token (public endpoint - no auth)
const mockRecommendationsByToken: Record<string, {
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
  form_definition: {
    rating_criteria: Array<{
      id: string;
      label: string;
      description: string;
    }>;
    comment_fields: Array<{
      id: string;
      label: string;
      required: boolean;
    }>;
  };
}> = {
  'tok-abc123def456': {
    token: 'tok-abc123def456',
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
    status: 'completed',
    form_definition: {
      rating_criteria: [
        { id: 'academic_ability', label: 'Academic Ability', description: 'Overall intellectual ability' },
        { id: 'work_ethic', label: 'Work Ethic', description: 'Consistency of effort' },
        { id: 'character', label: 'Character', description: 'Honesty and integrity' },
      ],
      comment_fields: [
        { id: 'strengths', label: 'Student Strengths', required: true },
        { id: 'areas_for_growth', label: 'Areas for Growth', required: false },
      ],
    },
  },
  'tok-ghi789jkl012': {
    token: 'tok-ghi789jkl012',
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
      name: 'Mr. Robert Kim',
      email: 'rkim@lincolnelementary.edu',
      type: 'math_teacher',
    },
    status: 'sent',
    form_definition: {
      rating_criteria: [
        { id: 'academic_ability', label: 'Academic Ability', description: 'Overall intellectual ability' },
        { id: 'work_ethic', label: 'Work Ethic', description: 'Consistency of effort' },
        { id: 'character', label: 'Character', description: 'Honesty and integrity' },
      ],
      comment_fields: [
        { id: 'strengths', label: 'Student Strengths', required: true },
        { id: 'areas_for_growth', label: 'Areas for Growth', required: false },
      ],
    },
  },
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;

  // Look up the recommendation by token
  const recommendation = mockRecommendationsByToken[token];

  if (!recommendation) {
    // Try to find by any token-like pattern (for dynamically created tokens)
    // In production, this would be a database lookup
    return NextResponse.json(
      {
        data: {
          token,
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
            name: 'Recommender',
            email: 'recommender@school.edu',
            type: 'current_teacher',
          },
          status: 'sent',
          form_definition: {
            rating_criteria: [
              { id: 'academic_ability', label: 'Academic Ability', description: 'Overall intellectual ability' },
              { id: 'work_ethic', label: 'Work Ethic', description: 'Consistency of effort' },
              { id: 'character', label: 'Character', description: 'Honesty and integrity' },
            ],
            comment_fields: [
              { id: 'strengths', label: 'Student Strengths', required: true },
              { id: 'areas_for_growth', label: 'Areas for Growth', required: false },
            ],
          },
        },
      }
    );
  }

  return NextResponse.json({ data: recommendation });
}
