
import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { FileData } from '../types';

interface Props {
  onFileSelect: (data: FileData) => void;
}

const FileUploader: React.FC<Props> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isReading, setIsReading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    // @ts-ignore
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReading(true);
    setFileName(file.name);

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPdf(file);
      } else {
        text = await file.text();
      }

      onFileSelect({
        name: file.name,
        text,
        type: file.type
      });
    } catch (err) {
      console.error("File read error:", err);
      alert("파일을 읽는 중 오류가 발생했습니다. 지원되는 형식을 확인해 주세요.");
    } finally {
      setIsReading(false);
    }
  };

  return (
    <div 
      className={`relative group border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer ${
        fileName ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.txt"
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center py-2">
        {isReading ? (
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
        ) : fileName ? (
          <CheckCircle2 className="w-8 h-8 text-indigo-500 mb-2" />
        ) : (
          <Upload className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 mb-2 transition-colors" />
        )}
        
        <p className="text-sm font-medium text-gray-600">
          {isReading ? '텍스트 추출 중...' : fileName || '파일을 클릭하여 업로드'}
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF, TXT 지원</p>
      </div>
    </div>
  );
};

export default FileUploader;
