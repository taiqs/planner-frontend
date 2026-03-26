import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, CheckCircle, ArrowRight, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const QUESTIONS = [
    {
        id: 'q1',
        part: 'Funcionamento Cognitivo',
        text: 'Quando você precisa aprender algo novo, o que mais te ajuda?',
        options: [
            { label: 'Ver imagens, gráficos ou vídeos', value: 1 },
            { label: 'Ouvir explicações', value: 1 },
            { label: 'Ler e/ou escrever', value: 1 },
            { label: 'Praticar/fazer na prática', value: 1 },
            { label: 'Depende muito da situação', value: 2 },
            { label: 'Tenho dificuldade independentemente do método', value: 3 }
        ]
    },
    {
        id: 'q2',
        part: 'Funcionamento Cognitivo',
        text: 'Sobre sua atenção e concentração, você diria que:',
        options: [
            { label: 'Consigo manter o foco com facilidade, mesmo por longos períodos', value: 1 },
            { label: 'Me distraio um pouco, mas consigo retomar o foco', value: 2 },
            { label: 'Me distraio com frequência, principalmente em tarefas longas', value: 3 },
            { label: 'Só consigo focar em coisas que me interessam muito', value: 4 },
            { label: 'Tenho muita dificuldade de manter atenção, mesmo em tarefas importantes', value: 5 }
        ]
    },
    {
        id: 'q3',
        part: 'Funcionamento Cognitivo',
        text: 'Como você se organiza para realizar suas tarefas do dia a dia?',
        options: [
            { label: 'Planejo tudo com antecedência e sigo um roteiro', value: 1 },
            { label: 'Faço listas ou uso algum método de organização', value: 2 },
            { label: 'Me organizo mentalmente, sem anotar muito', value: 3 },
            { label: 'Costumo deixar para resolver na hora', value: 4 },
            { label: 'Tenho dificuldade de me organizar e frequentemente me perco nas tarefas', value: 5 }
        ]
    },
    {
        id: 'q4',
        part: 'Funcionamento Cognitivo',
        text: 'Quando surge um problema inesperado, você geralmente:',
        options: [
            { label: 'Resolve rapidamente e com confiança', value: 1 },
            { label: 'Pensa um pouco e encontra uma solução', value: 2 },
            { label: 'Fica em dúvida, mas tenta resolver', value: 3 },
            { label: 'Prefere pedir ajuda', value: 4 },
            { label: 'Evita ou se sente travado diante da situação', value: 5 }
        ]
    },
    {
        id: 'q5',
        part: 'Personalidade',
        text: 'Quando você sente emoções difíceis (raiva, tristeza, frustração), você costuma:',
        options: [
            { label: 'Lidar bem e entender o que está sentindo', value: 1 },
            { label: 'Expressar e conversar com alguém', value: 2 },
            { label: 'Tentar controlar e guardar para si', value: 3 },
            { label: 'Reagir impulsivamente às vezes', value: 4 },
            { label: 'Ter dificuldade de lidar e se sentir sobrecarregado(a)', value: 5 }
        ]
    },
    {
        id: 'q6',
        part: 'Personalidade',
        text: 'Em relação ao seu jeito social, você se considera:',
        options: [
            { label: 'Mais reservado(a) e introspectivo(a)', value: 1 },
            { label: 'Um pouco reservado(a), dependendo do ambiente', value: 2 },
            { label: 'Equilibrado(a), varia conforme a situação', value: 3 },
            { label: 'Mais comunicativo(a) e sociável', value: 4 },
            { label: 'Muito expansivo(a), gosto de estar com pessoas o tempo todo', value: 5 }
        ]
    },
    {
        id: 'q7',
        part: 'Personalidade',
        text: 'O que mais te motiva no dia a dia?',
        options: [
            { label: 'Metas e resultados', value: 1 },
            { label: 'Reconhecimento e valorização', value: 2 },
            { label: 'Rotina e estabilidade', value: 3 },
            { label: 'Desafios e novidades', value: 4 },
            { label: 'Depende muito do momento', value: 5 },
            { label: 'Tenho dificuldade de me sentir motivado(a)', value: 6 }
        ]
    },
    {
        id: 'q8',
        part: 'Personalidade',
        text: 'Quando algo não sai como você esperava, você geralmente:',
        options: [
            { label: 'Lida bem e tenta novamente', value: 1 },
            { label: 'Fica frustrado(a), mas consegue seguir em frente', value: 2 },
            { label: 'Fica pensando bastante no que deu errado', value: 3 },
            { label: 'Se culpa ou se cobra muito', value: 4 },
            { label: 'Evita tentar de novo ou desiste facilmente', value: 5 }
        ]
    }
];

export function AssessmentQuiz() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(-1);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [score, setScore] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleStart = () => setCurrentStep(0);

    const handleAnswer = (questionId: string, value: number, label: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: label }));
        setScore(prev => prev + value);

        if (currentStep < QUESTIONS.length - 1) {
            setTimeout(() => setCurrentStep(prev => prev + 1), 300);
        } else {
            finishQuiz(score + value, { ...answers, [questionId]: label });
        }
    };

    const finishQuiz = async (finalScore: number, finalAnswers: any) => {
        setIsSubmitting(true);
        let calculatedResult = "";
        
        // Ajuste de pontuação baseado em 8 perguntas
        if (finalScore <= 12) calculatedResult = "Perfil Funcional e Equilibrado";
        else if (finalScore <= 22) calculatedResult = "Perfil em Desenvolvimento";
        else calculatedResult = "Perfil com Necessidade de Suporte";

        try {
            await api.post('/assessments', {
                assessmentType: "PERFIL_COGNITIVO",
                score: finalScore,
                resultType: calculatedResult,
                answers: finalAnswers
            });
            setResult(calculatedResult);
        } catch (error) {
            console.error(error);
            toast.error("Você precisa estar logado para salvar seu resultado!");
            navigate('/login');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (result) {
        return (
            <div className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px', paddingBottom: '100px' }}>
                <header style={{ marginBottom: '32px' }}>
                    <button className="btn-secondary" style={{ padding: '8px', borderRadius: '12px' }} onClick={() => navigate('/dashboard')}>
                        <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} /> Voltar
                    </button>
                </header>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--co-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <Brain size={40} />
                        </div>
                        <h1 style={{ fontSize: '1.5rem', color: 'var(--co-primary)', marginBottom: '8px' }}>Seu Mapeamento Concluído:</h1>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--co-accent)', marginBottom: '16px' }}>{result}</h2>

                        <p className="text-muted" style={{ lineHeight: 1.6, marginBottom: '32px', fontSize: '1rem' }}>
                            {score > 22 ? 'Suas respostas indicam que você pode estar enfrentando desafios significativos em sua organização cognitiva ou regulação emocional. No entanto, lembre-se que cada mente é única! Uma investigação mais profunda pode revelar grandes potenciais.' :
                                score > 12 ? 'Você apresenta um equilíbrio razoável, com oscilações normais decorrentes do dia a dia. Há pontos que podem ser otimizados para garantir mais leveza e produtividade na sua rotina.' :
                                    'Seu perfil demonstra boas estratégias de resolução e um funcionamento cognitivo estável. Você lida bem com a maioria das situações apresentadas no questionário.'}
                        </p>
                    </motion.div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', background: 'var(--co-lavender)', borderColor: 'var(--co-accent)' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--co-primary)' }}>Avaliação Neuropsicológica</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--co-text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                        Este questionário é um rastreio qualitativo. Para entender profundamente seu funcionamento cerebral (atenção, memória, personalidade), agende sua avaliação completa.
                    </p>
                    <button
                        className="btn-primary"
                        style={{ width: '100%', padding: '16px', borderRadius: '16px', marginBottom: '12px', background: 'var(--co-accent)', color: 'white', border: 'none' }}
                        onClick={() => navigate('/avaliacao-neuropsicologica')}
                    >
                        Conhecer a Avaliação
                    </button>
                    <button
                        className="btn-secondary"
                        style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: 'transparent', color: 'var(--co-text-muted)' }}
                        onClick={() => navigate('/dashboard')}
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px', paddingBottom: '100px' }}>
            <header style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                <button
                    className="btn-secondary"
                    style={{ padding: '8px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'var(--co-lavender)' }}
                    onClick={() => navigate('/dashboard')}
                >
                    <X size={20} color="var(--co-text-muted)" />
                </button>
            </header>
            {currentStep === -1 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--co-serene-blue)', color: 'var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                        <Brain size={40} />
                    </div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--co-primary)', marginBottom: '16px' }}>Perfil Cognitivo e Personalidade</h1>
                    <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: 1.5, marginBottom: '40px' }}>
                        Um questionário interativo de 8 perguntas para ajudar a mapear como sua mente organiza informações, lida com distrações e constrói foco no dia a dia.
                    </p>
                    <button className="btn-primary" style={{ padding: '16px 32px', borderRadius: '24px', fontSize: '1.1rem', display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--co-accent)', color: 'white', border: 'none' }} onClick={handleStart}>
                        Começar Avaliação <ArrowRight size={20} />
                    </button>
                    <p style={{ fontSize: '0.8rem', color: 'var(--co-text-muted)', marginTop: '24px' }}>*Este é um pré-teste qualitativo para apoio clínico.</p>
                </motion.div>
            ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingTop: '16px' }}>
                        <button className="btn-secondary" style={{ padding: '8px', borderRadius: '12px' }} onClick={() => currentStep === 0 ? setCurrentStep(-1) : setCurrentStep(prev => prev - 1)}>
                            <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        <div style={{ flex: 1, height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: 'var(--co-accent)', width: `${((currentStep + 1) / QUESTIONS.length) * 100}%`, transition: 'width 0.3s ease' }} />
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--co-text-muted)', fontWeight: 600 }}>{currentStep + 1}/{QUESTIONS.length}</span>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <span style={{ background: 'var(--co-lavender)', color: 'var(--co-accent)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {QUESTIONS[currentStep].part}
                        </span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            style={{ flex: 1 }}
                        >
                            <h2 style={{ fontSize: '1.3rem', lineHeight: 1.4, color: 'var(--co-primary)', marginBottom: '32px' }}>
                                {QUESTIONS[currentStep].text}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {QUESTIONS[currentStep].options.map((opt, i) => (
                                    <button
                                        key={i}
                                        className="btn-secondary"
                                        style={{ padding: '16px', borderRadius: '16px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--co-white)', border: '2px solid transparent', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'all 0.2s', fontSize: '1rem', color: 'var(--co-text-dark)' }}
                                        onClick={() => handleAnswer(QUESTIONS[currentStep].id, opt.value, opt.label)}
                                    >
                                        <span style={{ flex: 1 }}>{opt.label}</span>
                                        {answers[QUESTIONS[currentStep].id] === opt.label && <CheckCircle size={20} color="var(--co-accent)" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            {isSubmitting && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <Loader2 size={40} className="animate-spin" color="var(--co-accent)" style={{ marginBottom: '16px' }} />
                    <h2 style={{ color: 'var(--co-primary)' }}>Mapeando perfil...</h2>
                </div>
            )}
        </div>
    );
}
