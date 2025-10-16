const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});
blogsRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});
blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(400).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });
  if (!body.title || !body.url) {
    return response.status(400).end();
  }
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});
blogsRouter.delete("/:id", async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: "token missing" });
  }
  const blog = await Blog.findById(request.params.id);
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  // Check if the user owns the blog
  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response
      .status(403)
      .json({ error: "This blog is not yours to delete" });
  }
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});
blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).end();
  }
  blog.title = body.title;
  blog.author = body.author;
  blog.url = body.url;
  blog.likes = body.likes;

  const updatedBlog = await blog.save();
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
