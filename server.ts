import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to sanitize JSON response from Gemini
function cleanJsonResponse(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// 1. Start Interview Endpoint
app.post('/api/interview/start', async (req: Request, res: Response) => {
  try {
    const { name, jobRole, experienceLevel, interviewType, totalQuestions } = req.body;

    if (!ai) {
      // Fallback if API key is not set
      return res.json({
        question: interviewType === 'Technical'
          ? `Hello ${name || 'there'}! Let's begin your technical interview for the ${jobRole} position. Can you explain the core concepts and architecture of ${jobRole} that you work with most often?`
          : `Hello ${name || 'there'}! Welcome to your HR interview for the ${jobRole} role. Could you briefly introduce yourself and explain why you are interested in this position?`,
        difficulty: 'Standard',
        hint: 'Highlight relevant projects, technologies, and clear communication.',
      });
    }

    const prompt = `You are an expert interviewer conducting a real-time ${interviewType} interview for a candidate.
Candidate Profile:
- Name: ${name || 'Candidate'}
- Target Role: ${jobRole}
- Experience Level: ${experienceLevel} (Fresher or Experienced)
- Interview Type: ${interviewType} (Technical or HR)
- Total Questions in Session: ${totalQuestions || 5}

Generate the FIRST question (Question 1 of ${totalQuestions || 5}).
Requirements:
- If Technical: Ask a realistic, foundational technical question directly relevant to ${jobRole} suited for a ${experienceLevel}.
- If HR: Ask a relevant introductory behavioral or motivational question suited for a ${experienceLevel}.
- Keep the question conversational, clear, and direct.
- Also provide a short 1-sentence tip/hint that guides the candidate on what a strong answer should touch on.

Respond in pure JSON matching this schema:
{
  "question": string,
  "difficulty": "Introductory" | "Standard" | "Advanced",
  "hint": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            hint: { type: Type.STRING },
          },
          required: ['question', 'difficulty', 'hint'],
        },
      },
    });

    const parsed = cleanJsonResponse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/interview/start:', error);
    res.status(500).json({
      error: 'Failed to generate initial question',
      message: error?.message || 'Unknown error',
    });
  }
});

// 2. Evaluate Answer and Generate Next Question (Adaptive)
app.post('/api/interview/evaluate-and-next', async (req: Request, res: Response) => {
  try {
    const {
      name,
      jobRole,
      experienceLevel,
      interviewType,
      currentQuestionNumber,
      totalQuestions,
      currentQuestion,
      userAnswer,
      currentDifficulty,
      history,
    } = req.body;

    const isLastQuestion = Number(currentQuestionNumber) >= Number(totalQuestions);

    if (!ai) {
      // Fallback when API key is missing
      const wordCount = (userAnswer || '').trim().split(/\s+/).length;
      const score = Math.min(10, Math.max(3, Math.round(wordCount / 6)));
      return res.json({
        evaluation: {
          score,
          verdict: score >= 8 ? 'Strong Answer' : score >= 5 ? 'Good Effort' : 'Needs More Detail',
          feedback: `Good attempt, ${name}. Your answer touched on important aspects. Consider providing more concrete technical depth and examples.`,
          keyTakeaways: [
            'Clear communication of high-level concepts',
            'Can improve by citing specific real-world examples or use-cases',
          ],
        },
        nextDifficulty: score >= 8 ? 'Advanced' : score >= 5 ? 'Standard' : 'Introductory',
        nextQuestion: isLastQuestion
          ? null
          : `Follow-up question ${currentQuestionNumber + 1}: How would you handle common errors or optimize performance in a typical ${jobRole} workflow?`,
        nextHint: isLastQuestion ? '' : 'Focus on best practices and prevention strategies.',
        isComplete: isLastQuestion,
      });
    }

    const prompt = `You are evaluating a candidate's answer in an active job interview and generating the subsequent question.
Context:
- Candidate Name: ${name || 'Candidate'}
- Target Role: ${jobRole}
- Level: ${experienceLevel}
- Interview Type: ${interviewType}
- Current Question #${currentQuestionNumber} of ${totalQuestions}
- Question Asked: "${currentQuestion}"
- Current Question Difficulty: "${currentDifficulty || 'Standard'}"
- Candidate's Submitted Answer: "${userAnswer}"
- Is this the final question of the interview?: ${isLastQuestion}

Evaluation Guidelines:
1. Score the answer from 1 to 10 (10 = outstanding, comprehensive; 7-8 = solid, good knowledge; 5-6 = acceptable/partial; 1-4 = poor, vague, or inaccurate).
2. Write a brief, constructive feedback paragraph (2-3 sentences) directly addressing the candidate. Be encouraging yet realistic.
3. List 2-3 key takeaways or expected points that make a complete answer.
4. Difficulty Adaptation:
   - If score >= 8: increase difficulty to "Advanced" or probe deeper into architectural trade-offs, edge cases, or leadership.
   - If score >= 5 and < 8: keep at "Standard" difficulty.
   - If score < 5: adjust to "Introductory" or ask a more accessible foundational question to build confidence.
5. If isLastQuestion is false:
   - Generate the NEXT question (Question #${currentQuestionNumber + 1}) tailored to the adjusted difficulty. Do NOT repeat previous questions.
   - Provide a 1-sentence helpful hint for the next question.
6. If isLastQuestion is true:
   - nextQuestion should be null or empty string, nextHint should be empty string.

Respond in JSON format:
{
  "evaluation": {
    "score": number,
    "verdict": string,
    "feedback": string,
    "keyTakeaways": [string]
  },
  "nextDifficulty": "Introductory" | "Standard" | "Advanced",
  "nextQuestion": string | null,
  "nextHint": string,
  "isComplete": boolean
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            evaluation: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                verdict: { type: Type.STRING },
                feedback: { type: Type.STRING },
                keyTakeaways: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['score', 'verdict', 'feedback', 'keyTakeaways'],
            },
            nextDifficulty: { type: Type.STRING },
            nextQuestion: { type: Type.STRING, nullable: true },
            nextHint: { type: Type.STRING },
            isComplete: { type: Type.BOOLEAN },
          },
          required: ['evaluation', 'nextDifficulty', 'isComplete'],
        },
      },
    });

    const parsed = cleanJsonResponse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/interview/evaluate-and-next:', error);
    res.status(500).json({
      error: 'Failed to evaluate answer',
      message: error?.message || 'Unknown error',
    });
  }
});

// 3. Final Result Report
app.post('/api/interview/finish', async (req: Request, res: Response) => {
  try {
    const { name, jobRole, experienceLevel, interviewType, qaPairs } = req.body;

    if (!ai) {
      const avgScore =
        Array.isArray(qaPairs) && qaPairs.length > 0
          ? Math.round(
              (qaPairs.reduce((acc: number, curr: any) => acc + (curr.score || 7), 0) /
                (qaPairs.length * 10)) *
                100,
            )
          : 78;

      return res.json({
        overallScore: avgScore,
        performanceLevel: avgScore >= 80 ? 'Excellent' : avgScore >= 60 ? 'Good' : 'Needs Practice',
        summary: `${name || 'Candidate'} displayed good foundational knowledge for the ${jobRole} position. With structured practice on system design and depth of explanation, performance will be top-tier.`,
        strengths: [
          'Clear understanding of core principles',
          'Structured logical flow when answering questions',
          'Adaptability to various interview topics',
        ],
        areasToImprove: [
          'Elaborate more on practical tradeoffs and metrics',
          'Incorporate industry best practices and edge cases',
        ],
        improvementSuggestions: [
          'Practice explaining complex concepts using the STAR (Situation, Task, Action, Result) method.',
          'Review deep-dive topics for ' + jobRole + ' specifically around production debugging and scaling.',
          'Prepare specific code or architecture examples from past work experience.',
        ],
      });
    }

    const prompt = `You are an executive hiring manager and expert interview assessor.
Synthesize the complete interview results for this candidate:
- Candidate Name: ${name || 'Candidate'}
- Target Role: ${jobRole}
- Experience Level: ${experienceLevel}
- Interview Type: ${interviewType}

Transcript and Evaluations:
${JSON.stringify(qaPairs, null, 2)}

Provide a comprehensive, encouraging, and highly actionable final interview report:
1. overallScore: integer from 0 to 100 representing the cumulative performance score.
2. performanceLevel: e.g. "Exceptional" (85-100), "Proficient" (70-84), "Developing" (55-69), or "Needs Practice" (<55).
3. summary: 2-3 sentences summarizing overall readiness and impression.
4. strengths: 3-4 specific strengths observed from their actual responses.
5. areasToImprove: 2-3 specific areas they should sharpen.
6. improvementSuggestions: 2-3 concise, high-impact suggestions for their next real interview.

Respond in pure JSON matching this schema:
{
  "overallScore": number,
  "performanceLevel": string,
  "summary": string,
  "strengths": [string],
  "areasToImprove": [string],
  "improvementSuggestions": [string]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            performanceLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            areasToImprove: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            improvementSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'overallScore',
            'performanceLevel',
            'summary',
            'strengths',
            'areasToImprove',
            'improvementSuggestions',
          ],
        },
      },
    });

    const parsed = cleanJsonResponse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/interview/finish:', error);
    res.status(500).json({
      error: 'Failed to generate final report',
      message: error?.message || 'Unknown error',
    });
  }
});

// Setup Vite middleware in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Interviewer server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
