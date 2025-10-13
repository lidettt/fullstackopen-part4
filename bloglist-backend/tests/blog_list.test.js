const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("../tests/test_helper");
const Blog = require("../models/blog");
const { request } = require("node:http");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("the amount of all the blogs", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});
test("verify the unique indentifier of the blog posts to named id", async () => {
  const response = await api.get("/api/blogs");
  const blog = response.body[0];
  assert.ok(blog.id);
  assert.strictEqual(blog._id, undefined);
});
test("verify the HTTP POST request successfully create a new blog post", async () => {
  const initialBlogs = await helper.blogInDb();
  const newBlog = {
    likes: 999,
    author: "Test",
    title: "Tesing the HTTP POST request",
    url: "https://fullstackopen.com/en/",
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const blogsAfterPost = await helper.blogInDb();

  assert.strictEqual(blogsAfterPost.length, initialBlogs.length + 1);
});

after(async () => {
  await mongoose.connection.close();
});
