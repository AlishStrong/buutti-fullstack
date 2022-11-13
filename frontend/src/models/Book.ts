export interface BookForCreation {
  title: string;
  author: string;
  description: string;
}

export interface Book extends BookForCreation {
  id: number;
}
