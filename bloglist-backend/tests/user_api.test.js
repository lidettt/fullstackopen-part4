const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);
const { test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("lidet123", 10);
  const user = new User({ username: "admin", passwordHash });
  await user.save();
});

test("create a new user succeeds with a new username", async () => {
  const usersAtStart = await User.find({});
  const newUser = {
    username: "lidet",
    name: "Voeun Chanlidet",
    password: "lidet16",
  };
  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const usersAtEnd = await User.find({});
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
});

test("check if try to create a new user with duplicate name", async () => {
  const usersAtStart = await User.find({});
  const newUser = {
    username: "admin",
    name: "duplicate name",
    password: "lidet123",
  };
  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);
  assert.ok(result.body.error.includes("unique"));
  const usersAtEnd = await User.find({});
  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});
test("check if try to create a new user when username or password is missing", async () => {
  const usersAtStart = await User.find({});
  const newUser = {
    username: "",
    name: "Missing Username or Password",
    password: "",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.ok(result.body.error.includes("required"));
  const usersAtEnd = await User.find({});
  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

test("check if try to create a new user when username or password is too short", async () => {
  const usersAtStart = await User.find({});
  const newUser = {
    username: "ab",
    name: "username or password too short",
    password: "12",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);
  assert.ok(result.body.error.includes("at least 3 characters"));
  const usersAtEnd = await User.find({});
  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

after(async () => {
  await mongoose.connection.close();
});
