import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoiceRecorderProps {
    onSave: (audioBlob: Blob) => void;
    onCancel: () => void;
    isUploading?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSave, onCancel, isUploading }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioUrl(url);
                
                // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error('Error accessing microphone:', err);
            toast.error('Erro ao acessar o microfone. Verifique as permissões.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleDelete = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordingTime(0);
    };

    return (
        <div style={{ 
            background: 'var(--co-lavender)', 
            padding: '24px', 
            borderRadius: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '16px',
            border: '1px solid var(--co-accent)'
        }}>
            {!audioBlob ? (
                <>
                    <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '40px', 
                        background: isRecording ? '#FF5252' : 'var(--co-action)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: isRecording ? '0 0 20px rgba(255, 82, 82, 0.4)' : '0 8px 16px rgba(149, 117, 205, 0.3)',
                        transition: 'all 0.3s ease'
                    }}
                    onClick={isRecording ? stopRecording : startRecording}
                    >
                        {isRecording ? <Square size={32} color="white" /> : <Mic size={32} color="white" />}
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: 800, fontSize: '1.2rem', margin: 0, color: isRecording ? '#FF5252' : 'var(--co-text-dark)' }}>
                            {isRecording ? formatTime(recordingTime) : 'Toque para gravar'}
                        </p>
                        <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                            {isRecording ? 'Gravando áudio...' : 'Grave um pensamento rápido'}
                        </p>
                    </div>

                    <button 
                        onClick={onCancel}
                        style={{ background: 'transparent', border: 'none', color: 'var(--co-text-dark)', fontWeight: 600, cursor: 'pointer', opacity: 0.6 }}
                    >
                        Cancelar
                    </button>
                </>
            ) : (
                <>
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '12px 20px', borderRadius: '100px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <button 
                            onClick={handlePlayPause}
                            style={{ background: 'var(--co-action)', border: 'none', width: '40px', height: '40px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            {isPlaying ? <Pause size={20} color="white" /> : <Play size={20} color="white" style={{ marginLeft: '3px' }} />}
                        </button>
                        
                        <div style={{ flex: 1, height: '4px', background: '#eee', borderRadius: '2px', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: isPlaying ? '100%' : '0%', background: 'var(--co-accent)', borderRadius: '2px', transition: 'width 0.1s linear' }}></div>
                        </div>

                        <audio 
                            ref={audioRef} 
                            src={audioUrl || ''} 
                            onEnded={() => setIsPlaying(false)}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                        <button 
                            onClick={handleDelete}
                            style={{ flex: 1, padding: '14px', borderRadius: '16px', background: 'white', border: '1px solid #FFCDD2', color: '#E57373', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <Trash2 size={18} /> Apagar
                        </button>
                        <button 
                            onClick={() => onSave(audioBlob)}
                            disabled={isUploading}
                            style={{ flex: 2, padding: '14px', borderRadius: '16px', background: 'var(--co-action)', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(149, 117, 205, 0.3)' }}
                        >
                            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Salvar no Cofre</>}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
