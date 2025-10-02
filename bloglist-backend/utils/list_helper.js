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
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
