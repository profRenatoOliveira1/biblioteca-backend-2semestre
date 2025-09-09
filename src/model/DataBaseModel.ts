import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

export class DataBaseModel {
  private _pool: pg.Pool;

  constructor() {
    if (!process.env.DATABASE_URL) {
      // Local/dev por variáveis separadas
      this._pool = new pg.Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT) || 5432,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
        max: 10,
        idleTimeoutMillis: 10_000,
      });
      return;
    }

    // PRODUÇÃO: desmonta a URL e passa os campos + SSL no-verify
    const u = new URL(process.env.DATABASE_URL);
    const user = decodeURIComponent(u.username);
    const password = decodeURIComponent(u.password);
    const host = u.hostname;
    const port = Number(u.port || 5432);
    const database = u.pathname.replace(/^\//, "");

    // logs mínimos (não expõem segredos)
    console.log("[DB] Host:", host, "Port:", port, "Pooler?", host.includes("pooler.supabase.com"));

    this._pool = new pg.Pool({
      host,
      port,
      database,
      user,
      password,
      // 👇 força ignorar a cadeia (continua TLS criptografado)
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 10_000,
    });
  }

  public async testeConexao(): Promise<boolean> {
    try {
      const { rows } = await this._pool.query("select now()");
      console.clear();
      console.log("Database connected!", rows[0].now);
      return true;
    } catch (error) {
      console.error("Error to connect database X(", error);
      console.error("Não foi possível conectar ao banco de dados");
      return false;
    }
  }

  public get pool() {
    return this._pool;
  }
}
