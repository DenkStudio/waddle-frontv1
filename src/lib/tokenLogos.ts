// Token logo mapping system
export interface TokenLogo {
  symbol: string;
  logoPath: string;
  name: string;
}

// Common token logos mapping
export const TOKEN_LOGOS: TokenLogo[] = [
  {
    symbol: "BTC",
    logoPath:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png",
    name: "Bitcoin",
  },
  {
    symbol: "ETH",
    logoPath:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1200px-Ethereum_logo_2014.svg.png",
    name: "Ethereum",
  },
  {
    symbol: "BNB",
    logoPath:
      "https://upload.wikimedia.org/wikipedia/commons/f/fc/Binance-coin-bnb-logo.png",
    name: "BNB",
  },
  {
    symbol: "SOL",
    logoPath:
      "https://upload.wikimedia.org/wikipedia/commons/3/34/Solana_cryptocurrency_two.jpg",
    name: "Solana",
  },
  {
    symbol: "ADA",
    logoPath:
      "https://s3.coinmarketcap.com/static-gravity/image/4aec70f6f1254e4f89650cc68ae49f3c.png",
    name: "Cardano",
  },
  {
    symbol: "DOT",
    logoPath: "https://s2.coinmarketcap.com/static/img/coins/200x200/6636.png",
    name: "Polkadot",
  },
  {
    symbol: "LSK",
    logoPath:
      "https://images.seeklogo.com/logo-png/44/2/lisk-lsk-logo-png_seeklogo-441303.png",
    name: "Lisk",
  },
];

/**
 * Get token logo information by symbol
 * @param symbol - Token symbol (e.g., "BTC", "ETH")
 * @returns TokenLogo object or null if not found
 */
export function getTokenLogo(symbol: string): TokenLogo | null {
  // Remove $ prefix if present and normalize to uppercase
  const normalizedSymbol = symbol.replace(/^\$/, "").toUpperCase();
  return TOKEN_LOGOS.find((token) => token.symbol === normalizedSymbol) || null;
}

/**
 * Get token logo path by symbol
 * @param symbol - Token symbol (e.g., "BTC", "ETH")
 * @returns Logo path string or default logo path
 */
export function getTokenLogoPath(symbol: string): string {
  const token = getTokenLogo(symbol);
  return token ? token.logoPath : "/logos/tokens/default.svg";
}

/**
 * Get token name by symbol
 * @param symbol - Token symbol (e.g., "BTC", "ETH")
 * @returns Token name or symbol if not found
 */
export function getTokenName(symbol: string): string {
  const token = getTokenLogo(symbol);
  return token ? token.name : symbol;
}

/**
 * Check if a token logo exists
 * @param symbol - Token symbol (e.g., "BTC", "ETH")
 * @returns Boolean indicating if logo exists
 */
export function hasTokenLogo(symbol: string): boolean {
  return getTokenLogo(symbol) !== null;
}
