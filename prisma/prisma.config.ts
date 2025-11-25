export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/astracommerce?schema=public',
    },
  },
};
