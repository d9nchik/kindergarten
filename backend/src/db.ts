import { Pool } from 'pg';

const connectionString =
  'postgresql://postgres:mysecretpassword@localhost:5432/postgres';

class DbConnection {
  public pool;

  private constructor() {
    this.pool = new Pool({ connectionString });
  }
  private static instance: null | DbConnection = null;

  static getInstance() {
    if (this.instance === null) {
      this.instance = new DbConnection();
    }
    return this.instance;
  }
}

export default DbConnection.getInstance().pool;
