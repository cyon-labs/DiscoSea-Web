// global.d.ts
interface Window {
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        // Add any other properties of solana if needed
      };
    };
  }