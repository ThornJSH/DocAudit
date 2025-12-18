
export enum AnalysisMode {
  GENERAL = 'GENERAL',
  SOCIAL_WELFARE = 'SOCIAL_WELFARE',
  POLICY = 'POLICY'
}

export interface AnalysisResult {
  content: string;
  mode: AnalysisMode;
  timestamp: number;
}

export interface FileData {
  name: string;
  text: string;
  type: string;
}
