export enum Role {
  Assistant = 'assistant',
  User = 'user',
}

export interface QuestionResponse {
  role: Role;
  content: string[];
}
