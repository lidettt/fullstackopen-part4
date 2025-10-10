const Blog = require("../models/blog");

const initialBlogs = [
  {
    likes: 200000,
    author: "Arika",
    title: "Photography blog: Zion Adventure Photog",
    url: "https://www.zionadventurephotog.com/",
  },
  {
    title: "Seasons in Colour",
    author: "Jenny Kakoudakis",
    url: "https://www.wix.com/blog/how-to-start-an-interior-design-blog",
    likes: 500000,
  },
  {
    title: "Bella & Bloom",
    author: "Shellie",
    url: "https://www.bellaandbloom.com/blog",
    likes: 1000000,
  },
];
const blogInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  blogInDb,
  initialBlogs,
};
