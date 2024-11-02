// src/components/StockOptions.js

const STOCK_OPTIONS = [
  // Original ETFs
  {
    value: "VAS.AX",
    label: "VAS - Vanguard Australian Shares",
    description: "Vanguard Australian Shares Index ETF",
  },
  {
    value: "IVV.AX",
    label: "IVV - iShares S&P 500",
    description: "iShares S&P 500 ETF",
  },
  {
    value: "OOO.AX",
    label: "OOO - BetaShares Crude Oil",
    description: "BetaShares Crude Oil Index ETF",
  },
  {
    value: "NDQ.AX",
    label: "NDQ - BetaShares NASDAQ 100",
    description: "BetaShares NASDAQ 100 ETF",
  },
  {
    value: "ASIA.AX",
    label: "ASIA - BetaShares Asia Technology",
    description: "BetaShares Asia Technology Tigers ETF",
  },
  {
    value: "VDHG.AX",
    label: "VDHG - Vanguard Diversified High Growth",
    description: "Vanguard Diversified High Growth Index ETF",
  },

  // Crypto-related
  {
    value: "CRYP.AX",
    label: "CRYP - BetaShares Crypto Innovators",
    description: "Crypto-focused companies ETF (High Volatility)",
  },
  {
    value: "COIN",
    label: "COIN - Coinbase Global",
    description: "Cryptocurrency Exchange Platform (High Volatility)",
  },

  // Technology & Innovation
  {
    value: "ARKK",
    label: "ARKK - ARK Innovation ETF",
    description: "Disruptive Innovation Companies (High Volatility)",
  },
  {
    value: "SNAS.AX",
    label: "SNAS - Ultra Short NASDAQ 100",
    description: "Leveraged Inverse NASDAQ ETF (Very High Volatility)",
  },
  {
    value: "LNAS.AX",
    label: "LNAS - Ultra Long NASDAQ 100",
    description: "Leveraged Long NASDAQ ETF (Very High Volatility)",
  },

  // Emerging Markets
  {
    value: "VEE.AX",
    label: "VEE - Vanguard Emerging Markets",
    description: "Emerging Markets Shares Index ETF (High Volatility)",
  },
  {
    value: "IEM.AX",
    label: "IEM - iShares Emerging Markets",
    description: "MSCI Emerging Markets ETF (High Volatility)",
  },

  // Thematic ETFs
  {
    value: "RBTZ.AX",
    label: "RBTZ - BetaShares Global Robotics & AI",
    description: "Robotics and Artificial Intelligence ETF (High Volatility)",
  },
  {
    value: "HACK.AX",
    label: "HACK - BetaShares Global Cybersecurity",
    description: "Cybersecurity ETF (High Volatility)",
  },
  {
    value: "CLDD.AX",
    label: "CLDD - BetaShares Cloud Computing",
    description: "Cloud Computing ETF (High Volatility)",
  },

  // Commodities and Materials
  {
    value: "MNRS.AX",
    label: "MNRS - BetaShares Global Gold Miners",
    description: "Gold Miners ETF (High Volatility)",
  },
  {
    value: "URNM",
    label: "URNM - Sprott Uranium Miners",
    description: "Uranium Mining Companies ETF (Very High Volatility)",
  },
  {
    value: "REMX",
    label: "REMX - VanEck Rare Earth/Strategic Metals",
    description: "Rare Earth & Strategic Metals ETF (High Volatility)",
  },

  // Leveraged ETFs
  {
    value: "GEAR.AX",
    label: "GEAR - BetaShares Geared Australian Equity",
    description: "Leveraged Australian Shares ETF (Very High Volatility)",
  },
  {
    value: "BBOZ.AX",
    label: "BBOZ - BetaShares Australian Strong Bear",
    description:
      "Leveraged Inverse Australian Shares ETF (Very High Volatility)",
  },

  // Individual Volatile Stocks
  {
    value: "ZIP.AX",
    label: "ZIP - Zip Co Limited",
    description: "Buy Now Pay Later Company (High Volatility)",
  },
  {
    value: "BRN.AX",
    label: "BRN - BrainChip Holdings",
    description: "AI Semiconductor Company (Very High Volatility)",
  },
  {
    value: "VUL.AX",
    label: "VUL - Vulcan Energy Resources",
    description: "Lithium Development Company (Very High Volatility)",
  },
  {
    value: "NVX.AX",
    label: "NVX - NOVONIX Limited",
    description: "Battery Technology Company (High Volatility)",
  },
  //can add more.
];

export default STOCK_OPTIONS;
