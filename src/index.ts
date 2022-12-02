import { Category, Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import { connect } from "http2";
import { User } from "./type";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/products/create", async (req, res) => {
  const {
    productName,
    productDetail,
    productCost,
    productImage,
    productUrl,
    authorId,
    categories,
  } = req.body;

  const categoriesData = categories?.map(
    (product: Prisma.ProductCreateInput) => {
      return {
        categoryId: product?.categories,
      };
    }
  );

  const createProduct = await prisma.product.create({
    data: {
      productName,
      productDetail,
      productCost,
      productImage,
      productUrl,
      authorId,
      categories: categoriesData,
      isFavorite: false,
    },
    include: {
      categories: true,
    },
  });

  const assignCategories = await prisma.categoriesOnProduct.create({
    data: {
      product: productName,
      category: categories,
      assignedBy: authorId,
    },
    include: {
      product: true,
    },
  });

  res.json(
    `Product ${productName} with id ${createProduct.id} has created. categories: ${categories}.`
  );
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`)
);
