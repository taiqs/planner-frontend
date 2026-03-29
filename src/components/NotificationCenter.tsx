import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle2 } from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    content: string;
    read: boolean;
    createdAt: string;
}

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
}

export function NotificationCenter({ isOpen, onClose, notifications, onMarkAsRead }: NotificationCenterProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(10px)',
                        }}
                    />
                    
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '440px',
                            backgroundColor: 'white',
                            borderRadius: '32px',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
                            maxHeight: '85vh',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ 
                            padding: '24px 28px', 
                            borderBottom: '1px solid #f2f2f2', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            background: 'white',
                            zIndex: 10
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ 
                                    width: '44px', height: '44px', borderRadius: '15px', 
                                    background: 'var(--co-lavender)', display: 'flex', 
                                    alignItems: 'center', justifyContent: 'center' 
                                }}>
                                    <Bell size={24} color="var(--co-accent)" />
                                </div>
                                <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 900, letterSpacing: '-0.5px', color: 'var(--co-text-dark)' }}>Notificações</h3>
                            </div>
                            <button 
                                onClick={onClose} 
                                style={{ 
                                    background: '#f8f8f8', border: 'none', 
                                    borderRadius: '50%', width: '40px', height: '40px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    color: '#666'
                                }}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ overflowY: 'auto', flex: 1, padding: '10px 0' }}>
                            {notifications.length === 0 ? (
                                <div style={{ 
                                    padding: '80px 40px', textAlign: 'center', 
                                    color: 'var(--co-text-muted)', display: 'flex', 
                                    flexDirection: 'column', alignItems: 'center', gap: '16px' 
                                }}>
                                    <div style={{ position: 'relative' }}>
                                        <Bell size={64} style={{ opacity: 0.03 }} />
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', background: 'var(--co-lavender)', borderRadius: '50%', opacity: 0.1, filter: 'blur(20px)' }} />
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--co-text-dark)' }}>Nenhum alerta novo</p>
                                        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Avisaremos você assim que houver novidades sobre sua jornada.</p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {notifications.map(n => (
                                        <motion.div 
                                            key={n.id}
                                            whileHover={{ backgroundColor: 'rgba(0,0,0,0.01)' }}
                                            style={{ 
                                                padding: '24px 28px', 
                                                borderBottom: '1px solid #f8f8f8', 
                                                background: n.read ? 'white' : 'rgba(166,124,255,0.03)', 
                                                transition: 'all 0.2s',
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}
                                            onClick={() => !n.read && onMarkAsRead(n.id)}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-start', gap: '12px' }}>
                                                <span style={{ 
                                                    fontWeight: n.read ? 600 : 800, 
                                                    fontSize: '1.05rem', 
                                                    color: 'var(--co-text-dark)', 
                                                    flex: 1,
                                                    lineHeight: 1.3,
                                                    letterSpacing: '-0.3px'
                                                }}>
                                                    {n.title}
                                                </span>
                                                {!n.read && (
                                                    <div style={{ 
                                                        width: '10px', height: '10px', borderRadius: '50%', 
                                                        background: 'var(--co-action)', marginTop: '5px',
                                                        boxShadow: '0 0 12px rgba(166,124,255,0.5)',
                                                        flexShrink: 0
                                                    }} />
                                                )}
                                            </div>
                                            <p style={{ 
                                                fontSize: '0.95rem', 
                                                color: 'var(--co-text-muted)', 
                                                margin: '0 0 16px 0', 
                                                lineHeight: 1.5,
                                                opacity: n.read ? 0.7 : 0.9
                                            }}>{n.content}</p>
                                            
                                            <div style={{ 
                                                display: 'flex', justifyContent: 'space-between', 
                                                alignItems: 'center' 
                                            }}>
                                                <span style={{ fontSize: '0.8rem', color: '#bbb', fontWeight: 500 }}>
                                                    {new Date(n.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {!n.read && (
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--co-action)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <CheckCircle2 size={14} /> Marcar como lida
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
