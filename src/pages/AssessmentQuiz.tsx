import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, CheckCircle, ArrowRight, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const QUESTIONS = [
    {
        id: 'q1',
        text: 'Com que frequência você sente que sua mente está acelerada a ponto de não conseguir focar em uma única tarefa?',
        options: [
            { label: 'Raramente', value: 1 },
            { label: 'Algumas vezes', value: 2 },
            { label: 'Quase sempre', value: 3 }
        ]
    },
    {
        id: 'q2',
        text: 'Quando precisa estudar ou trabalhar em algo chato, o que acontece?',
        options: [
            { label: 'Faço e pronto', value: 1 },
            { label: 'Procrastino um pouco, mas entrego', value: 2 },
            { label: 'Mudo de aba 10 vezes e perco o prazo', value: 3 }
        ]
    },
    {
        id: 'q3',
        text: 'Onde estão suas chaves ou celular neste momento?',
        options: [
            { label: 'Exatamente onde deixei', value: 1 },
            { label: 'Preciso pensar dois segundos', value: 2 },
            { label: 'Boa pergunta... vou ligar para o meu próprio número', value: 3 }
        ]
    },
    {
        id: 'q4',
        text: 'Como você lida com ambientes muito barulhentos?',
        options: [
            { label: 'Não me incomoda', value: 1 },
            { label: 'Incomoda, mas tolero', value: 2 },
            { label: 'Fico extremamente cansado/irritado', value: 3 }
        ]
    },
    {
        id: 'q5',
        text: 'Quantos hobbies diferentes você tentou iniciar nos últimos 6 meses?',
        options: [
            { label: 'Nenhum ou um', value: 1 },
            { label: 'Dois ou três', value: 2 },
            { label: 'Perdi as contas, já comprei kits de pintura e violão', value: 3 }
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
        if (finalScore <= 6) calculatedResult = "Foco Estável e Metódico";
        else if (finalScore <= 11) calculatedResult = "Perfil Flexível / Moderado";
        else calculatedResult = "Mente Acelerada / Criativa (Traços de Desatenção)";

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
            toast.error("Você precisa estar logado na plataforma para salvar seu resultado!");
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
                        <h1 style={{ fontSize: '1.8rem', color: 'var(--co-primary)', marginBottom: '8px' }}>Seu Perfil Cognitivo:</h1>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--co-accent)', marginBottom: '16px' }}>{result}</h2>

                        <p className="text-muted" style={{ lineHeight: 1.6, marginBottom: '32px' }}>
                            {score > 11 ? 'Sua mente processa informações rapidamente e possui forte veia criativa. No entanto, o excesso de estímulos pode gerar sobrecarga mental e perda de foco em tarefas monótonas. Uma avaliação neuropsicológica pode te ajudar a canalizar essa energia!' :
                                score > 6 ? 'Você consegue equilibrar momentos de foco com criatividade. Flutuações de atenção acontecem de vez em quando sob estresse, mas no geral você tem boas ferramentas de organização.' :
                                    'Você é altamente focado, lida bem com rotinas de trabalho constantes e não se deixa levar facilmente por distrações. Seu perfil tende à organização metódica.'}
                        </p>
                    </motion.div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', background: 'var(--co-lavender)', borderColor: 'var(--co-accent)' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--co-primary)' }}>Avaliação Neuropsicológica</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--co-text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                        O teste acima é apenas um rastreio inicial. Para um diagnóstico completo (como TDAH, Autismo ou Altas Habilidades) e um plano de desenvolvimento individual, a Avaliação Neuropsicológica é o caminho ideal.
                    </p>
                    <button
                        className="btn-primary"
                        style={{ width: '100%', padding: '16px', borderRadius: '16px', marginBottom: '12px', background: '#25D366', color: 'white' }}
                        onClick={() => window.open('https://wa.me/', '_blank')}
                    >
                        Saber valores no WhatsApp
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
                    <h1 style={{ fontSize: '2rem', color: 'var(--co-primary)', marginBottom: '16px' }}>Descubra seu<br />Perfil Cognitivo</h1>
                    <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: 1.5, marginBottom: '40px' }}>
                        Um quiz interativo de 5 perguntas para ajudar a mapear como sua mente organiza informações, lida com distrações e constrói foco no dia a dia.
                    </p>
                    <button className="btn-primary" style={{ padding: '16px 32px', borderRadius: '24px', fontSize: '1.1rem', display: 'flex', gap: '8px', alignItems: 'center' }} onClick={handleStart}>
                        Começar Avaliação <ArrowRight size={20} />
                    </button>
                    <p style={{ fontSize: '0.8rem', color: 'var(--co-text-muted)', marginTop: '24px' }}>*Este é um pré-teste rastreador, não substitui laudo diagnóstico oficial da neuropsicóloga.</p>
                </motion.div>
            ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', paddingTop: '16px' }}>
                        <button className="btn-secondary" style={{ padding: '8px', borderRadius: '12px' }} onClick={() => currentStep === 0 ? setCurrentStep(-1) : setCurrentStep(prev => prev - 1)}>
                            <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        <div style={{ flex: 1, height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: 'var(--co-accent)', width: `${((currentStep + 1) / QUESTIONS.length) * 100}%`, transition: 'width 0.3s ease' }} />
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--co-text-muted)', fontWeight: 600 }}>{currentStep + 1}/{QUESTIONS.length}</span>
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
                            <h2 style={{ fontSize: '1.5rem', lineHeight: 1.4, color: 'var(--co-primary)', marginBottom: '32px' }}>
                                {QUESTIONS[currentStep].text}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {QUESTIONS[currentStep].options.map((opt, i) => (
                                    <button
                                        key={i}
                                        className="btn-secondary"
                                        style={{ padding: '20px', borderRadius: '16px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--co-white)', border: '2px solid transparent', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'all 0.2s', fontSize: '1.05rem', color: 'var(--co-text-dark)' }}
                                        onClick={() => handleAnswer(QUESTIONS[currentStep].id, opt.value, opt.label)}
                                    >
                                        {opt.label}
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
                    <h2 style={{ color: 'var(--co-primary)' }}>Analisando respostas...</h2>
                </div>
            )}
        </div>
    );
}
