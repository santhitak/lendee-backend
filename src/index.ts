import { PrismaClient } from "@prisma/client";
import express from "express";

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

//count comments
app.get("/comments/:productId/count", async (req, res) => {
  const { productId } = req.params;
  const commentCount = await prisma.comment.count({
    where: { productId: Number(productId) },
  });
  res.json(commentCount);
});

//count reviews
app.get("/reviews/:productId/count", async (req, res) => {
  const { productId } = req.params;
  const reviewCount = await prisma.review.count({
    where: { productId: Number(productId) },
  });
  res.json(reviewCount);
});

//Favorites
app.get("/products/:userId/favorites", async (req, res) => {
  const { userId } = req.params;
  const products = await prisma.favorite.findMany({
    where: { userId: Number(userId) },
  });
  res.json(products);
});

//comments CRUD
app.post("/comments/create", async (req, res) => {
  const { userId, detail, productId } = req.body;

  const comments = await prisma.comment.create({
    data: {
      userId,
      detail,
      productId,
    },
  });
  res.json(
    `comments ${detail} with id ${comments.id} has created by User ${userId} in Product ${productId}.`
  );
});

app.get("/comments", async (req, res) => {
  const comments = await prisma.comment.findMany();
  res.json(comments);
});

app.get("/comments/:productId", async (req, res) => {
  const { productId } = req.params;
  const commentsById = await prisma.comment.findMany({
    where: {
      productId: Number(productId),
    },
  });
  res.json(commentsById);
});

app.put("/comments/update/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { detail } = req.body;
  const updateComments = await prisma.comment.update({
    where: {
      id: Number(commentId),
    },
    data: {
      detail: detail,
    },
  });
  res.json(`comments has updated to ${updateComments}`);
});
app.delete("/comments/delete/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const deleteCommentsById = await prisma.comment.delete({
    where: {
      id: Number(commentId),
    },
  });
  res.json(`comments ${deleteCommentsById.id} has deleted`);
});

//reviews CRUD
app.post("/reviews/create", async (req, res) => {
  const { userId, detail, productId } = req.body;
  //ต้องเช็คด้วยวว่า เป็น 1 ในคนที่เคยยืมของชิ้นนี้หรือเปล่า
  if (productId) {
  }
  const reviews = await prisma.review.create({
    data: {
      userId,
      detail,
      productId,
    },
  });
  res.json(
    `reviews ${detail} with id ${reviews.id} has created by User ${userId} in Product ${productId}.`
  );
});

app.get("/reviews/:productId", async (req, res) => {
  const { productId } = req.params;
  const reviewsById = await prisma.review.findMany({
    where: {
      productId: Number(productId),
    },
  });
  res.json(reviewsById);
});

app.delete("/reviews/delete/:reviewId", async (req, res) => {
  const { reviewId } = req.params;
  const deleteReviewsById = await prisma.review.delete({
    where: {
      id: Number(reviewId),
    },
  });
  res.json(`reviews ${deleteReviewsById.id} has deleted`);
});

app.put("/reviews/update/:reviewId", async (req, res) => {
  const { reviewId } = req.params;
  const { detail } = req.body;
  const updateReviewId = await prisma.review.update({
    where: {
      id: Number(reviewId),
    },
    data: {
      detail: detail,
    },
  });
  res.json(`reviewId has updated to ${updateReviewId}`);
});

app.post("/products/create", async (req, res) => {
  const {
    productName,
    productDetail,
    productCost,
    productQuantity,
    productImage,
    productUrl,
    authorId,
    categories,
  } = req.body;

  const createProduct = await prisma.product.create({
    data: {
      productName,
      productDetail,
      productCost,
      productQuantity,
      productImage,
      productUrl,
      authorId,
      categories: {
        create: {
          categoryId: categories,
          assignedBy: authorId,
        },
      },
      isFavorite: false,
    },
    include: {
      categories: true,
    },
  });

  const assignCategories = prisma.categoriesOnProduct.create({
    data: {
      productId: Number(createProduct.id),
      categoryId: categories,
      assignedBy: authorId,
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
