const express = require("express");

const user = require("./userDb");
const posts = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res, next) => {
  // do your magic!
  user
    .insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      next(error);
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res, next) => {
  // do your magic!
  const newPost = {
    user_id: req.params.id,
    text: req.body.text
  };

  posts
    .insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      next(error);
    });
});

router.get("/", (req, res, next) => {
  // do your magic!
  user
    .get()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      next(error);
    });
});

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  res.json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res, next) => {
  // do your magic!
  user
    .getUserPosts(req.user.id)
    .then(posts => {
      if (posts && posts.length) {
        res.status(200).json(posts);
      } else {
        res.status(200).json({
          message:
            "The user with the specified ID does not currently have any posts."
        });
      }
    })
    .catch(error => {
      next(error);
    });
});

router.delete("/:id", validateUserId, (req, res, next) => {
  // do your magic!
  user
    .remove(req.user.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The user has been deleted" });
      }
    })
    .catch(error => {
      next(error);
    });
});

router.put("/:id", validateUserId, validateUser, (req, res, next) => {
  // do your magic!
  user
    .update(req.user.id, req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          id: req.user.id,
          name: req.body.name
        });
      }
    })
    .catch(error => {
      next(error);
    });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  user
    .getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch(error => {
      next(error);
    });
}

function validateUser(req, res, next) {
  // do your magic!
  if (!req.body) {
    return res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    return res.status(400).json({ message: "missing required name field" });
  }
  next();
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
