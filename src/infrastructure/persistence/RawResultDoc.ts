export interface RawResultDoc {
  gateway: string;
  fonte: string;
  tipo_param: string | null;
  param: string | null;
  result: unknown;
  status: 'success' | 'error';
  error_kind?: string;
  created_at: Date;
}
