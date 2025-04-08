import {
  Chain,
  Circle,
  CircleEnvironments,
  MoneyCurrencyEnum,
} from "@circle-fin/circle-sdk";

export class CircleTransferService {
  private circleClient: any;
  private environment: "sandbox" | "production";

  constructor(environment: "sandbox" | "production" = "sandbox") {
    this.environment = environment;

    // Initialize the Circle client with the appropriate API key
    const apiKey =
      environment === "sandbox"
        ? process.env.CIRCLE_API_KEY_SANDBOX
        : process.env.CIRCLE_API_KEY_PRODUCTION;

    if (!apiKey) {
      throw new Error(
        `API key for ${environment} environment is not set. Please check your environment variables.`
      );
    }

    this.circleClient = new Circle(
      apiKey,
      environment === "production"
        ? CircleEnvironments.production
        : CircleEnvironments.sandbox
    );
  }

  /**
   * Get a recipient object from an address and chain
   * @param accountAddress The blockchain address
   * @param chain The blockchain chain as a string (e.g., "ETH", "POLY", "SOL")
   * @returns The recipient object or null if not found
   */
  public async getRecipientForAddress(
    accountAddress: string,
    chain: string
  ): Promise<any> {
    console.log(
      `Fetching recipient addresses from Circle (${this.environment})`
    );
    const response =
      await this.circleClient.addresses.listBusinessRecipientAddresses();
    const data = response.data?.data || [];

    const recipient = data.find(
      (address: any) =>
        address.address?.toLowerCase() === accountAddress.toLowerCase() &&
        address.chain === Chain.Eth
    );

    if (recipient) {
      console.log(
        `Found recipient ID for address ${accountAddress}: ${recipient.id}`
      );
    } else {
      console.log(
        `No recipient found for address ${accountAddress} on chain ${chain}`
      );
    }

    return recipient || null;
  }

  /**
   * Attempt to create a business transfer using the Circle SDK
   * @param sourceId The ID of the source wallet/account
   * @param destinationId The ID of the destination wallet/account
   * @param amount The amount to transfer
   * @param currency The currency code (e.g., "USD")
   */
  public async createTransfer(
    destinationId: string,
    amount: string
  ): Promise<any> {
    try {
      console.log(
        `Attempting to create transfer in ${this.environment} environment:`
      );
      console.log(`  Destination ID: ${destinationId}`);
      console.log(`  Amount: ${amount} ${MoneyCurrencyEnum.Usd}`);

      // Call the Circle API to create a business transfer
      const response = await this.circleClient.transfers.createBusinessTransfer(
        {
          destination: {
            type: "wallet",
            id: destinationId,
          },
          amount: {
            amount: amount,
            currency: MoneyCurrencyEnum.Usd,
          },
          idempotencyKey: `circle-transfer-test-${Date.now()}`,
        }
      );

      console.log(
        "Transfer created successfully:",
        JSON.stringify(response, null, 2)
      );

      const {
        data: { data },
      } = response;

      return data.id;
    } catch (error) {
      console.error(
        `Error creating transfer in ${this.environment} environment:`
      );
      console.error((error as any).response.data);

      return null;
    }
  }
}
