// app/components/NftMint.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Minus, Plus, Leaf, Loader2, Share2, ArrowLeftCircle, Sparkles, ImageIcon,
  Mail, Users, FileText, HelpCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { ThirdwebContract } from "thirdweb";
import {
  ClaimButton, ConnectButton, MediaRenderer, NFT, useActiveAccount,
} from "thirdweb/react";
import { client } from "@/lib/thirdwebClient";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  contract: ThirdwebContract;
  displayName: string;
  description: string;
  contractImage: string;
  pricePerToken: number | null;
  currencySymbol: string | null;
  isERC1155: boolean;
  isERC721: boolean;
  tokenId: bigint;
  soldOutImage?: string;
  artist?: string;
  origin?: string;
}

export function NftMint(props: Props) {
  const [isMinting, setIsMinting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalSupply, setTotalSupply] = useState(1);
  const [totalMinted, setTotalMinted] = useState(0);
  const [email, setEmail] = useState("");
  const account = useActiveAccount();
  const MAX_MINT_PER_ADDRESS = 3;

  useEffect(() => {
    const fetchSupply = async () => {
      try {
        if (props.isERC721) {
          const total = await props.contract.erc721.totalCount();
          setTotalSupply(Number(total));
          setTotalMinted(Number(total));
        } else if (props.isERC1155) {
          const supply = await props.contract.erc1155.totalSupply(props.tokenId);
          setTotalSupply(Number(supply));
          setTotalMinted(Number(supply));
        }
      } catch (err) {
        console.error("Error fetching supply", err);
      }
    };
    fetchSupply();
  }, [props]);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const bg = document.getElementById("parallax-bg");
      if (bg) {
        const offset = window.scrollY * 0.2;
        bg.style.transform = `translateY(${offset}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increaseQuantity = () => setQuantity((prev) => Math.min(MAX_MINT_PER_ADDRESS, prev + 1));
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setQuantity(Math.min(MAX_MINT_PER_ADDRESS, Math.max(1, value)));
    }
  };

  const handleSubscribe = () => {
    if (!email.includes("@")) {
      toast.error("Masukkan email yang valid.");
      return;
    }
    toast.success("Berhasil berlangganan!");
    setEmail("");
  };

  const totalPrice = (props.pricePerToken ?? 0) * quantity;
  const shareOnTwitter = () => {
    const tweet = `✨ I just minted a ${props.displayName} NFT! Join the magic: https://assam.tea.xyz/`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, "_blank");
  };
  const isSoldOut = totalMinted >= totalSupply;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdeff9] via-[#ecf2ff] to-[#e0c3fc] text-gray-800 font-sans flex flex-col relative overflow-x-hidden">
      <div
        id="parallax-bg"
        className="absolute inset-0 bg-[url('/ghibli-forest.svg')] bg-cover bg-center opacity-10 pointer-events-none z-0 transition-transform duration-500"
      />

      <header className="w-full py-6 px-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm z-20 fixed top-0">
        <div className="flex items-center gap-2 text-xl font-bold text-green-700">
          <Leaf className="h-6 w-6" /> Ghibli Mint
        </div>
        <ConnectButton client={client} />
      </header>

      <div className="pt-32 pb-6 px-6 text-center z-10">
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight leading-tight bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
          Collect Your Piece of Magic ✨
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base">
          Step into a dreamy forest of imagination and own a unique token of wonder. Inspired by Ghibli, crafted with care.
        </p>
      </div>

      <main className="flex flex-col lg:flex-row justify-center items-start gap-6 px-4 z-10 max-w-6xl mx-auto">
        {/* Mint Card */}
        <Card className="w-full max-w-xl rounded-3xl shadow-2xl border-0 bg-white/90 backdrop-blur-lg">
          <CardHeader className="text-center px-6 pt-6">
            <CardTitle className="text-3xl font-semibold mb-1 text-purple-700">{props.displayName}</CardTitle>
            <CardDescription className="text-gray-500 text-sm">{props.description}</CardDescription>
          </CardHeader>

          <CardContent className="px-6">
            <div className="aspect-square overflow-hidden rounded-xl mb-4 relative shadow-md bg-white">
              {isSoldOut && props.soldOutImage ? (
                <img src={props.soldOutImage} alt="Sold Out" className="w-full h-full object-cover" />
              ) : props.isERC1155 ? (
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
                  src={props.contractImage || "/placeholder.svg"}
                />
              )}
              <div className="absolute top-2 right-2 bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold shadow">
                {props.pricePerToken} {props.currencySymbol}/each
              </div>
              {isSoldOut && (
                <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
                  SOLD OUT
                </div>
              )}
            </div>

            <div className="mb-4">
              <Progress value={(totalMinted / totalSupply) * 100} />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {totalMinted}/{totalSupply} minted
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center bg-gray-200 rounded-full px-3 py-1">
                <Button variant="ghost" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-14 text-center bg-transparent border-none text-base font-semibold"
                  min="1"
                  max={MAX_MINT_PER_ADDRESS}
                />
                <Button variant="ghost" size="icon" onClick={increaseQuantity} disabled={quantity >= MAX_MINT_PER_ADDRESS}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm font-medium">
                Total: {totalPrice} {props.currencySymbol}
              </div>
            </div>

            {props.artist && <div className="text-xs text-gray-500 mb-1"><strong>Artist:</strong> {props.artist}</div>}
            {props.origin && <div className="text-xs text-gray-500"><strong>Origin:</strong> {props.origin}</div>}
          </CardContent>

          <CardFooter className="flex flex-col px-6 pb-6 space-y-3">
            {account ? (
              <ClaimButton
                theme="light"
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
                style={{
                  backgroundColor: "#8e44ad",
                  color: "white",
                  width: "100%",
                  borderRadius: "9999px",
                  padding: "14px",
                  fontWeight: 600,
                }}
                disabled={isMinting || isSoldOut}
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
                {isMinting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" /> Minting...
                  </span>
                ) : (
                  `Mint ${quantity} NFT${quantity > 1 ? "s" : ""}`
                )}
              </ClaimButton>
            ) : (
              <ConnectButton
                client={client}
                connectButton={{ style: { width: "100%", borderRadius: "9999px" } }}
              />
            )}
            <div className="flex gap-2">
              <Button onClick={shareOnTwitter} className="w-full rounded-full" variant="outline">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
              <Button onClick={() => (window.location.href = "/gallery")} className="w-full rounded-full" variant="ghost">
                <ArrowLeftCircle className="w-4 h-4 mr-2" /> Back
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Sidebar Info */}
        <div className="text-gray-600 text-sm max-w-md flex flex-col gap-4">
          {[
            {
              icon: <Sparkles className="w-5 h-5 text-pink-500" />,
              title: "Story Behind This Drop",
              content: "This NFT captures the serene spirit of forest creatures and magical moments hidden within lush greenery. Let it be your digital escape.",
            },
            {
              icon: <ImageIcon className="w-5 h-5 text-blue-400" />,
              title: "Tips for a Better Experience",
              content: (
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use a desktop browser for smoother minting.</li>
                  <li>Ensure your wallet is connected to the correct network.</li>
                  <li>Refresh after mint to update total supply.</li>
                </ul>
              ),
            },
            {
              icon: <Mail className="w-5 h-5 text-green-500" />,
              title: "Subscribe for Updates",
              content: (
                <div className="flex mt-2 gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button onClick={handleSubscribe}>Subscribe</Button>
                </div>
              ),
            },
            {
              icon: <HelpCircle className="w-5 h-5 text-indigo-500" />,
              title: "FAQ",
              content: (
                <ul className="space-y-2 mt-2">
                  <li><strong>Q:</strong> How do I mint?<br /><strong>A:</strong> Connect wallet & click Mint.</li>
                  <li><strong>Q:</strong> What network?<br /><strong>A:</strong> Use supported chain on wallet.</li>
                  <li><strong>Q:</strong> Max mint?<br /><strong>A:</strong> 3 per address.</li>
                </ul>
              ),
            },
          ].map((section, i) => (
            <div key={i} className="bg-white/70 p-4 rounded-2xl shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2">{section.icon} {section.title}</h2>
              <div className="mt-1">{section.content}</div>
            </div>
          ))}

          <div className="bg-white/70 p-4 rounded-2xl shadow-sm flex flex-col gap-2">
            <Button asChild variant="outline">
              <a href="https://t.me/yourcommunity" target="_blank" rel="noopener noreferrer">
                <Users className="w-4 h-4 mr-2" /> Join Our Telegram
              </a>
            </Button>
            <Button asChild variant="ghost">
              <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" /> View Whitepaper
              </a>
            </Button>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 px-4 text-center text-sm text-gray-500 bg-white/70 border-t border-gray-200 backdrop-blur z-10">
        Made with 🍵 by Assam & You — Explore the forest of pixels.
      </footer>
    </div>
  );
}
