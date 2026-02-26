'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Textarea,
  Checkbox,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@admissions-compass/ui';
import {
  GraduationCap,
  Loader2,
  CheckCircle2,
  Star,
} from 'lucide-react';

interface StudentInfo {
  name: string;
  grade: string;
  applying_to: string;
  current_school: string;
}

interface RatingCriterion {
  id: string;
  label: string;
  description: string;
}

const RATING_CRITERIA: RatingCriterion[] = [
  {
    id: 'academic_ability',
    label: 'Academic Ability',
    description: 'Overall intellectual ability and academic performance',
  },
  {
    id: 'work_ethic',
    label: 'Work Ethic & Motivation',
    description: 'Consistency of effort, self-motivation, and perseverance',
  },
  {
    id: 'intellectual_curiosity',
    label: 'Intellectual Curiosity',
    description: 'Eagerness to learn, asks thoughtful questions, explores ideas',
  },
  {
    id: 'character',
    label: 'Character & Integrity',
    description: 'Honesty, responsibility, respect for others',
  },
  {
    id: 'social_skills',
    label: 'Social Skills & Collaboration',
    description: 'Works well with peers, contributes to group settings',
  },
  {
    id: 'emotional_maturity',
    label: 'Emotional Maturity',
    description: 'Handles challenges and setbacks with resilience',
  },
  {
    id: 'creativity',
    label: 'Creativity & Critical Thinking',
    description: 'Demonstrates original thinking and problem-solving skills',
  },
  {
    id: 'leadership',
    label: 'Leadership Potential',
    description: 'Takes initiative, influences peers positively',
  },
];

const RATING_LABELS: Record<number, string> = {
  1: 'Below Average',
  2: 'Average',
  3: 'Above Average',
  4: 'Excellent',
  5: 'Outstanding',
};

interface RecommenderFormProps {
  token: string;
  studentInfo: StudentInfo;
  schoolName: string;
  onSubmitSuccess?: () => void;
}

export function RecommenderForm({
  token,
  studentInfo,
  schoolName,
  onSubmitSuccess,
}: RecommenderFormProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState({
    strengths: '',
    areas_for_growth: '',
    additional_comments: '',
    how_long_known: '',
  });
  const [overallRecommendation, setOverallRecommendation] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const allRated = RATING_CRITERIA.every((c) => ratings[c.id] !== undefined);
  const hasRequiredComments = comments.strengths.length > 0 && comments.how_long_known.length > 0;
  const canSubmit = allRated && hasRequiredComments && isConfidential && overallRecommendation;

  const handleRating = (criterionId: string, value: number) => {
    setRatings((prev) => ({ ...prev, [criterionId]: value }));
  };

  const handleSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/v1/recommendations/${token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ratings,
          comments,
          overall_recommendation: overallRecommendation,
          is_confidential: isConfidential,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        onSubmitSuccess?.();
      }
    } catch {
      // In mock mode, just mark as submitted
      setIsSubmitted(true);
      onSubmitSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Thank You!</h2>
        <p className="max-w-md text-muted-foreground">
          Your recommendation for {studentInfo.name} has been submitted successfully.
          The admissions team at {schoolName} will review it as part of the application process.
        </p>
        <p className="text-sm text-muted-foreground">
          You may safely close this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Info Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                Recommendation for {studentInfo.name}
              </CardTitle>
              <CardDescription>
                Applying to {schoolName}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm sm:grid-cols-3">
            <div>
              <span className="text-muted-foreground">Current Grade:</span>{' '}
              <span className="font-medium">{studentInfo.grade}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Applying to:</span>{' '}
              <span className="font-medium">{studentInfo.applying_to}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Current School:</span>{' '}
              <span className="font-medium">{studentInfo.current_school}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relationship */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Relationship</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="how-long">
              How long have you known this student, and in what capacity? *
            </Label>
            <Textarea
              id="how-long"
              placeholder="e.g., I have taught Emma in my 5th grade math class for the past year..."
              value={comments.how_long_known}
              onChange={(e) =>
                setComments((prev) => ({ ...prev, how_long_known: e.target.value }))
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rating Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assessment Ratings</CardTitle>
          <CardDescription>
            Please rate the student in each of the following areas on a scale of 1 to 5.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {RATING_CRITERIA.map((criterion) => (
            <div key={criterion.id} className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Label className="text-sm font-medium">{criterion.label}</Label>
                  <p className="text-xs text-muted-foreground">
                    {criterion.description}
                  </p>
                </div>
                {ratings[criterion.id] && (
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {RATING_LABELS[ratings[criterion.id]]}
                  </Badge>
                )}
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRating(criterion.id, value)}
                    className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                      ratings[criterion.id] === value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : ratings[criterion.id] && ratings[criterion.id] >= value
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                    }`}
                    title={RATING_LABELS[value]}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        ratings[criterion.id] && ratings[criterion.id] >= value
                          ? 'fill-current'
                          : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Written Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Written Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strengths">
              What are this student&#39;s greatest strengths? *
            </Label>
            <Textarea
              id="strengths"
              placeholder="Describe the student's most notable qualities and abilities..."
              value={comments.strengths}
              onChange={(e) =>
                setComments((prev) => ({ ...prev, strengths: e.target.value }))
              }
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="growth">
              What areas could the student improve or grow in?
            </Label>
            <Textarea
              id="growth"
              placeholder="Share any areas where the student could continue to develop..."
              value={comments.areas_for_growth}
              onChange={(e) =>
                setComments((prev) => ({
                  ...prev,
                  areas_for_growth: e.target.value,
                }))
              }
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additional">Additional Comments</Label>
            <Textarea
              id="additional"
              placeholder="Any other information you would like to share about this student..."
              value={comments.additional_comments}
              onChange={(e) =>
                setComments((prev) => ({
                  ...prev,
                  additional_comments: e.target.value,
                }))
              }
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Overall Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overall Recommendation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>How strongly do you recommend this student? *</Label>
            <Select
              value={overallRecommendation}
              onValueChange={setOverallRecommendation}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your recommendation level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highest_recommendation">
                  Highest Recommendation - Top 5% of students I have known
                </SelectItem>
                <SelectItem value="strong_recommendation">
                  Strong Recommendation - Top 15% of students
                </SelectItem>
                <SelectItem value="recommendation">
                  Recommendation - Above average student
                </SelectItem>
                <SelectItem value="recommendation_with_reservation">
                  Recommendation with Reservation
                </SelectItem>
                <SelectItem value="no_recommendation">
                  Cannot Recommend at This Time
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Confidential Acknowledgment */}
          <div className="flex items-start space-x-3 rounded-lg border p-4">
            <Checkbox
              id="confidential"
              checked={isConfidential}
              onCheckedChange={(checked) => setIsConfidential(checked === true)}
            />
            <div className="space-y-1">
              <Label htmlFor="confidential" className="cursor-pointer font-medium">
                Confidentiality Acknowledgment
              </Label>
              <p className="text-xs text-muted-foreground">
                I understand that this recommendation will be treated as confidential and
                will be shared with the admissions committee at {schoolName}. The family
                has waived their right to view this recommendation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!canSubmit || isSubmitting}
          onClick={() => setShowConfirmDialog(true)}
          className="min-h-[48px] w-full sm:w-auto"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          )}
          Submit Recommendation
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              You are about to submit your recommendation for {studentInfo.name}.
              This action cannot be undone. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Yes, Submit Recommendation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
