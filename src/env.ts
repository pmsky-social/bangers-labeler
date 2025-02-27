export class Environment {
  /// port the labeler server will run on
  port!: number;

  /// location of the sqlite db, either a filepath or :memory:
  db_location!: string;

  /// did of the platform account that publishes pmsky records to listen for
  platform_did!: string;

  /// did of the labeler account
  labeler_did!: string;

  /// signing key of the labeler account
  signingKey!: string;

  public static load(): Environment {
    return {
      port: Environment.loadNum("PORT", 14831),
      db_location: Environment.loadStr("DB_LOCATION", ":memory:"),
      labeler_did: Environment.loadStr("LABELER_DID"),
      platform_did: Environment.loadStr("PLATFORM_DID"),
      signingKey: Environment.loadStr("SIGNING_KEY"),
    };
  }

  private static loadNum(key: string, defaultValue?: number): number {
    const value = process.env[key];
    if (!value) {
      if (defaultValue) return defaultValue;
      throw new MissingEnvVariable(key);
    }
    try {
      return parseInt(value);
    } catch (e) {
      if (defaultValue) {
        console.warn(
          `Bad environment variable: ${key}, defaulting to ${defaultValue}`
        );
        return defaultValue;
      }
      throw new BadEnvVariable(key, "number");
    }
  }

  private static loadStr(key: string, defaultValue?: string): string {
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
