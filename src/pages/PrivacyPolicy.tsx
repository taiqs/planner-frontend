import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import logo from '../assets/logopontoevirgula.png';
import { SEO } from '../components/SEO';

export function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--co-primary-bg)', display: 'flex', flexDirection: 'column' }}>
            <SEO title="Política de Privacidade - Ponto e Vírgula" />
            
            <header style={{ 
                padding: '16px 24px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                background: 'rgba(255,255,255,0.92)', 
                backdropFilter: 'blur(20px)', 
                position: 'sticky', 
                top: 0, 
                zIndex: 100,
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
                <img
                    src={logo}
                    alt="Logo"
                    style={{ height: '50px', cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                />
                <button
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--co-yellow-soft)',
                        border: 'none',
                        borderRadius: '100px',
                        padding: '10px 20px',
                        fontWeight: 700,
                        color: 'var(--co-text-dark)',
                        cursor: 'pointer'
                    }}
                >
                    <ArrowLeft size={18} /> Voltar
                </button>
            </header>

            <main style={{ flex: 1, padding: '60px 24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={{ 
                        display: 'inline-flex', 
                        padding: '16px', 
                        background: 'var(--co-lavender)', 
                        borderRadius: '24px', 
                        marginBottom: '24px',
                        color: 'var(--co-action)'
                    }}>
                        <ShieldCheck size={40} />
                    </div>
                    <h1 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, marginBottom: '16px' }}>Política de Privacidade</h1>
                    <p style={{ color: 'var(--co-text-muted)' }}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
                </div>

                <div className="glass-panel" style={{ padding: '40px', lineHeight: 1.7, color: 'var(--co-text-dark)' }}>
                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>1. Introdução</h2>
                        <p>Bem-vindo ao Ponto e Vírgula. A sua privacidade é nossa prioridade absoluta. Esta política explica como coletamos, usamos e protegemos suas informações.</p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>2. Coleta de Dados</h2>
                        <p>Coletamos apenas as informações estritamente necessárias para o funcionamento do planner, como nome, e-mail e os registros que você opta por fazer.</p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>3. Segurança</h2>
                        <p>Seus dados são criptografados e protegidos. Oferecemos camadas extras de segurança, como PIN de acesso para áreas sensíveis (Cofre).</p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>4. Seus Direitos</h2>
                        <p>Você tem total controle sobre seus dados, podendo solicitar a exclusão de sua conta e informações a qualquer momento.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>5. Contato</h2>
                        <p>Para dúvidas sobre sua privacidade, entre em contato conosco através do suporte no aplicativo.</p>
                    </section>
                </div>
            </main>

            <footer style={{ padding: '40px 24px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <p style={{ color: 'var(--co-text-muted)', fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} Ponto e Vírgula. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
