const lodash = require("lodash");
const dummy = (blogs) => {
  return 1;
};
const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};
const favoriteBlog = (blogs) => {
  const favBlog = blogs.reduce((fav, blog) => {
    return blog.likes > fav.likes ? blog : fav;
  });
  return favBlog;
};
const mostBlogs = (blogs) => {
  const blogOfAuthorCount = lodash.countBy(blogs, "author");
  const blogOfAuthorCountArray = lodash.map(
    blogOfAuthorCount,
    (blogs, author) => ({ author, blogs })
  );
  return lodash.maxBy(blogOfAuthorCountArray, "blogs");
};
const mostLikes = (blogs) => {
  const groupedBlogsByAuthor = lodash.groupBy(blogs, "author");
  const likesOfAuthorCountArray = lodash.map(
    groupedBlogsByAuthor,
    (authorBlogs, author) => ({
      author,
      likes: lodash.sumBy(authorBlogs, "likes"),
    })
  );
  return lodash.maxBy(likesOfAuthorCountArray, "likes");
};
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
