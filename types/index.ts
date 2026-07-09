export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
};

export type SiteContent = {
  id: number;
  hero_image_url: string | null;
  about_title: string | null;
  about_text: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
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
