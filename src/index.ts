import { validateConfig } from "../config/config";
import { CircleTransferService } from "./circle-service";
import * as fs from "fs";
import * as path from "path";

// Load test parameters from JSON file
function loadTestParams() {
  try {
    const filePath = path.resolve(__dirname, "../test-params.json");
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading test parameters:", error);
    throw new Error("Failed to load test parameters from test-params.json");
  }
}

/**
 * Get recipient for a blockchain address
 */
async function getRecipient(
  service: CircleTransferService,
  address: string,
  chain: string,
  environment: string
) {
  console.log(`Getting recipient ID from address in ${environment}...`);
  const recipient = await service.getRecipientForAddress(address, chain);

  if (!recipient) {
    throw new Error(
      `Destination recipient not found in ${environment} environment`
    );
  }

  return recipient;
}

/**
 * Create a transfer safely with error handling
 */
async function safeCreateTransfer(
  service: CircleTransferService,
  recipientId: string,
  amount: string,
  environment: string
) {
  try {
    console.log(`Creating transfer in ${environment}...`);
    await service.createTransfer(recipientId, amount);
    console.log(`✅ ${environment} transfer completed successfully`);
  } catch (error) {
    console.error(`❌ Failed to create transfer in ${environment}:`);
  }
}

/**
 * Run test for a specific environment
 */
async function runEnvironmentTest(
  environment: "sandbox" | "production",
  destination: { address: string; chain: string },
  amount: string
) {
  console.log(`\n==== TESTING ${environment.toUpperCase()} ENVIRONMENT ====`);

  const service = new CircleTransferService(environment);

  // Step 1: Get recipient ID from address
  const recipient = await getRecipient(
    service,
    destination.address,
    destination.chain,
    environment
  );

  // Step 2: Create transfer using recipient ID
  await safeCreateTransfer(service, recipient.id, amount, environment);
}

async function main() {
  try {
    // Validate configuration
    validateConfig();

    // Load test parameters
    const testParams = loadTestParams();
    const { sandboxDestination, productionDestination, amount, currency } =
      testParams;

    console.log("Test parameters loaded:");
    console.log("Sandbox Destination:", sandboxDestination);
    console.log("Production Destination:", productionDestination);
    console.log("Amount:", amount);
    console.log("Currency:", currency);

    // Run tests for both environments
    await runEnvironmentTest("sandbox", sandboxDestination, amount);
    await runEnvironmentTest("production", productionDestination, amount);
  } catch (error) {
    console.error("Error running test:", error);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
