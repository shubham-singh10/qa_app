export type Role = "member" | "manager";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface Question {
    _id: string;
    title: string;
    description?: string;
    tags: string[];
    createdBy: { _is: string; name: string; };
    createdAt: string;
}

export interface Answer {
  _id: string;
  questionId: string;
  content: string;
  createdBy: { _id: string; name: string };
  createdAt: string;
}

export interface Insight {
  _id: string;
  questionId: string;
  summary: string;
  createdBy: { _id: string; name: string };
  createdAt: string;
}