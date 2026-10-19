import assert from 'node:assert/strict';
import {
  calculateAssessmentResult,
  type AssessmentAnswerMap,
  type AssessmentRecommendation,
} from './assessmentLogic.js';

const answers: AssessmentAnswerMap = {
  q_activity: 'repair',
  q_work_style: 'hands_on',
  q_environment: 'outdoor',
  q_support: 'problem_solver',
  q_training: 'medium',
  q_preference: 'practical',
};

const result = calculateAssessmentResult(answers);
assert.equal(result.recommendations.length >= 2, true);
assert.equal(result.recommendations[0].careerId, 'career-001');
assert.match(result.recommendations[0].explanation, /Electrician|repair|technical/i);
assert.equal(result.missingQuestions.length, 0);

const tieAnswers: AssessmentAnswerMap = {
  q_activity: 'help',
  q_work_style: 'people',
  q_environment: 'people',
  q_support: 'caring',
  q_training: 'short',
  q_preference: 'people',
};

const tieResult = calculateAssessmentResult(tieAnswers);
assert.ok(
  tieResult.recommendations.some((item: AssessmentRecommendation) => item.careerId === 'career-002'),
);

console.log('assessment logic tests passed');
