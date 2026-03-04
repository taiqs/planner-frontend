import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Brain, Search, Map, FileStack, ArrowRight } from 'lucide-react';

export function NeuroEvalInfo() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px', paddingBottom: '100px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', paddingTop: '16px' }}>
                <button
                    className="btn-secondary"
                    style={{ padding: '10px 14px', borderRadius: '16px' }}
                    onClick={() => navigate(-1)}
                >
                    <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <h1 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--co-primary)' }}>Avaliação Neuropsicológica</h1>
            </header>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--co-lavender)', color: 'var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <Brain size={40} />
                </div>

                <h2 style={{ fontSize: '2rem', color: 'var(--co-primary)', marginBottom: '16px', lineHeight: 1.2 }}>
                    O que é e como funciona a avaliação?
                </h2>

                <p style={{ fontSize: '1.1rem', color: 'var(--co-text-muted)', lineHeight: 1.6, marginBottom: '32px' }}>
                    A Avaliação Neuropsicológica é uma investigação aprofundada das funções cognitivas, emocionais e comportamentais. Diferente de uma terapia comum, ela funciona como um "Raio-X" de como seu cérebro processa informações, sendo fundamental no diagnóstico de condições como <strong>TDAH</strong>, <strong>Autismo (TEA)</strong>, <strong>Altas Habilidades</strong>, ansiedade e depressão severa.
                </p>

                <h3 style={{ fontSize: '1.3rem', color: 'var(--co-text-dark)', marginBottom: '24px' }}>Os 3 Passos da Avaliação:</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                    {/* Passo 1 */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--co-primary-bg)', border: '1px solid var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Search size={24} color="var(--co-accent)" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>1. Entrevista de Anamnese</h4>
                            <p style={{ color: 'var(--co-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                Um encontro detalhado (com você e muitas vezes um familiar) para entender o seu histórico de vida, infância, dificuldades atuais e desenvolvimento.
                            </p>
                        </div>
                    </div>

                    {/* Passo 2 */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--co-primary-bg)', border: '1px solid var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Map size={24} color="var(--co-accent)" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>2. Aplicação de Testes e Escalas</h4>
                            <p style={{ color: 'var(--co-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                Durante algumas sessões, realizamos tarefas padronizadas, testes de Q.I., atenção, memória e comportamento. São atividades práticas e objetivas para mapear seus pontos fortes e fracos.
                            </p>
                        </div>
                    </div>

                    {/* Passo 3 */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--co-primary-bg)', border: '1px solid var(--co-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileStack size={24} color="var(--co-accent)" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>3. Devolutiva e Laudo</h4>
                            <p style={{ color: 'var(--co-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                O resultado de tudo. Você recebe um Laudo detalhado e validado clinicamente, com o seu perfil cognitivo completo e encaminhamentos (orientações para terapia, psiquiatria, ou escola/trabalho).
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', background: 'white', border: '1px solid var(--co-accent)', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--co-primary)' }}>Para quem é indicado?</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--co-text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
                        Pessoas lidando com suspeita de Neurodivergência (TDAH/Autismo), dificuldades crônicas de aprendizagem, foco, memória ou que buscam profundo autoconhecimento cognitivo.
                    </p>
                    <button
                        className="btn-primary"
                        style={{ width: '100%', padding: '16px', borderRadius: '16px', background: '#25D366', color: 'white', display: 'flex', justifyContent: 'center', gap: '8px' }}
                        onClick={() => window.open('https://wa.me/', '_blank')}
                    >
                        Tirar Dúvidas e Ver Valores no WhatsApp <ArrowRight size={20} />
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
