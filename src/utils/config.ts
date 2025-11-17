import dotenv from "dotenv";

dotenv.config({ quiet: true });

export type ConfigType = Record<string, string | undefined>;

export function validateEnvVariables(config: ConfigType) {
  const missingVars: string[] = [];

  for (const key in config) {
    const value = config[key];
    if (!value) {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    console.error(
      `Error : Missing environment variables: ${missingVars.join(", ")}`
    );
    process.exit(1);
  }
}

export function createConfig<T extends readonly string[]>(configKeys: T) {
  const config = configKeys.reduce(
    (acc: Record<T[number], string>, key: T[number]) => {
      acc[key] = process.env[key] || "";
      return acc;
    },
    {} as Record<T[number], string>
  );

  validateEnvVariables(config as unknown as ConfigType);

  return Object.freeze(config);
}