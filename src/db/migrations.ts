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
      await db.schema
        .createTable("proposals")
        .addColumn("rkey", "varchar", (col) => col.notNull())
        .addColumn("uri", "varchar", (col) => col.notNull())
        .addColumn("cid", "varchar")
        .addColumn("createdAt", "varchar", (col) => col.notNull())
        .addColumn("ingestedAt", "varchar", (col) => col.notNull())
        .addColumn("exp", "varchar")
        .addColumn("neg", "boolean", (col) => col.notNull())
        .addColumn("sig", "blob")
        .addColumn("src", "varchar", (col) => col.notNull())
        .addColumn("typ", "varchar", (col) => col.notNull())
        .addColumn("subject", "varchar", (col) => col.notNull())
        .addColumn("val", "varchar", (col) => col.notNull())
        .addColumn("ver", "integer")
        .addUniqueConstraint("unique_proposal", ["src", "rkey"])
        .execute();

      await db.schema
        .createTable("votes")
        .addColumn("rkey", "varchar", (col) => col.notNull())
        .addColumn("uri", "varchar", (col) => col.notNull())
        .addColumn("cid", "varchar", (col) => col.notNull())
        .addColumn("createdAt", "datetime", (col) => col.notNull())
        .addColumn("ingestedAt", "datetime", (col) => col.notNull())
        .addColumn("sig", "blob", (col) => col.notNull())
        .addColumn("src", "varchar", (col) => col.notNull())
        .addColumn("subject", "varchar", (col) => col.notNull())
        .addColumn("val", "integer", (col) => col.notNull())
        .addUniqueConstraint("unique_vote", ["src", "rkey"])
        .execute();

      await db.schema
        .createTable("publishedLabels")
        .addColumn("val", "varchar", (col) => col.notNull())
        .addColumn("uri", "varchar", (col) => col.notNull())
        .addColumn("score", "bigint", (col) => col.notNull())
        .addColumn("cid", "varchar")
        .addColumn("neg", "boolean")
        .addColumn("src", "varchar")
        .addColumn("cts", "datetime")
        .addColumn("exp", "datetime")
        .addPrimaryKeyConstraint("unique_label", ["val", "uri"])
        .execute();
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
