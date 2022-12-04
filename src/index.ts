import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

//CRUD products
app.post("/products/create", async (req, res) => {
  const {
    authorId,
    productName,
    productDetail,
    productCost,
    productQuantity,
    productUrl,
    categories,
    isFavorite,
    productImage,
  } = req.body;

  const createProduct = await prisma.product.create({
    data: {
      productName,
      productDetail,
      productCost,
      productQuantity,
      productUrl,
      authorId,
      isFavorite: false,
    },
  });

  const assignCategories = await prisma.categoriesOnProduct.create({
    data: {
      productId: Number(createProduct.id),
      categoryId: categories,
      assignedBy: authorId,
    },
  });
  for (let i = 0; i < productImage.length; i++) {
    await prisma.productImage.create({
      data: {
        productId: Number(createProduct.id),
        img: productImage[i],
      },
    });
  }
  res.json(
    `Product ${productName} with id ${createProduct.id} has created. categories: ${categories} `
  );
});
app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const products = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      product: true,
    },
  });

  res.json(products);
});
app.put("/products/update/:productId", async (req, res) => {
  const { productId } = req.params;
  const { productName, productDetail, productCost, productQuantity } = req.body;
  const updateProducts = await prisma.product.update({
    where: {
      id: Number(productId),
    },
    data: {
      productName,
      productDetail,
      productCost,
      productQuantity,
    },
  });
  res.json(`products has updated`);
});
app.delete("/products/delete/:productId", async (req, res) => {
  const { productId } = req.params;
  const deleteProductsById = await prisma.product.delete({
    where: {
      id: Number(productId),
    },
  });

  res.json(`products ${deleteProductsById.id} has deleted`);
});

//Read Product Image by Product ID
app.get("/productImages/:productId", async (req, res) => {
  const { productId } = req.params;
  const images = await prisma.productImage.findMany({
    where: {
      productId: Number(productId),
    },
  });
  res.json(images);
});

//Read All users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

//read img
app.get("/productImages", async (req, res) => {
  const users = await prisma.productImage.findMany();
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
  const favorite = await prisma.favorite.findMany({
    where: { userId: Number(userId) },
  });
  // const products = await prisma.product.findMany({
  //   where: { id: Number() },
  // });
  res.json(favorite);
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
  res.json(`comments has updated to ${updateComments.detail}}`);
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
  const { userId, detail, productId, rating } = req.body;
  //ต้องเช็คด้วยวว่า เป็น 1 ในคนที่เคยยืมของชิ้นนี้หรือเปล่า

  const reviews = await prisma.review.create({
    data: {
      userId,
      detail,
      rating,
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

app.get("/reviews", async (req, res) => {
  const reviewsById = await prisma.review.findMany({});
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

//add isFavorite
app.get("/favorites/:userId", async (req, res) => {
  const { userId } = req.params;
  const getFavoriteById = await prisma.favorite.findMany({
    where: {
      userId: Number(userId),
    },
  });
  res.json(getFavoriteById);
});

app.put("/favorites/onFav/:productId", async (req, res) => {
  const { productId } = req.params;
  const updateProduct = await prisma.product.update({
    where: {
      id: Number(productId),
    },
    data: {
      isFavorite: true,
    },
  });
  const updateFavorite = await prisma.favorite.create({
    data: {
      productId: Number(productId),
      userId: 1,
    },
  });
  res.json(`favorites has updated`);
});
app.delete("/favorites/offFav/:productId", async (req, res) => {
  const { productId } = req.params;
  const removeFavorite = await prisma.favorite.deleteMany({
    where: {
      productId: Number(productId),
      userId: 1,
    },
  });
  const updateIsFavorite = await prisma.product.update({
    where: {
      id: Number(productId),
    },
    data: {
      isFavorite: false,
    },
  });
  res.json(`favorite product has removed`);
});

app.post("/favorites/:productId", async (req, res) => {
  const { productId } = req.params;
  const updateisFavorite = await prisma.favorite.create({
    data: {
      productId: Number(productId),
      userId: 1,
    },
  });

  const updateIsFavorite = await prisma.product.update({
    where: {
      id: Number(productId),
    },
    data: {
      isFavorite: true,
    },
  });

  res.json(updateisFavorite);
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`)
);
