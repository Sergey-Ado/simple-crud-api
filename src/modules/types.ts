export type ResponseMessage = {
  code: number;
  message: string | User | User[];
};

export type User = {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type ParseMessage = {
  code: number;
  message: string;
};
