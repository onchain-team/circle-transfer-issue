# Circle Transfer Issue Reproduction

This project provides a minimal reproduction case for an issue with Circle SDK's `createBusinessTransfer` method that fails with internal server errors in both Sandbox and Production environments.

## Issue Description

When attempting to create a business transfer using the Circle SDK's `createBusinessTransfer` method, we consistently receive internal server errors in both environments:

### Sandbox Environment Error
```
{
  code: -1,
  message: 'Something went wrong. errId: 4519bd58ae51501351e7c2e5a2afa9d2'
}
```

### Production Environment Error
```
{
  code: -1,
  message: 'Something went wrong. errId: 03f91976bf3fb6e646b1189b14f85792'
}
```

This is not a typical client error (400 Bad Request) but rather appears to be an internal server error on Circle's side. The purpose of this repository is to provide the Circle team with a reproducible test case to help diagnose and fix the issue.

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

The expected behavior is that transfers should work properly in both environments. Currently:
- The Sandbox test fails with an internal server error (code: -1)
- The Production test also fails with a similar internal server error (code: -1)

## Project Structure

- `src/index.ts`: Main entry point that runs tests against both environments
- `src/circle-service.ts`: Service that wraps Circle SDK functionality, including address lookup
- `config/config.ts`: Configuration validation utility
- `test-params.json`: Test parameters with blockchain addresses, amount, and currency
- `.env.example`: Example environment file with configuration structure

## Sample Output

```
==== TESTING SANDBOX ENVIRONMENT ====
Getting recipient ID from address in sandbox...
Found recipient ID for address 0x.......: .......-....-....-....-............
Creating transfer in sandbox...
Attempting to create transfer in sandbox environment:
  Destination ID: ........-....-....-....-............
  Amount: 1.00 USD
Error creating transfer in sandbox environment:
{
  code: -1,
  message: 'Something went wrong. errId: 4519bd58ae51501351e7c2e5a2afa9d2'
}
❌ Failed to create transfer in sandbox:

==== TESTING PRODUCTION ENVIRONMENT ====
Getting recipient ID from address in production...
Found recipient ID for address 0x........................................: ........-....-....-....-............
Creating transfer in production...
Attempting to create transfer in production environment:
  Destination ID: ........-....-....-....-............
  Amount: 1.00 USD
Error creating transfer in production environment:
{
  code: -1,
  message: 'Something went wrong. errId: 03f91976bf3fb6e646b1189b14f85792'
}
❌ Failed to create transfer in production:
```

## Requirements

- Node.js 16+
- npm or yarn
