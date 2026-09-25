export interface SearchFarmer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  verified: boolean;
}

export interface SearchDoctor {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  verified: boolean;
}

export interface SearchAnimal {
  id: number;
  name: string;
  breed: string;
  image: string | null;
  userId: number | null;
}

export interface SearchNotification {
  id: number;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface SearchResults {
  farmers: SearchFarmer[];
  doctors: SearchDoctor[];
  animals: SearchAnimal[];
  notifications: SearchNotification[];
}
