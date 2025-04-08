import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

interface CircleConfig {
  sandboxApiKey: string;
  productionApiKey: string;
}

// Configuration for Circle API
export const circleConfig: CircleConfig = {
  sandboxApiKey: process.env.CIRCLE_API_KEY_SANDBOX || "",
  productionApiKey: process.env.CIRCLE_API_KEY_PRODUCTION || "",
};

// Validate configuration
export function validateConfig(): void {
  if (!circleConfig.sandboxApiKey) {
    throw new Error("CIRCLE_API_KEY_SANDBOX is required in the .env file");
  }

  if (!circleConfig.productionApiKey) {
    throw new Error("CIRCLE_API_KEY_PRODUCTION is required in the .env file");
  }
}
