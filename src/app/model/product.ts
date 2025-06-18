export interface Product {
  product_id: string;
  product_name: string;
  variant_id: string[];
  variant_name: string[];
  price: number;
  description: string;
  details: string;
  average_rating: number;
  rating_number: number;
  quantity: number;
  product_image: string;
  animal_class_id: number;
  category_id: string;
  child_category_id: string;
  variant_quantity: number[];
  variant_price: number[];
  variant_image: string[];
  variants_number: number;
  created_date: Date;
  discount: number;
  stock: number;
}