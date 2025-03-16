import Pino, { Logger } from "pino";
import dotenv from "dotenv";

export class Environment {
  logger: Logger;

  /// port the labeler server will run on
  port: number = 21723;

  /// location of the sqlite db, either a filepath or :memory:
  db_location: string = ":memory:";

  /// did of the platform account that publishes pmsky records to listen for
  platform_did!: string;

  /// did of the labeler account
  labeler_did!: string;

  /// signing key of the labeler account
  signingKey!: string;

  logLevel: string;

  constructor() {
    dotenv.config();
    this.logLevel = this.loadStr("LOG_LEVEL", "trace");
    this.logger = Pino({ level: this.logLevel });
    this.logger.info(
      this.logLevel,
      "Environment loaded, logger initialized with level"
    );

    this.port = this.loadNum("PORT", 14831);
    this.db_location = this.loadStr("DB_LOCATION", ":memory:");
    this.labeler_did = this.loadStr("LABELER_DID");
    this.platform_did = this.loadStr("PLATFORM_DID");
    this.signingKey = this.loadStr("SIGNING_KEY");
  }

  private loadNum(key: string, defaultValue?: number): number {
    const value = process.env[key];
    if (!value) {
      if (defaultValue) return defaultValue;
      throw new MissingEnvVariable(key);
    }
    try {
      return parseInt(value);
    } catch (e) {
      if (defaultValue) {
        this.logger.warn(
          `Bad environment variable: ${key}, defaulting to ${defaultValue}`
        );
        return defaultValue;
      }
      throw new BadEnvVariable(key, "number");
    }
  }

  private loadStr(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (!value) {
      if (defaultValue) return defaultValue;
      throw new MissingEnvVariable(key);
    }
    return value;
  }
}

export class MissingEnvVariable extends Error {
  constructor(key: string) {
    super(`Missing environment variable: ${key}`);
  }
}

export class BadEnvVariable extends Error {
  constructor(key: string, expected: string) {
    super(`Bad environment variable: ${key} (expected a ${expected})`);
  }
}
