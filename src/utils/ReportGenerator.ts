import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportData {
    period: {
        start: string;
        end: string;
    };
    moods: any[];
    vaultEntries: any[];
}

export const generateTherapyReport = (data: ReportData, userName: string) => {
    const doc = new jsPDF() as any;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(149, 117, 205); // var(--co-action)
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório Pré-Sessão', 14, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Paciente: ${userName}`, 14, 30);
    doc.text(`Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`, pageWidth - 80, 30);
    
    // Period
    doc.setTextColor(66, 66, 66);
    doc.setFontSize(10);
    const startStr = format(new Date(data.period.start), 'dd/MM/yyyy');
    const endStr = format(new Date(data.period.end), 'dd/MM/yyyy');
    doc.text(`Período analisado: ${startStr} até ${endStr}`, 14, 50);
    
    // Mood Summary Section
    doc.setFontSize(16);
    doc.setTextColor(149, 117, 205);
    doc.text('1. Resumo de Humor', 14, 65);
    
    const moodTableData = data.moods.map(m => [
        format(new Date(m.date), 'dd/MM/yyyy'),
        m.mood === 'happy' ? 'Feliz' : m.mood === 'neutral' ? 'Neutro' : m.mood === 'sad' ? 'Triste' : m.mood === 'angry' ? 'Irritado' : 'Ansioso',
        m.note || '-'
    ]);
    
    doc.autoTable({
        startY: 70,
        head: [['Data', 'Humor', 'Observação']],
        body: moodTableData,
        headStyles: { fillColor: [149, 117, 205] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    
    // Vault Entries Section
    let currentY = (doc as any).lastAutoTable.finalY + 20;
    
    if (currentY > 250) {
        doc.addPage();
        currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(149, 117, 205);
    doc.text('2. Diário e Reflexões (Última Semana)', 14, currentY);
    currentY += 10;
    
    if (data.vaultEntries.length === 0) {
        doc.setFontSize(11);
        doc.setTextColor(150, 150, 150);
        doc.text('Nenhuma reflexão registrada neste período.', 14, currentY);
    } else {
        data.vaultEntries.forEach((entry) => {
            if (currentY > 260) {
                doc.addPage();
                currentY = 20;
            }
            
            doc.setFontSize(11);
            doc.setTextColor(100, 100, 100);
            const entryDate = format(new Date(entry.date), 'dd/MM HH:mm');
            doc.setFont('helvetica', 'bold');
            doc.text(`${entryDate} - ${entry.isGuided ? 'Reflexão TCC' : 'Nota'}`, 14, currentY);
            currentY += 6;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            
            const content = entry.isGuided 
                ? `Situação: ${entry.situation}\nPensamento: ${entry.automaticThought}\nEmoção: ${entry.emotion}`
                : entry.content;
                
            const splitText = doc.splitTextToSize(content, pageWidth - 28);
            doc.text(splitText, 14, currentY);
            currentY += (splitText.length * 5) + 8;
        });
    }
    
    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for(let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Página ${i} de ${totalPages} - Ponto e Vírgula`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }
    
    doc.save(`Relatorio_Terapia_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
