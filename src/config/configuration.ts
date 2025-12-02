export default () => ({
  port: process.env.PORT || 5121,
  dbUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
