# Circle Transfer Issue Reproduction

This project provides a minimal reproduction case for an issue with Circle SDK's `createBusinessTransfer` method that works in Sandbox but fails in Production with the error:

```
{
 code: -1,
 message: "Something went wrong. errId: a8aed7a7dd33ccfba17a28788f2dad13"
}
```

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the example environment file and fill in your Circle API credentials:
   ```
   cp .env.example .env
   ```
4. Edit the `.env` file and add your Circle API keys:
   - `CIRCLE_API_KEY_SANDBOX`: Your Circle API key for the Sandbox environment
   - `CIRCLE_API_KEY_PRODUCTION`: Your Circle API key for the Production environment
5. Update the `test-params.json` with your blockchain addresses:
   ```json
   {
     "sandboxDestination": {
       "address": "0xYourSandboxDestinationAddress",
       "chain": "sepolia"
     },
     "productionDestination": {
       "address": "0xYourProductionDestinationAddress",
       "chain": "ethereum"
     },
     "amount": "10.00",
     "currency": "USD"
   }
   ```

## Running the Test

To run the test against both Sandbox and Production environments:

```
npm start
```

This will:
1. First get the recipient IDs by the provided blockchain `Addresses`
2. Then attempt to create a transfer in the Sandbox environment
3. Then attempt to create a transfer in the Production environment
4. Log the results of both attempts

## Expected Behavior

- The Sandbox test should complete successfully
- The Production test should fail with the error code -1

## Project Structure

- `src/index.ts`: Main entry point that runs tests against both environments
- `src/circle-service.ts`: Service that wraps Circle SDK functionality, including address lookup
- `config/config.ts`: Configuration validation utility
- `test-params.json`: Test parameters with blockchain addresses, amount, and currency
- `.env.example`: Example environment file with configuration structure

## Requirements

- Node.js 16+
- npm or yarn
