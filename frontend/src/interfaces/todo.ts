export interface TodoInterface {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoCreateInterface {
  title: string;
  completed?: boolean;
}

export interface TodoUpdateInterface {
  title?: string;
  completed?: boolean;
}
