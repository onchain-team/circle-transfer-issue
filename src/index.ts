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

    // Test in Sandbox environment
    console.log("\n==== TESTING SANDBOX ENVIRONMENT ====");
    const sandboxService = new CircleTransferService("sandbox");
    // Step 1: Get recipient ID from address
    console.log("Getting recipient ID from address in Sandbox...");
    const sandboxRecipient = await sandboxService.getRecipientForAddress(
      sandboxDestination.address,
      sandboxDestination.chain
    );

    if (!sandboxRecipient) {
      console.error("Destination recipient not found in Sandbox environment");
      return;
    }

    // Step 2: Create transfer using recipient ID
    await sandboxService.createTransfer(sandboxRecipient.id, amount);
    console.log("✅ Sandbox test completed successfully");

    // Test in Production environment
    console.log("\n==== TESTING PRODUCTION ENVIRONMENT ====");
    const prodService = new CircleTransferService("production");
    // Step 1: Get recipient ID from address
    console.log("Getting recipient ID from address in Production...");
    const productionRecipient = await prodService.getRecipientForAddress(
      productionDestination.address,
      productionDestination.chain
    );

    if (!productionRecipient) {
      console.error(
        "Destination recipient not found in Production environment"
      );
      return;
    }

    // Step 2: Create transfer using recipient ID
    await prodService.createTransfer(productionRecipient.id, amount);
    console.log("✅ Production test completed successfully");
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
