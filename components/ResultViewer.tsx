
import React from 'react';
import { AnalysisResult } from '../types';
import { MODE_LABELS } from '../constants';
import { Download, FileText, ClipboardCheck, Share2 } from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

const ResultViewer: React.FC<Props> = ({ result }) => {
  // Simple markdown renderer for tables and common structures
  const renderMarkdown = (text: string) => {
    // This is a naive renderer, in a real app use 'react-markdown'
    // Here we wrap in a prose class and let Tailwind handle basic styling
    // We convert the string to HTML bits
    const lines = text.split('\n');
    let inTable = false;
    let tableHtml = '';

    const processed = lines.map((line, idx) => {
      // Basic Table Detection
      if (line.includes('|') && line.trim().startsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableHtml = '<table class="min-w-full border-collapse border border-gray-200 my-4">';
        }
        
        const cells = line.split('|').filter(c => c.trim() !== '' || line.startsWith('|') && line.endsWith('|'));
        // Filter out the separator row |---|---|
        if (line.includes('---')) return null;

        const tag = tableHtml.includes('<thead>') ? 'td' : 'th';
        const isHeader = !tableHtml.includes('<thead>');
        
        let row = `<tr class="${isHeader ? 'bg-gray-50' : 'bg-white'}">`;
        cells.forEach(cell => {
           row += `<${isHeader ? 'th' : 'td'} class="border border-gray-200 p-2 text-sm">${cell.trim()}</${isHeader ? 'th' : 'td'}>`;
        });
        row += '</tr>';

        if (isHeader) {
          tableHtml += `<thead>${row}</thead><tbody>`;
        } else {
          tableHtml += row;
        }
        return null;
      } else {
        if (inTable) {
          inTable = false;
          const finished = tableHtml + '</tbody></table>';
          tableHtml = '';
          return <div key={`table-${idx}`} dangerouslySetInnerHTML={{ __html: finished }} />;
        }
        
        // Headers
        if (line.startsWith('### ')) return <h3 key={idx} className="text-lg font-bold text-gray-800 mt-6 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-bold text-gray-900 mt-8 mb-4 border-b pb-2">{line.replace('## ', '')}</h2>;
        if (line.startsWith('# ')) return <h1 key={idx} className="text-2xl font-bold text-indigo-700 mt-10 mb-6">{line.replace('# ', '')}</h1>;
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={idx} className="ml-4 list-disc text-gray-700 my-1">{line.substring(2)}</li>;
        if (/^\d+\./.test(line)) return <li key={idx} className="ml-4 list-decimal text-gray-700 my-1">{line.replace(/^\d+\./, '').trim()}</li>;
        
        return line.trim() === '' ? <br key={idx} /> : <p key={idx} className="text-gray-700 leading-relaxed my-2">{line}</p>;
      }
    });

    return processed;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.content);
    alert('결과가 클립보드에 복사되었습니다.');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="font-bold text-gray-900">검토 분석 결과</h2>
            <p className="text-xs text-gray-500">{MODE_LABELS[result.mode]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={copyToClipboard}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="복사하기"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="다운로드"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-8 prose max-w-none">
        {renderMarkdown(result.content)}
      </div>

      <div className="bg-indigo-50 px-6 py-4 border-t border-indigo-100 flex items-center justify-between">
        <span className="text-xs font-medium text-indigo-600">
          분석 완료: {new Date(result.timestamp).toLocaleString()}
        </span>
        <div className="flex items-center gap-1 text-xs text-indigo-400 italic">
          <FileText className="w-3 h-3" />
          AI 기반 분석 - 실제 판단은 전문가의 검토를 병행하십시오.
        </div>
      </div>
    </div>
  );
};

export default ResultViewer;
