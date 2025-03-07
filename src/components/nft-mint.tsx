"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import {
  ClaimButton,
  ConnectButton,
  MediaRenderer,
  NFT,
  useActiveAccount,
} from "thirdweb/react";

import { client } from "@/lib/thirdwebClient";
import React from "react";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { lightTheme } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
const wallets = [
  createWallet("io.metamask"),
  createWallet("io.rabby"),
  createWallet("com.okex.wallet"),
  createWallet("com.bitget.web3"),
  createWallet("com.trustwallet.app"),
];

type Props = {
  contract: ThirdwebContract;
  displayName: string;
  description: string;
  contractImage: string;
  pricePerToken: number | null;
  currencySymbol: string | null;
  isERC1155: boolean;
  isERC721: boolean;
  tokenId: bigint;
};

export function NftMint(props: Props) {
  const [isMinting, setIsMinting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const account = useActiveAccount();
  const MAX_MINT_PER_ADDRESS = 3;

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.min(MAX_MINT_PER_ADDRESS, Math.max(1, value)));
  };

  if (!props.pricePerToken) {
    console.error("Invalid pricePerToken");
    return null;
  }

  const totalPrice = props.pricePerToken * quantity;

  return (
    <div className="bg-gradient-to-r from-green-300 via-teal-300 to-green-200 min-h-screen text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-[#1E1E1E] p-4 sm:p-6 flex justify-between items-center shadow-md border-b border-gray-700 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white">Matcha TEA</h1>
        <div className="flex items-center space-x-6">
          <nav className="hidden sm:flex space-x-8 text-sm">
            <a href="#about" className="text-white hover:text-green-400 transition-all duration-300">About</a>
            <a href="#mint" className="text-white hover:text-green-400 transition-all duration-300">Mint</a>
            <a href="#explore" className="text-white hover:text-green-400 transition-all duration-300">Explore</a>
          </nav>
          <ConnectButton
            client={client}
            wallets={wallets}
            theme={lightTheme({
              colors: {
                primaryButtonBg: "hsl(161, 69%, 28%)",
                modalBg: "hsl(300, 20%, 99%)",
              },
            })}
            connectModal={{
              size: "compact",
              showThirdwebBranding: false,
            }}
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col sm:flex-row items-center justify-between max-w-screen-xl mx-auto mb-12 space-y-6 sm:space-y-0 sm:space-x-8 p-6 sm:p-12">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-gray-800 dark:text-white">Matcha TEA – Tea-Assam Testnet</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Matcha TEA is an innovative DeFi project built on the Tea-Assam Testnet, aiming to create a decentralized financial ecosystem with a focus on security and transaction efficiency
          </p>
        </div>
        <div className="relative w-full sm:w-1/2">
          <MediaRenderer
            client={client}
            className="rounded-lg shadow-xl w-full h-full object-cover"
            alt="NFT"
            src={props.contractImage || "/placeholder.svg?height=400&width=400"}
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white dark:bg-[#2D2D2D] p-6 sm:p-12 text-gray-800 dark:text-white">
        <h3 className="text-3xl font-semibold mb-6">Why Mint This NFT?</h3>
        <p className="text-lg">
        Currently, Matcha TEA is hosting an NFT minting event for early contributors as a way to reward early supporters of the project. These NFTs serve as proof of contribution and will later be eligible for redeeming or earning $MATCHA tokens once the project officially launches on the mainnet. By participating in this NFT minting, users gain an exclusive opportunity to be part of the early Matcha TEA community and enjoy various benefits within its ecosystem.
        </p>
      </section>
      <br>
      </br>

      {/* NFT Minting Section */}
      <section id="mint" className="w-full max-w-4xl mx-auto bg-white dark:bg-[#1A1A1A] shadow-2xl rounded-xl p-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-6">
          {/* NFT Details */}
          <div className="flex-1">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">{props.displayName}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{props.description}</p>
          </div>

          {/* Minting Controls */}
          <div className="flex-1 bg-[#F4F1EA] dark:bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
            <div className="relative mb-4">
              <MediaRenderer
                client={client}
                className="rounded-lg shadow-xl w-full h-full object-cover"
                alt="NFT Preview"
                src={props.contractImage || "/placeholder.svg?height=400&width=400"}
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {props.pricePerToken} {props.currencySymbol}/each
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="rounded-r-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  className="w-20 text-center border-x-0 text-lg"
                  min="1"
                  max={MAX_MINT_PER_ADDRESS}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= MAX_MINT_PER_ADDRESS}
                  aria-label="Increase quantity"
                  className="rounded-l-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-base font-semibold dark:text-white">
                Total: {totalPrice} {props.currencySymbol}
              </div>
            </div>

            {/* Mint Button */}
            <ClaimButton
              theme={"dark"}
              contractAddress={props.contract.address}
              chain={props.contract.chain}
              client={props.contract.client}
              claimParams={{
                type: props.isERC1155 ? "ERC1155" : "ERC721",
                tokenId: props.tokenId,
                quantity: BigInt(quantity),
                to: account ? account.address : "",
                from: account ? account.address : "",
              }}
              style={{ backgroundColor: "#167A5B", color: "white", width: "100%" }}
              disabled={isMinting}
              onTransactionSent={() => {
                setIsMinting(true);
                toast.info("Minting NFT...");
              }}
              onTransactionConfirmed={() => {
                setIsMinting(false);
                toast.success(`Minted ${quantity} NFT${quantity > 1 ? "s" : ""}`);
              }}
              onError={(err) => {
                setIsMinting(false);
                toast.error(err.message);
              }}
            >
              Mint {quantity} NFT{quantity > 1 ? "s" : ""}
            </ClaimButton>
          </div>
        </div>
      </section>

      {/* Configuration Details */}
      <section id="config" className="bg-[#F4F1EA] dark:bg-[#2A2A2A] p-6 sm:p-12 mb-12 rounded-xl">
        <h3 className="text-3xl font-semibold mb-6">Network Configuration</h3>
        <ul className="space-y-4">
          <li><strong>Network Name:</strong> tea-assam</li>
          <li><strong>RPC URL:</strong> <a href="https://assam-rpc.tea.xyz" target="_blank" className="text-green-600 hover:text-green-800">https://assam-rpc.tea.xyz</a></li>
          <li><strong>Chain ID:</strong> 93384</li>
          <li><strong>Currency Symbol:</strong> $TEA</li>
          <li><strong>Block Explorer:</strong> <a href="https://assam.tea.xyz" target="_blank" className="text-green-600 hover:text-green-800">https://assam.tea.xyz</a></li>
          <li><strong>Bridge:</strong> <a href="https://tetsuo.conduit.xyz/bridge/redirect?slug=tea-assam-fo46m5b966" target="_blank" className="text-green-600 hover:text-green-800">https://tetsuo.conduit.xyz/bridge/redirect?slug=tea-assam-fo46m5b966</a></li>
        </ul>
      </section>

      {/* More Information Section */}
      <section id="more-info" className="bg-white dark:bg-[#1A1A1A] p-8 sm:p-12 mb-12 rounded-xl text-center shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <a href="https://tea.xyz/assam" target="_blank" className="p-4 bg-green-100 dark:bg-green-900 rounded-lg shadow-md text-lg font-medium text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-all">
            Tea-Assam Testnet Info
          </a>
          <a href="https://faucet-assam.tea.xyz/" target="_blank" className="p-4 bg-green-100 dark:bg-green-900 rounded-lg shadow-md text-lg font-medium text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-all">
            Get TEA Token from Faucet
          </a>
          <a href="https://assam.tea.xyz/" target="_blank" className="p-4 bg-green-100 dark:bg-green-900 rounded-lg shadow-md text-lg font-medium text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-all">
            Blockchain Explorer
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E1E1E] text-white py-6 text-center">
        <p>&copy; 2025 Matcha TEA. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
