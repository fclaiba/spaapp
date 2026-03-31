process.env.NODE_ENV = "test";
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/spaapp2_test?schema=public";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-super-secret-token";
process.env.FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";
