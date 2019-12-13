const express = require("express");

const posts = require("./postDb");

const router = express.Router();

router.get("/", (req, res, next) => {
  // do your magic!
  posts
    .get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      next(error);
    });
});

router.get("/:id", validatePostId, (req, res) => {
  // do your magic!
  res.json(req.post);
});

router.delete("/:id", validatePostId, (req, res, next) => {
  // do your magic!
  posts
    .remove(req.post.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The post has been deleted" });
      }
    })
    .catch(error => {
      next(error);
    });
});

router.put("/:id", validatePostId, validatePost, (req, res, next) => {
  // do your magic!
  posts
    .update(req.post.id, req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          id: req.post.id,
          text: req.body.text,
          user_id: req.post.user_id
        });
      }
    })
    .catch(error => {
      next(error);
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  posts
    .getById(req.params.id)
    .then(post => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(400).json({ message: "invalid post id" });
      }
    })
    .catch(error => {
      next(error);
    });
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body) {
    return res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    return res.status(400).json({ message: "missing required text field" });
  }
  next();
}

module.exports = router;
