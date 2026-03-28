import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Clock, ShieldCheck, Star, MessageSquare, ChevronRight, Flame } from 'lucide-react';
import logo from '../assets/logopontoevirgula.png';
import heroImg from '../assets/hero_mental_health.png';
import neuroImg from '../assets/neuro_brain.png';
import { SEO } from '../components/SEO';

export function Landing() {
    const navigate = useNavigate();

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
            `}</style>
            {/* Navbar Refatorada */}
            <header 
                className="header-mobile"
                style={{ 
                    padding: '16px 24px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: 'rgba(255,255,255,0.92)', 
                    backdropFilter: 'blur(20px)', 
                    position: 'sticky', 
                    top: 0, 
                    zIndex: 100,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}
            >
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

                {/* Features Image Section */}
                <section style={{ width: '100%', maxWidth: '1200px', padding: '0 24px', marginBottom: '80px' }}>
                    <div style={{
                        width: '100%',
                        minHeight: '400px',
                        background: 'linear-gradient(135deg, white 0%, var(--co-lavender) 100%)',
                        borderRadius: '48px',
                        padding: '48px',
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

                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            {/* Dashboard Mockup - Live Version */}
                            <div className="mockup-float" style={{ 
                                width: '320px', 
                                height: '580px', 
                                background: '#F8F9FE', 
                                borderRadius: '40px', 
                                border: '12px solid #1A1A1A',
                                boxShadow: '0 50px 100px rgba(0,0,0,0.2)',
                                overflow: 'hidden',
                                position: 'relative',
                                marginBottom: '48px',
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

                                <div style={{ padding: '40px 20px 20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#1A1A1A' }}>Olá, Murilo</h3>
                                            <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>Como você está hoje?</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '4px 10px', borderRadius: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                            <Flame size={14} color="#FF9800" />
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>12</span>
                                        </div>
                                    </div>

                                    {/* Mood Selector Simulation */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                                        {['😊', '😐', '😔', '😡', '😴'].map((emoji, i) => (
                                            <motion.div 
                                                key={i}
                                                style={{ width: '45px', height: '45px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}
                                                animate={i === 0 ? { scale: [1, 1.2, 1], backgroundColor: ['#fff', '#f0e6ff', '#fff'] } : {}}
                                                transition={i === 0 ? { duration: 2, repeat: Infinity, delay: 1 } : {}}
                                            >
                                                {emoji}
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div style={{ background: 'linear-gradient(135deg, #a67cff 0%, #8a5cf5 100%)', padding: '20px', borderRadius: '24px', color: 'white', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Star size={16} color="white" />
                                            </div>
                                            <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Perfil Cognitivo</h4>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.9 }}>Descubra como seu cérebro processa informações hoje.</p>
                                    </div>

                                    <div style={{ background: 'white', padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                        <div style={{ background: '#f0e6ff', padding: '8px', borderRadius: '10px' }}>
                                            <MessageSquare size={18} color="#8a5cf5" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: 0, fontSize: '0.85rem' }}>O que falar na terapia</h4>
                                            <p style={{ margin: 0, fontSize: '0.7rem', color: '#888' }}>2 novas reflexões anotadas</p>
                                        </div>
                                        <ChevronRight size={16} color="#ccc" />
                                    </div>
                                </div>
                                
                                {/* Bottom Navigation Bar */}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60px', background: 'white', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: '10px' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#8a5cf5' }}></div>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#eee' }}></div>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#eee' }}></div>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#eee' }}></div>
                                </div>
                            </div>

                            <h2 style={{ fontSize: '2.5rem', color: 'var(--co-text-dark)', fontWeight: 900, marginBottom: '20px', letterSpacing: '-1.5px' }}>App em tempo real.</h2>
                            <p style={{ color: 'var(--co-text-muted)', fontSize: '1.25rem', maxWidth: '600px', lineHeight: 1.6 }}>Uma interface intuitiva e acolhedora que acompanha você em todos os lugares. <strong style={{ color: 'var(--co-text-dark)' }}>Sua evolução na palma da mão</strong>.</p>
                        </div>
                    </div>
                </section>

                {/* Neuro Section - NOVA PARTE */}
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
                                { icon: <Heart size={32} />, title: 'Saúde Emocional', text: <>Identifique <strong style={{color:"var(--co-text-dark)"}}>padrões</strong> nas suas emoções diárias e entenda seus gatilhos positivos.</>, color: 'var(--co-action)' },
                                { icon: <Clock size={32} />, title: 'Cofre de Reflexões', text: <>Anote o que quiser discutir na terapia e garanta sessões <strong style={{color:"var(--co-text-dark)"}}>muito mais produtivas</strong>.</>, color: '#9575CD' },
                                { icon: <ShieldCheck size={32} />, title: 'Privacidade Total', text: <>Seus dados são <strong style={{color:"var(--co-text-dark)"}}>100% confidenciais</strong> e protegidos com criptografia e PIN.</>, color: '#81C784' }
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
                        <a href="mailto:suporte@pontoevirgula.app" style={{ color: 'inherit', textDecoration: 'none' }}>Contato</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
