export interface CreateProduct {
  item: Product;
  categories: Categories;
}

export enum Categories {
  Kitchen,
  Furniture,
  Electronic,
  Fashion,
  Household,
  Tool,
  Game,
  Sport,
  Jewelry,
  Art,
  Pet,
}

interface User {
  id: number;
  createdAt: string;
  email: string;
  name: string;
  phone: string;
  product: Product[] | undefined;
  isLent: Lent[] | undefined;
}

interface Product {
  productName: string;
  productDetail: string;
  productCost: string;
  productUrl: string;
  productImage: string;
  isFavorite: boolean;
  isLent: Lent[];
  categories: Category[];
}

interface Category {
  productId: number;
  categoryId: number;
  assignBy: string;
}

interface Lent {
  userId: number;
  productId: number;
}
