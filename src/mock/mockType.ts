export type DataType = {
  id: number;
  first_name: string;
  last_name: string;
  profile: string;
  text: string;
  image: string | null;
  metadata: {
    lastMessage: string;
    lastMessageDate: string;
    count: number;
  };
};
