import { SignatureProvider } from "./types";
import { YousignProvider } from "./yousign";

export function createSignatureProvider(): SignatureProvider {
  const provider = process.env.SIGN_PROVIDER || "yousign";
  
  switch (provider) {
    case "yousign":
      return new YousignProvider();
    default:
      throw new Error(`Unsupported signature provider: ${provider}`);
  }
}