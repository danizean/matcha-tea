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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F1EA] dark:bg-[#1A1A1A] transition-colors duration-200 px-4">
      {/* Connect Wallet */}
      <div className="absolute top-4 right-4">
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

      {/* NFT Card */}
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="p-6">
          {/* NFT Image */}
          <div className="aspect-square overflow-hidden rounded-lg mb-4 relative">
            {props.isERC1155 ? (
              <NFT contract={props.contract} tokenId={props.tokenId}>
                <React.Suspense fallback={<Skeleton className="w-full h-full object-cover" />}>
                  <NFT.Media className="w-full h-full object-cover" />
                </React.Suspense>
              </NFT>
            ) : (
              <MediaRenderer
                client={client}
                className="w-full h-full object-cover"
                alt="NFT"
                src={props.contractImage || "/placeholder.svg?height=400&width=400"}
              />
            )}
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {props.pricePerToken} {props.currencySymbol}/each
            </div>
          </div>

          {/* NFT Details */}
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{props.displayName}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{props.description}</p>

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
        </CardContent>

        {/* Mint Button */}
        <CardFooter>
          {account ? (
            <ClaimButton
              theme={"dark"}
              contractAddress={props.contract.address}
              chain={props.contract.chain}
              client={props.contract.client}
              claimParams={{
                type: props.isERC1155 ? "ERC1155" : "ERC721",
                tokenId: props.tokenId,
                quantity: BigInt(quantity),
                to: account.address,
                from: account.address,
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
          ) : (
            <ConnectButton
      client={client}
	connectButton={{ style: { width: "100%" } }}
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
          )}
        </CardFooter>
      </Card>

      {/* Explorer & Faucet Buttons */}
      <div className="flex justify-center sm:justify-start sm:flex-row flex-col space-y-2 sm:space-x-4 sm:space-y-0 pb-4 sm:pb-0">
    <Button
      variant="outline"
      onClick={() => window.open("https://assam.tea.xyz/", "_blank")}
      className="w-32 border-gray-400 text-gray-700 dark:text-white"
    >
      Explorer TEA
    </Button>
    <Button
      variant="outline"
      onClick={() => window.open("https://faucet-assam.tea.xyz/", "_blank")}
      className="w-32 border-gray-400 text-gray-700 dark:text-white"
    >
      Faucet TEA
    </Button>
    </div>
    </div>
  );
}
