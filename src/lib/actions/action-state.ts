type ActionState = {
  status: 'idle' | 'error' | 'success';
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const initialActionState: ActionState = {
  status: 'idle',
  message: '',
};

export { initialActionState };
export type { ActionState };
