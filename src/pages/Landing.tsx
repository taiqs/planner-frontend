import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Brain, Clock, ShieldCheck, Star } from 'lucide-react';

export function Landing() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--co-primary-bg)', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar simpificada */}
            <header style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: 'var(--co-accent)', width: '32px', height: '32px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Brain size={20} color="var(--co-text-dark)" />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--co-text-dark)', letterSpacing: '-0.5px' }}>Planner Psico</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--co-text-dark)', fontWeight: 600, padding: '8px 16px', cursor: 'pointer' }}
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => navigate('/login', { state: { register: true } })}
                        style={{ background: 'var(--co-action)', color: 'white', border: 'none', borderRadius: '100px', fontWeight: 600, padding: '8px 20px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(84, 101, 255, 0.3)' }}
                    >
                        Começar
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <section style={{ padding: '64px 24px', textAlign: 'center', maxWidth: '800px', width: '100%' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--co-lavender)', padding: '8px 16px', borderRadius: '100px', marginBottom: '24px', color: 'var(--co-action)', fontWeight: 600, fontSize: '0.9rem' }}>
                        <Star size={16} fill="var(--co-action)" /> O seu espaço seguro
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--co-text-dark)', marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-1px' }}>
                        Transforme sua <span style={{ color: 'var(--co-action)' }}>Saúde Mental</span> um dia de cada vez.
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: 'var(--co-text-muted)', marginBottom: '40px', lineHeight: 1.6 }}>
                        Um companheiro diário para entender suas emoções, registrar seus pensamentos e conectar-se melhor com o seu processo terapêutico.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                        <button
                            className="btn-primary"
                            onClick={() => navigate('/login', { state: { register: true } })}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 32px', fontSize: '1.2rem', borderRadius: '100px', boxShadow: '0 8px 24px rgba(84, 101, 255, 0.3)', width: '100%', maxWidth: '350px', justifyContent: 'center' }}
                        >
                            Criar minha conta gratuita <ArrowRight size={24} />
                        </button>
                        <p style={{ fontSize: '0.85rem', color: 'var(--co-text-muted)' }}>Psicólogo? <a href="#" style={{ color: 'var(--co-action)', fontWeight: 600 }}>Crie seu consultório.</a></p>
                    </div>
                </section>

                {/* Features Image / Mockup (Placeholder) */}
                <section style={{ width: '100%', maxWidth: '1000px', padding: '0 24px', marginBottom: '64px' }}>
                    <div style={{ width: '100%', height: '400px', background: 'linear-gradient(135deg, var(--co-lavender) 0%, var(--co-serene-blue) 100%)', borderRadius: '32px', border: '8px solid white', boxShadow: '0 24px 48px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'white', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.5, top: '20px', left: '20px' }}></div>
                        <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop" alt="Bem estar" style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'overlay', opacity: 0.8 }} />
                        <h2 style={{ position: 'absolute', fontSize: '2rem', color: 'var(--co-text-dark)', fontWeight: 800, textShadow: '0 2px 10px rgba(255,255,255,0.5)' }}>Encontre seu equilíbrio.</h2>
                    </div>
                </section>

                {/* Benefits */}
                <section style={{ background: 'white', width: '100%', padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ maxWidth: '1000px', width: '100%' }}>
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--co-text-dark)', marginBottom: '16px' }}>Por que usar o Planner Psico?</h2>
                            <p className="text-muted" style={{ fontSize: '1.1rem' }}>Desenhado para ser o seu porto seguro entre as sessões de terapia.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                            <div style={{ padding: '32px', background: 'var(--co-primary-bg)', borderRadius: '24px', transition: 'transform 0.3s ease' }} className="hover-scale">
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--co-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                    <Heart size={28} color="var(--co-action)" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Monitoramento de Humor</h3>
                                <p style={{ color: 'var(--co-text-muted)', lineHeight: 1.6 }}>Identifique padrões nas suas emoções diárias e entenda melhor seus gatilhos.</p>
                            </div>

                            <div style={{ padding: '32px', background: 'var(--co-primary-bg)', borderRadius: '24px', transition: 'transform 0.3s ease' }} className="hover-scale">
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                    <Clock size={28} color="#1976D2" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Cofre de Reflexões</h3>
                                <p style={{ color: 'var(--co-text-muted)', lineHeight: 1.6 }}>Anote o que quiser discutir na terapia, sem esquecer de nada importante até o dia da consulta.</p>
                            </div>

                            <div style={{ padding: '32px', background: 'var(--co-primary-bg)', borderRadius: '24px', transition: 'transform 0.3s ease' }} className="hover-scale">
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                    <ShieldCheck size={28} color="#388E3C" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Privacidade Total</h3>
                                <p style={{ color: 'var(--co-text-muted)', lineHeight: 1.6 }}>Seus dados de saúde mental são confidenciais e seus arquivos são salvos com segurança de alto nível.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Bottom */}
                <section style={{ width: '100%', padding: '80px 24px', background: 'var(--co-action)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '24px', maxWidth: '600px', lineHeight: 1.2 }}>
                        Pronto para dar o primeiro passo?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', marginBottom: '40px', maxWidth: '500px' }}>
                        Junte-se dezenas de pacientes que já transformaram suas jornadas terapêuticas.
                    </p>
                    <button
                        onClick={() => navigate('/login', { state: { register: true } })}
                        style={{ background: 'white', color: 'var(--co-action)', border: 'none', borderRadius: '100px', padding: '18px 40px', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                    >
                        Começar Agora
                    </button>
                </section>
            </main>

            <footer style={{ background: 'var(--co-text-dark)', padding: '40px 24px', color: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                    <Brain size={24} />
                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Planner Psico</span>
                </div>
                <p style={{ fontSize: '0.9rem', textAlign: 'center', maxWidth: '400px' }}>Apoiando o processo terapêutico com tecnologia, segurança e empatia.</p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '800px', paddingTop: '24px', display: 'flex', justifyContent: 'center', fontSize: '0.85rem' }}>
                    &copy; {new Date().getFullYear()} Planner Psico. Todos os direitos reservados.
                </div>
            </footer>
        </div>
    );
}
