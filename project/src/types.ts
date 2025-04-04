export interface Node {
  id: string;
  label: string;
}

export interface Edge {
  source: string;
  target: string;
  label: string;
}

export interface ConceptMap {
  nodes: Node[];
  edges: Edge[];
}

export interface FileProcessingResult {
  text: string;
  error?: string;
}