export type Post = {
  id: number;
  title: string;
  body: string;
  userId: User["id"];
};

export type Comment = {
  postId: Post["id"];
  id: number;
  name: string;
  body: string;
  email: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      long: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    bs: string;
    catchPhrase: string;
  };
};

export type Todo = {
  userId: User["id"];
  id: number;
  title: string;
  completed: boolean;
};

export type Album = {
  userId: User["id"];
  id: number;
  title: string;
};
