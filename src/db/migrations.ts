import SqliteDb from "better-sqlite3";
import {
  Kysely,
  type Migration,
  type MigrationProvider,
  Migrator,
  SqliteDialect,
} from "kysely";
import { DatabaseSchema } from "./types";

const migrationProvider: MigrationProvider = {
  async getMigrations() {
    return migrations;
  },
};

const migrations: Record<string, Migration> = {
  "001": {
    async up(db) {
      // TODO: fill out table creation
      await db.schema.createTable("proposals");
    },
  },
};

// APIs

export const createDb = (location: string): Database => {
  return new Kysely<DatabaseSchema>({
    dialect: new SqliteDialect({ database: new SqliteDb(location) }),
  });
};

export const migrateToLatest = async (db: Database) => {
  const migrator = new Migrator({ db, provider: migrationProvider });
  const { error } = await migrator.migrateToLatest();
  if (error) throw error;
};

export type Database = Kysely<DatabaseSchema>;
