const db = require("../db/connection.js");

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];
  const validOrder = ["asc", "ASC", "desc", "DESC"];
  // const validTopics = 
  const topicVal = [];
  
  let queryStr = `
  SELECT 
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.votes,
  COUNT(comment_id)::int AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id`;

  if (topic) {
    queryStr += ` WHERE topic = $1 
                  GROUP BY articles.article_id`;
    topicVal.push(topic);
  } else {
    queryStr += ` GROUP BY articles.article_id`;
  }

  if (validSortBy.includes(sort_by)) {
    queryStr += ` ORDER BY ${sort_by}`;
    if (validOrder.includes(order)) {
      queryStr += ` ${order}`;
    } else queryStr += ` DESC`;
  } else
    return Promise.reject({
      status: 400,
      msg: "Bad request, please provide valid input",
    });
  return db.query(queryStr, topicVal).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticle = (article_id) => {
  const queryStr = `
  SELECT 
    articles.*,
    COUNT(comment_id)::int AS comment_count
  FROM
    articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;`;

  return db.query(queryStr, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    } else return rows[0];
  });
};

exports.fetchArticleToPatch = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else return rows[0];
    });
};
