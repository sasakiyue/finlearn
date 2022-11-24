import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type QuizMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Quiz {
  readonly id: string;
  readonly question: string;
  readonly choice: string;
  readonly answer: number;
  readonly refUrl?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Quiz, QuizMetaData>);
  static copyOf(source: Quiz, mutator: (draft: MutableModel<Quiz, QuizMetaData>) => MutableModel<Quiz, QuizMetaData> | void): Quiz;
}

export declare class User {
  readonly id: string;
  readonly email?: string | null;
  readonly name?: string | null;
  readonly point?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}