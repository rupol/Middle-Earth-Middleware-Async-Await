const express = require("express");

const user = require("./userDb");
const posts = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, async (req, res, next) => {
  try {
    res.json(await user.insert(req.body));
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/posts",
  validateUserId,
  validatePost,
  async (req, res, next) => {
    try {
      const newPost = {
        user_id: req.params.id,
        text: req.body.text
      };

      res.json(await posts.insert(newPost));
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    res.json(await user.get());
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validateUserId, async (req, res) => {
  try {
    res.json(await req.user);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/posts", validateUserId, async (req, res, next) => {
  const posts = await user.getUserPosts(req.user.id);
  try {
    if (posts && posts.length) {
      res.json(posts);
    } else {
      res.json({
        message:
          "The user with the specified ID does not currently have any posts."
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", validateUserId, async (req, res, next) => {
  try {
    await user.remove(req.params.id);
    res.json({ message: "The user has been deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validateUserId, validateUser, async (req, res, next) => {
  try {
    await user.update(req.user.id, req.body);
    res.json({ id: req.user.id, name: req.body.name });
  } catch (error) {
    next(error);
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  const userObj = await user.getById(req.params.id);
  try {
    if (userObj) {
      req.user = userObj;
      await next();
    } else {
      await res.status(400).json({ message: "invalid user id" });
    }
  } catch (error) {
    next(error);
  }
}

function validateUser(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    return res.status(400).json({ message: "missing required name field" });
  }
  next();
}

function validatePost(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    return res.status(400).json({ message: "missing required text field" });
  }
  next();
}

module.exports = router;
