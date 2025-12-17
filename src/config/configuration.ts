export default () => ({
  port: process.env.PORT || 5121,
  dbUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || 'billing-service',
    brokers: process.env.KAFKA_BROKERS
      ? process.env.KAFKA_BROKERS.split(',')
      : ['localhost:9092'],
  },
});
