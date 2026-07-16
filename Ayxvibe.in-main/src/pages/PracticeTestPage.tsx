import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GlassCard } from '../components/ui/GlassCard'
import { PillButton } from '../components/ui/PillButton'

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number // index of correct option
  explanation: string
}

const mockIeltsQuestions: Question[] = [
  {
    id: 1,
    text: "According to the text, what is the primary driver of white-collar workforce automation?",
    options: [
      "Standard industrial machinery and factory robotics",
      "Large Language Models and advanced AI systems",
      "Decreasing student enrollments in global universities",
      "Increasing minimum wage regulations in developed countries"
    ],
    correctAnswer: 1,
    explanation: "Paragraph 1 states that Large Language Models (LLMs) and advanced AI systems are the primary engines automating white-collar tasks."
  },
  {
    id: 2,
    text: "Software engineering and creative writing are examples of industries experiencing:",
    options: [
      "No change from automated technologies",
      "Total elimination of human managers and leads",
      "Significant disruption and transition of skills",
      "An increase in physical manual labor demand"
    ],
    correctAnswer: 2,
    explanation: "Paragraph 2 details how software engineering and creative writing are experiencing disruption, shifting human focus from syntax creation to high-level system editing."
  },
  {
    id: 3,
    text: "Complete the following statement: The text asserts that _______ is emerging as a critical skill to instruct AI models effectively.",
    options: [
      "Prompt engineering",
      "Database administration",
      "C++ compiler optimization",
      "Graphic illustration"
    ],
    correctAnswer: 0,
    explanation: "Paragraph 3 highlights that 'prompt engineering' has emerged as a key competency to instruct LLMs and elicit optimal outputs."
  },
  {
    id: 4,
    text: "True or False: Traditional educational institutions have fully adapted to the rapid rise of generative AI.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 1,
    explanation: "Paragraph 4 explains that traditional academic structures are lagging behind the pace of tech disruption, requiring specialized academies to bridge the training gap."
  },
  {
    id: 5,
    text: "Which sector is NOT mentioned in the text as being directly impacted by generative AI?",
    options: [
      "Software development",
      "Agricultural harvesting",
      "Creative copywriting",
      "Administrative business support"
    ],
    correctAnswer: 1,
    explanation: "While software engineering, copywriting, and white-collar business roles are mentioned, agricultural harvesting is not discussed in this passage."
  }
]

export const PracticeTestPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>()
  console.log("Simulating practice test for:", testId)
  const navigate = useNavigate()

  // State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const timerRef = useRef<any>(null)

  // Timer effect
  useEffect(() => {
    if (isSubmitted) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isSubmitted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }))
  }

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsSubmitted(true)
  }

  const handleReset = () => {
    setAnswers({})
    setTimeLeft(600)
    setCurrentQuestionIdx(0)
    setIsSubmitted(false)
  }

  // Scoring
  const getScore = () => {
    let score = 0
    mockIeltsQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score++
      }
    })
    return score
  }

  const getBandScore = (score: number) => {
    if (score === 5) return { band: '9.0', desc: 'Expert User', color: 'text-emerald-500' }
    if (score === 4) return { band: '8.0', desc: 'Very Good User', color: 'text-emerald-400' }
    if (score === 3) return { band: '7.0', desc: 'Good User', color: 'text-indigo-500' }
    if (score === 2) return { band: '6.0', desc: 'Competent User', color: 'text-amber-500' }
    return { band: '5.0', desc: 'Modest User', color: 'text-rose-500' }
  }

  const score = getScore()
  const bandInfo = getBandScore(score)
  const currentQuestion = mockIeltsQuestions[currentQuestionIdx]

  return (
    <div className="py-6 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop min-h-[90vh] flex flex-col gap-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white/40 border border-white/20 rounded-2xl p-5 gap-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/15 rounded-xl flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined">assignment</span>
          </div>
          <div>
            <h1 className="text-headline-md text-primary font-bold uppercase tracking-tight">IELTS Mock Reading Simulator</h1>
            <p className="text-xs text-on-surface-variant">Topic: AI and the Global Skilled Labor Force</p>
          </div>
        </div>

        {!isSubmitted && (
          <div className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-sm font-headline font-black ${timeLeft < 120 ? 'bg-red-50 text-red-500 border-red-200 animate-pulse' : 'bg-white/60 border-white/60 text-primary'}`}>
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span>Time Remaining: {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {!isSubmitted ? (
        /* Exam Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Passage Column (Left) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <GlassCard hoverable={false} className="p-6 md:p-8 flex flex-col gap-5 border border-white/40 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto custom-scrollbar">
              <h2 className="text-headline-sm text-primary font-bold border-b border-white/30 pb-3">Reading Passage</h2>
              
              <div className="text-sm text-on-surface-variant leading-relaxed space-y-4 font-body">
                <p className="font-bold text-primary italic">Instructions: Read the passage below and answer questions 1–5.</p>
                
                <h3 className="text-md font-bold text-primary pt-2">The Rise of Generative AI in the Global Workforce</h3>
                <p>
                  <strong>[Paragraph 1]</strong> The rapid emergence and proliferation of generative Artificial Intelligence (AI) and Large Language Models (LLMs) represent a significant structural shift in the global labor market. Unlike previous waves of automation, which primarily impacted manual and repetitive manufacturing tasks, this digital revolution targets white-collar roles. Complex cognitive functions, content writing, data aggregation, and first-line customer communication can now be completed autonomously by software agents, causing organizations to evaluate their staffing paradigms.
                </p>
                <p>
                  <strong>[Paragraph 2]</strong> Prominent fields such as software engineering and creative copywriting are experiencing immediate transitions. Rather than completely replacing human staff, AI acts as a leverage multiplier. For instance, developers utilize AI assistants to write standard functions and boilerplate codes. This allows junior and senior staff to shift their primary attention from syntax creation to high-level architecture design and security auditing. However, this transition requires immediate upskilling; professionals who fail to integrate these tools risk redundancy.
                </p>
                <p>
                  <strong>[Paragraph 3]</strong> Consequently, novel paradigms are emerging. Most notably, prompt engineering—the process of structuring questions and instructions to elicit optimal responses from AI systems—has transformed from an obscure hack to a core technology competency. A prompt engineer acts as a translator between complex business requirements and natural language processing interfaces. Competency in this domain requires deep logical parsing, clarity of syntax, and understanding the core behavioral traits of generative models.
                </p>
                <p>
                  <strong>[Paragraph 4]</strong> This rapid transition has caught traditional educational institutions off-guard. Curriculum updates in public universities often require years of administrative approvals, leaving a significant training gap. Private academies, bootcamps, and modern learning platforms (such as the VIBE Academy Hub) have stepped in to fill this vacuum. These platforms offer intensive, practical programs designed to prepare students for the global remote workforce where proficiency in generative tools is increasingly treated as a baseline requirement.
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Questions Column (Right) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <GlassCard hoverable={false} className="p-6 md:p-8 flex flex-col gap-6 border border-white/40">
              
              {/* Progress and Nav */}
              <div className="flex justify-between items-center border-b border-white/20 pb-4">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider font-headline">
                  Question {currentQuestionIdx + 1} of {mockIeltsQuestions.length}
                </span>
                
                <div className="flex gap-1">
                  {mockIeltsQuestions.map((_, idx) => {
                    const isAnswered = answers[mockIeltsQuestions[idx].id] !== undefined
                    const isCurrent = idx === currentQuestionIdx
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIdx(idx)}
                        className={`w-7 h-7 rounded-full text-xs font-headline font-bold flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'bg-primary text-white scale-110 shadow-sm'
                            : isAnswered
                            ? 'bg-secondary/15 text-secondary border border-secondary/20'
                            : 'bg-white/50 border border-white/40 text-on-surface-variant hover:bg-white/80'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-4">
                <h3 className="font-headline text-headline-sm text-primary font-bold leading-snug">
                  {currentQuestion.text}
                </h3>

                {/* Options List */}
                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = answers[currentQuestion.id] === idx
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(currentQuestion.id, idx)}
                        className={`text-left p-4 rounded-2xl border text-sm transition-all duration-200 flex items-start gap-3 select-none ${
                          isSelected
                            ? 'bg-secondary/10 border-secondary text-primary font-medium shadow-sm'
                            : 'bg-white/50 border-white/80 text-on-surface-variant hover:bg-white/80'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-xs font-headline font-bold ${
                          isSelected
                            ? 'bg-secondary border-secondary text-white'
                            : 'border-[#c5c5d3] text-on-surface-variant'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex justify-between items-center border-t border-white/20 pt-6 mt-4">
                <PillButton
                  variant="secondary"
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                  className="flex items-center gap-1 !py-2 !px-4 text-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  Previous
                </PillButton>

                {currentQuestionIdx < mockIeltsQuestions.length - 1 ? (
                  <PillButton
                    variant="secondary"
                    onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                    className="flex items-center gap-1 !py-2 !px-4 text-xs"
                  >
                    Next
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </PillButton>
                ) : (
                  <PillButton
                    variant="primary"
                    onClick={handleSubmit}
                    className="flex items-center gap-1.5 !py-2 !px-5 text-xs bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] !border-none"
                  >
                    Submit Test
                    <span className="material-symbols-outlined text-[16px]">done_all</span>
                  </PillButton>
                )}
              </div>

            </GlassCard>
          </div>

        </div>
      ) : (
        /* Results Screen */
        <div className="max-w-2xl mx-auto w-full">
          <GlassCard hoverable={false} className="p-8 md:p-12 flex flex-col items-center text-center gap-6 border border-white/40 shadow-lg bg-white/40">
            <div className="w-20 h-20 bg-secondary/15 rounded-full flex items-center justify-center text-secondary relative mb-2">
              <span className="absolute inset-0 rounded-full bg-secondary/10 animate-ping" />
              <span className="material-symbols-outlined text-4xl select-none">military_tech</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-display-sm text-primary font-black">Test Completed!</h2>
              <p className="text-sm text-on-surface-variant">Here is your estimated band score based on your answers.</p>
            </div>

            {/* Score Showcase */}
            <div className="grid grid-cols-2 gap-8 w-full max-w-md bg-white/60 border border-white/80 p-6 rounded-2xl shadow-sm my-4">
              <div className="text-center border-r border-white/40">
                <div className="text-3xl font-black text-primary">{score} / {mockIeltsQuestions.length}</div>
                <div className="text-[11px] text-on-surface-variant uppercase tracking-wider mt-1 font-headline">Raw Score</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-black ${bandInfo.color}`}>{bandInfo.band}</div>
                <div className="text-[11px] text-on-surface-variant uppercase tracking-wider mt-1 font-headline">{bandInfo.desc}</div>
              </div>
            </div>

            {/* Personalized Guidance */}
            <div className="bg-white/40 border border-white/30 rounded-2xl p-6 text-left w-full space-y-4">
              <h3 className="font-headline text-label-md text-primary font-bold uppercase tracking-wider">Expert Recommendations</h3>
              
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {score === 5 
                  ? "Outstanding! You demonstrate native-level reading comprehension. Your understanding of complex white-collar vocabulary and rapid logical scanning is exceptional. You are fully ready to challenge the official academic exam."
                  : score >= 3
                  ? "Great job! You have a solid grasp of structure, keyword scanning, and inference. To reach a Band 8.5+, focus on tricky synonyms and time management drills during your mock tests."
                  : "Good effort! You can identify core themes, but struggle with precise inference and scanning. We recommend checking out our IELTS Academic Intensive Prep course in the Academy Hub."
                }
              </p>

              <div className="border-t border-white/20 pt-4 flex flex-col gap-2">
                <h4 className="text-xs font-bold text-primary font-headline">SUGGESTED NEXT STEPS</h4>
                <ul className="text-xs text-on-surface-variant list-disc pl-4 space-y-1">
                  <li>Analyze the explanations for any missed questions below.</li>
                  <li>Check out the IELTS bootcamps in the <strong>Academy Hub</strong>.</li>
                  <li>Schedule a free call with our Language consultants for visa scoring rules.</li>
                </ul>
              </div>
            </div>

            {/* Review Section */}
            <div className="w-full text-left space-y-4 mt-6">
              <h3 className="font-headline text-headline-sm text-primary font-bold">Review Questions</h3>
              
              <div className="space-y-4">
                {mockIeltsQuestions.map((q, idx) => {
                  const selectedAns = answers[q.id]
                  const isCorrect = selectedAns === q.correctAnswer
                  
                  return (
                    <div key={q.id} className={`p-5 rounded-2xl border ${isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/40 border-red-200'} flex flex-col gap-3`}>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-primary text-sm flex items-start gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-headline ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                            {idx + 1}
                          </span>
                          {q.text}
                        </h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      <div className="text-xs space-y-1 pl-7">
                        <p className="text-on-surface-variant">
                          Your answer: <span className="font-bold text-primary">{selectedAns !== undefined ? q.options[selectedAns] : 'Not Answered'}</span>
                        </p>
                        {!isCorrect && (
                          <p className="text-on-surface-variant">
                            Correct answer: <span className="font-bold text-emerald-700">{q.options[q.correctAnswer]}</span>
                          </p>
                        )}
                        <p className="text-outline italic mt-2 border-t border-white/20 pt-2">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-wrap justify-center gap-4 w-full border-t border-white/25 pt-8 mt-6">
              <PillButton variant="secondary" onClick={handleReset} className="flex items-center gap-1.5 !py-2.5 font-bold uppercase">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                Retake Exam
              </PillButton>
              <PillButton variant="primary" onClick={() => navigate('/tests')} className="flex items-center gap-1.5 !py-2.5 bg-gradient-to-r from-primary to-primary-container !border-none font-bold uppercase">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to Directory
              </PillButton>
            </div>

          </GlassCard>
        </div>
      )}
    </div>
  )
}
export default PracticeTestPage
