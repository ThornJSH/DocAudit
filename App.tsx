
import React, { useState, useCallback } from 'react';
import { AnalysisMode, FileData, AnalysisResult } from './types';
import { MODE_LABELS } from './constants';
import { analyzeDocument } from './services/geminiService';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ModeSelector from './components/ModeSelector';
import ResultViewer from './components/ResultViewer';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.GENERAL);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (data: FileData) => {
    setFileData(data);
    setError(null);
  };

  const handleRunAnalysis = async () => {
    if (!fileData) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const responseText = await analyzeDocument(fileData.text, mode);
      setResult({
        content: responseText,
        mode,
        timestamp: Date.now()
      });
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 sticky top-8">
              <section>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  1. 문서 선택 (PDF/TEXT)
                </label>
                <FileUploader onFileSelect={handleFileSelect} />
                {fileData && (
                  <p className="mt-2 text-xs text-blue-600 font-medium truncate">
                    선택됨: {fileData.name}
                  </p>
                )}
              </section>

              <section>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  2. 검토 유형 선택
                </label>
                <ModeSelector 
                  currentMode={mode} 
                  onModeChange={setMode} 
                  disabled={isAnalyzing}
                />
              </section>

              <button
                onClick={handleRunAnalysis}
                disabled={!fileData || isAnalyzing}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  !fileData || isAnalyzing 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-[0.98]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  '분석 실행하기'
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            {isAnalyzing ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-800">문서를 검토하고 있습니다</h3>
                  <p className="text-gray-500">Gemini AI가 논리적 타당성을 분석하는 중입니다.<br/>잠시만 기다려 주세요.</p>
                </div>
              </div>
            ) : result ? (
              <ResultViewer result={result} />
            ) : (
              <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[400px]">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-lg font-bold text-gray-600">준비 완료</h3>
                  <p className="text-gray-400 mt-2">파일을 업로드하고 검토 유형을 선택한 뒤 분석을 시작하세요.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; 2024 DocAudit AI. Powered by Google Gemini.
        </div>
      </footer>
    </div>
  );
};

export default App;
