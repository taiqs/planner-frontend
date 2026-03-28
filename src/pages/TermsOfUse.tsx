import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import logo from '../assets/logopontoevirgula.png';
import { SEO } from '../components/SEO';

export function TermsOfUse() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--co-primary-bg)', display: 'flex', flexDirection: 'column' }}>
            <SEO title="Termos de Uso - Ponto e Vírgula" />
            
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
                        background: 'var(--co-yellow-soft)', 
                        borderRadius: '24px', 
                        marginBottom: '24px',
                        color: 'var(--co-text-dark)'
                    }}>
                        <FileText size={40} />
                    </div>
                    <h1 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, marginBottom: '16px' }}>Termos de Uso</h1>
                    <p style={{ color: 'var(--co-text-muted)' }}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
                </div>

                <div className="glass-panel" style={{ padding: '40px', lineHeight: 1.7, color: 'var(--co-text-dark)' }}>
                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>1. Aceitação dos Termos</h2>
                        <p>Ao acessar e utilizar o Ponto e Vírgula, você concorda com os termos e condições aqui descritos. Se não concordar, por favor, não utilize a ferramenta.</p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>2. Descrição do Serviço</h2>
                        <p>O Ponto e Vírgula é uma ferramenta de apoio ao processo terapêutico, permitindo o registro de emoções, agendamentos e reflexões.</p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>3. Responsabilidade do Usuário</h2>
                        <p>Você é responsável por manter a confidencialidade de sua senha e PIN, bem como por todas as atividades que ocorrem em sua conta.</p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>4. Limitação de Responsabilidade</h2>
                        <p>A ferramenta é um complemento e não substitui o acompanhamento profissional de um psicólogo ou psiquiatra.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>5. Alterações nos Termos</h2>
                        <p>Podemos atualizar estes termos periodicamente. O uso contínuo da ferramenta após alterações constitui aceitação dos novos termos.</p>
                    </section>
                </div>
            </main>

            <footer style={{ padding: '40px 24px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <p style={{ color: 'var(--co-text-muted)', fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} Ponto e Vírgula. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
