

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  features: string[];
  downloadLink: string;
  tags: string[];
  createdAt: string;
  featured?: boolean;
  featuredOrder?: number | null;
}


export interface AdminUser {
  id: string;
  username: string;
  password: string;
}