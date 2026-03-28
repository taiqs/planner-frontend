import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Clock, ShieldCheck, Star, Flame, Home, Layout, Lock, User, Monitor, Smartphone, Zap, BookOpen, Tag } from 'lucide-react';
import api from '../services/api';
import { getProxyUrl } from '../utils/fileProxy';
import logo from '../assets/logopontoevirgula.png';
import heroImg from '../assets/hero_mental_health.png';
import neuroImg from '../assets/neuro_brain.png';
import { SEO } from '../components/SEO';

export function Landing() {
    const navigate = useNavigate();
    const [recentPosts, setRecentPosts] = useState<any[]>([]);

    useEffect(() => {
        // Detecção de PWA (instalado)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
            || (window.navigator as any).standalone 
            || document.referrer.includes('android-app://');

        if (isStandalone) {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            
            if (token && userStr) {
                const user = JSON.parse(userStr);
                if (user.role === 'ADMIN') {
                    navigate('/psicologo/dashboard', { replace: true });
                } else {
                    navigate('/dashboard', { replace: true });
                }
            } else {
                navigate('/login', { replace: true });
            }
        }
    }, [navigate]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/blog/public');
                setRecentPosts(res.data);
            } catch (error) {
                console.error("Erro ao buscar posts publicos", error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--co-primary-bg)', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
            <SEO />
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .mockup-float { animation: float 6s ease-in-out infinite; }
                .cursor-pointer-sim {
                    width: 20px;
                    height: 20px;
                    background: rgba(149, 117, 205, 0.4);
                    border: 2px solid white;
                    border-radius: 50%;
                    position: absolute;
                    pointer-events: none;
                    z-index: 100;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                @media (max-width: 850px) {
                    .grid-mobile-1 { 
                        grid-template-columns: 1fr !important; 
                        text-align: center !important;
                        gap: 32px !important;
                    }
                    .mobile-column { flex-direction: column !important; align-items: center !important; text-align: center !important; }
                    .mobile-padding-card { padding: 40px 24px !important; overflow: hidden !important; border-radius: 32px !important; }
                    .fs-mobile-h2 { font-size: 2rem !important; margin-bottom: 20px !important; text-align: center !important; }
                    .mobile-center-all { display: flex !important; flex-direction: column !important; align-items: center !important; text-align: center !important; }
                    .header-mobile { justify-content: center !important; }
                    .btn-mobile-full { width: 100% !important; }
                }
            `}</style>
            {/* Navbar Refatorada */}
            <header
                className="header-mobile"
                style={{
                    padding: '16px 24px',
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(20px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                }}
            >
                <div style={{
                    maxWidth: '1200px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                            src={logo}
                            alt="Ponto e Vírgula Logo"
                            className="logo-mobile"
                            style={{ height: '80px', maxWidth: '100%', objectFit: 'contain', cursor: 'pointer' }}
                            onClick={() => navigate('/')}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center' }} className="btn-container-mobile">
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-mobile-full"
                            style={{
                                background: 'var(--co-yellow-soft)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                color: 'var(--co-text-dark)',
                                fontWeight: 700,
                                borderRadius: '100px',
                                padding: '12px 24px',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                display: 'flex',
                                alignItems: 'center',
                                height: '48px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => navigate('/login', { state: { register: true } })}
                            className="btn-mobile-full"
                            style={{
                                background: 'var(--co-action)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '100px',
                                fontWeight: 800,
                                padding: '12px 24px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(149, 117, 205, 0.4)',
                                fontSize: '0.95rem',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                height: '48px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Começar agora
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>                <section
                className="grid-mobile-1"
                style={{
                    padding: '80px 24px',
                    maxWidth: '1200px',
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    alignItems: 'center',
                    gap: '40px'
                }}
            >
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--co-yellow-soft)',
                        padding: '10px 24px',
                        borderRadius: '100px',
                        marginBottom: '32px',
                        color: 'var(--co-text-dark)',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.03)'
                    }}>
                        <Star size={16} fill="#FBC02D" color="#FBC02D" /> SEGURANÇA E BEM-ESTAR
                    </div>

                    <h1
                        className="hero-title"
                        style={{
                            fontSize: 'var(--fs-h1)',
                            fontWeight: 900,
                            color: 'var(--co-text-dark)',
                            marginBottom: '24px',
                            lineHeight: 1.05,
                            letterSpacing: '-2.5px',
                            textAlign: 'left'
                        }}
                    >
                        Transforme sua <span style={{
                            background: 'linear-gradient(90deg, var(--co-action), var(--co-accent))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textDecoration: 'underline wavy var(--co-yellow)'
                        }}>Saúde Mental</span> um dia de cada vez.
                    </h1>

                    <p style={{
                        fontSize: 'var(--fs-p)',
                        color: 'var(--co-text-muted)',
                        marginBottom: '40px',
                        lineHeight: 1.6,
                        maxWidth: '550px',
                        fontWeight: 500,
                        textAlign: 'left'
                    }}>
                        O companheiro ideal para <strong style={{ color: "var(--co-text-dark)" }}>gerenciar suas sessões</strong>, registrar emoções e acelerar seu <strong style={{ color: "var(--co-text-dark)" }}>progresso terapêutico</strong> com segurança absoluta.
                    </p>

                    <button
                        className="btn-primary"
                        onClick={() => navigate('/login', { state: { register: true } })}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '20px 48px',
                            fontSize: '1.25rem',
                            borderRadius: '100px',
                            background: 'var(--co-action)',
                            color: 'white',
                            boxShadow: '0 16px 40px rgba(149, 117, 205, 0.4)',
                            width: 'fit-content',
                            fontWeight: 900,
                            letterSpacing: '-0.5px'
                        }}
                    >
                        Criar minha conta gratuita <ArrowRight size={24} />
                    </button>
                </div>

                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'var(--co-lavender)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4, zIndex: 0 }}></div>
                    <img
                        src={heroImg}
                        alt="Saúde Mental Ilustração"
                        style={{ width: '100%', maxWidth: '500px', height: 'auto', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}
                    />
                </div>
            </section>

                {/* Features Image Section - Dashboard Mockup */}
                <section style={{ width: '100%', maxWidth: '1200px', padding: '0 24px', marginBottom: '80px' }}>
                    <div 
                        className="mobile-padding-card"
                        style={{
                            width: '100%',
                            minHeight: '400px',
                            background: 'linear-gradient(135deg, white 0%, var(--co-lavender) 100%)',
                            borderRadius: '48px',
                            padding: '60px 48px',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                        border: '1px solid rgba(149, 117, 205, 0.15)'
                    }}>
                        <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'var(--co-yellow)', width: '100px', height: '100px', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.6 }}></div>
                        <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'var(--co-accent)', width: '120px', height: '120px', borderRadius: '50%', filter: 'blur(70px)', opacity: 0.4 }}></div>

                        <div
                            className="grid-mobile-1"
                            style={{
                                position: 'relative',
                                zIndex: 1,
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '60px',
                                alignItems: 'center',
                                width: '100%'
                            }}
                        >
                            {/* Dashboard Mockup - Live Version */}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div className="mockup-float" style={{
                                    width: '320px',
                                    height: '580px',
                                    background: '#F8F9FE',
                                    borderRadius: '40px',
                                    border: '12px solid #1A1A1A',
                                    boxShadow: '0 50px 150px rgba(0,0,0,0.15)',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    textAlign: 'left'
                                }}>
                                    {/* Phone Notch */}
                                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '120px', height: '25px', background: '#1A1A1A', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px', zIndex: 10 }}></div>

                                    {/* Simulated Cursor */}
                                    <motion.div
                                        className="cursor-pointer-sim"
                                        animate={{
                                            x: [160, 60, 60, 160, 260, 260, 160],
                                            y: [300, 240, 240, 420, 240, 240, 300],
                                            scale: [1, 1, 0.8, 1, 1, 0.8, 1]
                                        }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                    />

                                    <div style={{ padding: '40px 20px 20px', height: 'calc(100% - 85px)', overflowY: 'auto' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#1A1A1A', fontWeight: 800 }}>Olá, Tailiny</h3>
                                                <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>Como você está hoje?</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '4px 12px', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.02)' }}>
                                                <Flame size={14} color="#FF9800" fill="#FF9800" />
                                                <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>15</span>
                                            </div>
                                        </div>

                                        {/* Mood Selector Simulation */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                            {['😊', '😐', '😔', '😡', '😴'].map((emoji, i) => (
                                                <motion.div
                                                    key={i}
                                                    style={{ width: '45px', height: '45px', background: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}
                                                    animate={i === 0 ? {
                                                        scale: [1, 1.15, 1],
                                                        backgroundColor: ['#fff', '#f3efff', '#fff'],
                                                        boxShadow: ['0 4px 12px rgba(0,0,0,0.04)', '0 8px 16px rgba(149, 117, 205, 0.1)', '0 4px 12px rgba(0,0,0,0.04)']
                                                    } : {}}
                                                    transition={i === 0 ? { duration: 2.5, repeat: Infinity, delay: 1 } : {}}
                                                >
                                                    {emoji}
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div style={{ background: 'linear-gradient(135deg, #a67cff 0%, #8a5cf5 100%)', padding: '20px', borderRadius: '28px', color: 'white', marginBottom: '16px', boxShadow: '0 10px 20px rgba(149, 117, 205, 0.2)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                <Star size={16} color="white" fill="white" />
                                                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>Neuro-Insights</h4>
                                            </div>
                                            <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.9, lineHeight: 1.4 }}>Descubra seus potenciais. <strong style={{ color: "#FFD54F" }}>Faça o teste</strong> e veja seus novos insights neuropsicológicos.</p>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{ background: 'white', padding: '16px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                                <Clock size={20} color="#8a5cf5" style={{ marginBottom: '8px' }} />
                                                <h5 style={{ margin: 0, fontSize: '0.7rem', color: '#666' }}>Próxima Sessão</h5>
                                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800 }}>Terça, 14:00</p>
                                            </div>
                                            <div style={{ background: 'white', padding: '16px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                                <Heart size={20} color="#FF5252" style={{ marginBottom: '8px' }} />
                                                <h5 style={{ margin: 0, fontSize: '0.7rem', color: '#666' }}>Humor Semanal</h5>
                                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800 }}>Estável</p>
                                            </div>
                                        </div>

                                        <div style={{ background: 'white', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>Evolução do Foco</h4>
                                                <span style={{ fontSize: '0.65rem', color: '#8a5cf5', fontWeight: 600 }}>Sete dias</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '40px', gap: '8px' }}>
                                                {[30, 60, 45, 80, 55, 75, 95].map((h, i) => (
                                                    <motion.div
                                                        key={i}
                                                        style={{ flex: 1, background: i === 6 ? '#a67cff' : '#E0E0E0', borderRadius: '4px' }}
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${h}%` }}
                                                        transition={{ delay: i * 0.1, duration: 1 }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Navigation Bar */}
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '65px', background: 'rgba(255,255,255,0.98)', borderTop: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: '12px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#8a5cf5' }}>
                                            <Home size={18} />
                                            <span style={{ fontSize: '0.55rem', fontWeight: 700 }}>Início</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#BDBDBD' }}>
                                            <Layout size={18} />
                                            <span style={{ fontSize: '0.55rem' }}>Agenda</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#BDBDBD' }}>
                                            <Lock size={18} />
                                            <span style={{ fontSize: '0.55rem' }}>Cofre</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#BDBDBD' }}>
                                            <User size={18} />
                                            <span style={{ fontSize: '0.55rem' }}>Conta</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'left' }}>
                                <h2 className="fs-mobile-h2" style={{ fontSize: '3rem', color: 'var(--co-text-dark)', fontWeight: 900, marginBottom: '24px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>Web App em tempo real.</h2>
                                <p style={{ color: 'var(--co-text-muted)', fontSize: '1.25rem', maxWidth: '500px', lineHeight: 1.6, marginBottom: '32px', fontWeight: 500 }}>
                                    Uma interface intuitiva e acolhedora que acompanha você em todos os lugares. <strong style={{ color: 'var(--co-text-dark)' }}>Sua evolução na palma da mão</strong>.
                                </p>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ padding: '12px 24px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.03)' }}>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--co-action)' }}>98%</h4>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Satisfação</p>
                                    </div>
                                    <div style={{ padding: '12px 24px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.03)' }}>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--co-accent)' }}>24/7</h4>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Disponível</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Neuro Section */}
                <section
                    className="section-padding-mobile"
                    style={{ width: '100%', padding: '80px 24px', display: 'flex', justifyContent: 'center' }}
                >
                    <div
                        className="grid-mobile-1"
                        style={{
                            maxWidth: '1100px',
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '60px',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img
                                src={neuroImg}
                                alt="Neuropsicologia"
                                style={{ width: '100%', maxWidth: '450px', height: 'auto', borderRadius: '48px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', transform: 'rotate(-2deg)' }}
                            />
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100%', height: '100%', background: 'var(--co-yellow-soft)', borderRadius: '48px', zIndex: -1, opacity: 0.5, transform: 'rotate(4deg)' }}></div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {[
                                { title: 'Diagnóstico Preciso', desc: 'Mapeamento detalhado de funções cognitivas e comportamentais.' },
                                { title: 'PDI e Encaminhamentos', desc: 'Plano de Desenvolvimento Individual e orientações clínicas baseadas no seu perfil.' },
                                { title: 'Suporte à Neurodivergência', desc: 'Foco especializado em entender como você processa o mundo.' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                    <div style={{ marginTop: '4px', background: 'var(--co-yellow)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '50%' }}></div>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>{item.title}</h4>
                                        <p className="text-muted" style={{ lineHeight: 1.5 }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section
                    className="section-padding-mobile"
                    style={{ background: 'white', width: '100%', padding: '100px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '1px solid #f0f0f0' }}
                >
                    <div style={{ maxWidth: '1100px', width: '100%' }}>
                        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--co-text-dark)', marginBottom: '20px', letterSpacing: '-1px' }}>Por que o Ponto e Vírgula é diferente?</h2>
                            <p className="text-muted" style={{ fontSize: '1.2rem', fontWeight: 500 }}>Desenhado para ser o seu porto seguro entre as sessões de terapia.</p>
                        </div>

                        <div
                            className="grid-mobile-1"
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}
                        >
                            {[
                                { icon: <Heart size={32} />, title: 'Saúde Emocional', text: <>Identifique <strong style={{ color: "var(--co-text-dark)" }}>padrões</strong> nas suas emoções diárias e entenda seus gatilhos positivos.</>, color: 'var(--co-action)' },
                                { icon: <Clock size={32} />, title: 'Cofre de Reflexões', text: <>Anote o que quiser discutir na terapia e garanta sessões <strong style={{ color: "var(--co-text-dark)" }}>muito mais produtivas</strong>.</>, color: '#9575CD' },
                                { icon: <ShieldCheck size={32} />, title: 'Privacidade Total', text: <>Seus dados são <strong style={{ color: "var(--co-text-dark)" }}>100% confidenciais</strong> e protegidos com criptografia e PIN.</>, color: '#81C784' }
                            ].map((feature, idx) => (
                                <div key={idx} style={{ padding: '48px 32px', background: 'var(--co-primary-bg)', borderRadius: '40px', transition: 'all 0.3s ease', border: '1px solid rgba(0,0,0,0.02)' }} className="hover-scale glass-card">
                                    <div style={{ width: '72px', height: '72px', borderRadius: '24px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', color: feature.color }}>
                                        {feature.icon}
                                    </div>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '16px', color: 'var(--co-text-dark)', letterSpacing: '-0.5px' }}>{feature.title}</h3>
                                    <p style={{ color: 'var(--co-text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>{feature.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* WebApp Anywhere Section */}
                <section
                    className="section-padding-mobile"
                    style={{
                        width: '100%',
                        padding: '100px 24px',
                        display: 'flex',
                        justifyContent: 'center',
                        background: 'linear-gradient(180deg, white 0%, #FDFDFD 100%)'
                    }}
                >
                    <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
                        <div className="mobile-center-all">
                            <h2 className="fs-mobile-h2" style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--co-text-dark)', marginBottom: '24px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>Acesse de qualquer lugar.</h2>
                            <p style={{ color: 'var(--co-text-muted)', fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '40px' }}>
                                O Ponto e Vírgula é um <strong style={{ color: 'var(--co-action)' }}>Web App moderno (PWA)</strong>. Isso significa que você tem a experiência de um aplicativo nativo sem precisar baixar nada na loja.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ background: '#E8F5E9', padding: '12px', borderRadius: '16px', color: '#4CAF50' }}><Zap size={24} /></div>
                                    <div>
                                        <h4 style={{ margin: 0, fontWeight: 800 }}>Sem Download, Sem Espera</h4>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#666' }}>Acesse instantaneamente pelo navegador.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ background: '#E3F2FD', padding: '12px', borderRadius: '16px', color: '#2196F3' }}><Monitor size={24} /></div>
                                    <div>
                                        <h4 style={{ margin: 0, fontWeight: 800 }}>Sempre Atualizado</h4>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#666' }}>Você sempre usa a versão mais recente e segura.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ background: '#F3E5F5', padding: '12px', borderRadius: '16px', color: '#9C27B0' }}><Smartphone size={24} /></div>
                                    <div>
                                        <h4 style={{ margin: 0, fontWeight: 800 }}>Leve e Rápido</h4>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#666' }}>Não consome a memória do seu celular.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                                width: '100%',
                                maxWidth: '500px',
                                height: '350px',
                                background: 'white',
                                borderRadius: '40px',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.05)',
                                border: '1px solid rgba(0,0,0,0.03)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Visual representation of multi-device */}
                                <div style={{ position: 'absolute', top: '40px', left: '40px', width: '200px', height: '140px', background: '#f5f5f5', borderRadius: '12px', border: '4px solid #333', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                                    <div style={{ padding: '10px' }}>
                                        <div style={{ width: '60%', height: '8px', background: '#ddd', borderRadius: '4px', marginBottom: '8px' }}></div>
                                        <div style={{ width: '40%', height: '8px', background: '#eee', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', bottom: '40px', right: '40px', width: '80px', height: '150px', background: '#f5f5f5', borderRadius: '16px', border: '4px solid #333', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', zIndex: 2 }}>
                                    <div style={{ padding: '10px' }}>
                                        <div style={{ width: '80%', height: '4px', background: '#ddd', borderRadius: '2px', marginBottom: '4px' }}></div>
                                        <div style={{ width: '50%', height: '4px', background: '#eee', borderRadius: '2px' }}></div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '5rem', opacity: 0.1, fontWeight: 900, color: 'var(--co-action)' }}>PWA</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Bottom Section */}
                <section
                    className="section-padding-mobile"
                    style={{
                        width: 'calc(100% - 48px)',
                        maxWidth: '1000px',
                        margin: '40px 24px 100px 24px',
                        padding: '80px 24px',
                        background: 'var(--co-action)',
                        borderRadius: '48px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        boxShadow: '0 32px 64px rgba(126, 87, 194, 0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'absolute', top: '-50%', right: '-30%', width: '500px', height: '500px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>

                    <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'white', marginBottom: '24px', maxWidth: '600px', lineHeight: 1.1, position: 'relative' }}>
                        Pronto para dar o primeiro passo?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', marginBottom: '48px', maxWidth: '500px', fontWeight: 500, position: 'relative' }}>
                        Junte-se dezenas de pacientes que já transformaram suas jornadas terapêuticas.
                    </p>
                    <button
                        onClick={() => navigate('/login', { state: { register: true } })}
                        style={{
                            background: 'white',
                            color: 'var(--co-action)',
                            border: 'none',
                            borderRadius: '100px',
                            padding: '20px 56px',
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                            position: 'relative'
                        }}
                    >
                        Começar Agora
                    </button>
                </section>
            </main>

            {/* Blog/Resources Section */}
            <section style={{ width: '100%', padding: '80px 24px', background: 'var(--co-primary-bg)', display: 'flex', justifyContent: 'center' }}>
                <div style={{ maxWidth: '1200px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', gap: '20px' }} className="mobile-column">
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ color: 'var(--co-action)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <BookOpen size={18} /> CONTEÚDOS EXCLUSIVOS
                            </div>
                            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--co-text-dark)', margin: 0, letterSpacing: '-1px' }}>Dicas que transformam.</h2>
                        </div>
                        <button 
                            onClick={() => navigate('/login')}
                            className="btn-secondary" 
                            style={{ borderRadius: '100px', padding: '12px 32px', fontWeight: 700, fontSize: '0.95rem' }}
                        >
                            Ver todos os artigos
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        {recentPosts.length > 0 ? recentPosts.map(post => (
                            <motion.article 
                                key={post.id}
                                whileHover={{ y: -8 }}
                                onClick={() => navigate('/login')}
                                style={{ 
                                    background: 'white', 
                                    borderRadius: '32px', 
                                    overflow: 'hidden', 
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.04)', 
                                    border: '1px solid rgba(0,0,0,0.03)',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                    <img 
                                        src={getProxyUrl(post.imageUrl) || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80'} 
                                        alt={post.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
                                        <span style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--co-action)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Tag size={12} /> {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ padding: '32px' }}>
                                    <div style={{ color: 'var(--co-text-muted)', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Clock size={14} /> {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--co-text-dark)', marginBottom: '16px', lineHeight: 1.25 }}>{post.title}</h3>
                                    <p style={{ color: 'var(--co-text-muted)', lineHeight: 1.6, marginBottom: '24px', fontSize: '1rem' }}>{post.content.substring(0, 100)}...</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--co-action)', fontWeight: 800, fontSize: '0.95rem' }}>
                                        Ler artigo completo <ArrowRight size={18} />
                                    </div>
                                </div>
                            </motion.article>
                        )) : (
                            [1, 2].map(i => (
                                <div key={i} style={{ height: '400px', background: 'rgba(255,255,255,0.5)', borderRadius: '32px', border: '2px dashed rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--co-text-muted)' }}>
                                    Carregando conteúdo...
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            <footer style={{ background: '#1A1A1A', padding: '80px 24px 40px', color: 'rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ height: '60px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                    />
                </div>
                <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '500px', lineHeight: 1.6 }}>Apoiando o processo terapêutico com tecnologia, segurança e empatia para profissionais e pacientes.</p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '1000px', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', fontSize: '0.9rem' }}>
                    <span>&copy; {new Date().getFullYear()} Ponto e Vírgula.</span>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <Link to="/privacidade" style={{ color: 'inherit', textDecoration: 'none' }}>Privacidade</Link>
                        <Link to="/termos" style={{ color: 'inherit', textDecoration: 'none' }}>Termos</Link>
                        <a href="mailto:psico.tailinyquirino@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>Contato</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
