export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_percent: number | null;
  category_id: string | null;
  image_url: string | null;
  created_at?: string;
  categories?: Category | null;
};
