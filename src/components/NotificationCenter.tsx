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
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
                            zIndex: 1100
                        }}
                    />
                    
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '400px',
                            backgroundColor: 'white',
                            borderRadius: '32px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                            zIndex: 1101,
                            maxHeight: '80vh',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}
                    >
                        <div style={{ 
                            padding: '24px', 
                            borderBottom: '1px solid #f0f0f0', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            background: 'white'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ 
                                    width: '36px', height: '36px', borderRadius: '12px', 
                                    background: 'var(--co-lavender)', display: 'flex', 
                                    alignItems: 'center', justifyContent: 'center' 
                                }}>
                                    <Bell size={20} color="var(--co-accent)" />
                                </div>
                                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800 }}>Notificações</h3>
                            </div>
                            <button 
                                onClick={onClose} 
                                style={{ 
                                    background: '#f5f5f5', border: 'none', 
                                    borderRadius: '50%', width: '36px', height: '36px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
                            {notifications.length === 0 ? (
                                <div style={{ 
                                    padding: '60px 20px', textAlign: 'center', 
                                    color: 'var(--co-text-muted)', display: 'flex', 
                                    flexDirection: 'column', alignItems: 'center', gap: '12px' 
                                }}>
                                    <Bell size={48} style={{ opacity: 0.05 }} />
                                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>Nenhuma notificação por enquanto.</p>
                                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>Avisaremos quando algo novo aparecer!</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {notifications.map(n => (
                                        <div 
                                            key={n.id} 
                                            style={{ 
                                                padding: '20px 24px', 
                                                borderBottom: '1px solid #f8f8f8', 
                                                background: n.read ? 'white' : 'rgba(166,124,255,0.04)', 
                                                transition: 'all 0.2s',
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}
                                            onClick={() => !n.read && onMarkAsRead(n.id)}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-start' }}>
                                                <span style={{ 
                                                    fontWeight: n.read ? 600 : 800, 
                                                    fontSize: '1rem', 
                                                    color: 'var(--co-text-dark)', 
                                                    flex: 1, paddingRight: '12px',
                                                    lineHeight: 1.3
                                                }}>
                                                    {n.title}
                                                </span>
                                                {!n.read && (
                                                    <div style={{ 
                                                        width: '10px', height: '10px', borderRadius: '5px', 
                                                        background: 'var(--co-action)', marginTop: '4px',
                                                        boxShadow: '0 0 10px rgba(166,124,255,0.4)'
                                                    }} />
                                                )}
                                            </div>
                                            <p style={{ 
                                                fontSize: '0.9rem', 
                                                color: 'var(--co-text-muted)', 
                                                margin: 0, 
                                                lineHeight: 1.5,
                                                opacity: n.read ? 0.7 : 1
                                            }}>{n.content}</p>
                                            
                                            <div style={{ 
                                                display: 'flex', justifyContent: 'space-between', 
                                                alignItems: 'center', marginTop: '12px' 
                                            }}>
                                                <span style={{ fontSize: '0.75rem', color: '#bbb' }}>
                                                    {new Date(n.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                                </span>
                                                {!n.read && (
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--co-action)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <CheckCircle2 size={12} /> Marcar como lida
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
