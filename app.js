const express = require("express");
const { getEndpoints } = require("./controllers/api.controllers.js");
const { getTopics } = require("./controllers/topics.controllers.js");
const {
  getArticle,
  getArticles,
  patchArticle,
} = require("./controllers/articles.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");
const {
  getComments,
  addComment,
  getCommentToDelete,
} = require("./controllers/comments.controllers.js");
const {
  PSQLErrorHandler,
  customErrorHandler,
  routeErrorHandler,
  internalServerErrorHandler,
} = require("./controllers/errors.controllers.js");
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", getEndpoints);

// Topic routes
app.get("/api/topics", getTopics);

// Article routes
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", patchArticle);

// Comment routes
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", addComment);
app.delete("/api/comments/:comment_id", getCommentToDelete);

// User routes
app.get("/api/users", getUsers);

// Error handlers
app.use(PSQLErrorHandler);
app.use(customErrorHandler);
app.all("/*", routeErrorHandler);
app.use(internalServerErrorHandler);

module.exports = app;
