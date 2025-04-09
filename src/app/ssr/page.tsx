"use client";

import { NftMint } from "@/components/nft-mint";
import {
  defaultChainId,
  defaultNftContractAddress,
  defaultTokenId,
} from "@/lib/constants";
import { client } from "@/lib/thirdwebClient";
import { defineChain, getContract, toTokens } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import {
  getActiveClaimCondition as getActiveClaimCondition1155,
  getNFT,
  isERC1155,
} from "thirdweb/extensions/erc1155";
import {
  getActiveClaimCondition as getActiveClaimCondition721,
  isERC721,
} from "thirdweb/extensions/erc721";
import { useReadContract } from "thirdweb/react";

export default function Home() {
  const chain = defineChain(defaultChainId);
  const tokenId = defaultTokenId;

  const contract = getContract({
    address: defaultNftContractAddress,
    chain,
    client,
  });

  const is721 = useReadContract(isERC721, { contract });
  const is1155 = useReadContract(isERC1155, { contract });
  const metadata = useReadContract(getContractMetadata, { contract });

  const nft = useReadContract(getNFT, {
    contract,
    tokenId,
    queryOptions: { enabled: is1155.data },
  });

  const claim721 = useReadContract(getActiveClaimCondition721, {
    contract,
    queryOptions: { enabled: is721.data },
  });

  const claim1155 = useReadContract(getActiveClaimCondition1155, {
    contract,
    tokenId,
    queryOptions: { enabled: is1155.data },
  });

  const priceInWei = claim1155.data?.pricePerToken || claim721.data?.pricePerToken;
  const pricePerToken =
    priceInWei !== undefined ? Number(toTokens(priceInWei, 18)) : null;

  if (is721.isLoading || is1155.isLoading || metadata.isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#fdeff9] via-[#ecf2ff] to-[#e0c3fc] text-xl text-ghibli-dark font-semibold tracking-wide overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/ghibli-forest.svg')] bg-cover bg-center opacity-10 animate-float z-0" />
        <div className="absolute left-[10%] top-[20%] w-12 h-12 bg-[url('/leaf.svg')] bg-contain bg-no-repeat animate-float animate-[float_6s_ease-in-out_infinite] delay-[200ms]" />
        <div className="absolute right-[15%] bottom-[25%] w-10 h-10 bg-[url('/leaf.svg')] bg-contain bg-no-repeat animate-float animate-[float_6s_ease-in-out_infinite] delay-[500ms]" />
        <div className="absolute left-[40%] bottom-[10%] w-14 h-14 bg-[url('/leaf.svg')] bg-contain bg-no-repeat animate-float animate-[float_6s_ease-in-out_infinite] delay-[700ms]" />
        <div className="absolute top-[10%] left-[45%] w-16 h-16 bg-[url('/totoro-silhouette.svg')] bg-contain bg-no-repeat opacity-20 animate-float animate-[float_6s_ease-in-out_infinite] delay-[1000ms]" />
        <div className="absolute bottom-[5%] right-[5%] w-20 h-20 bg-[url('/lantern.svg')] bg-contain bg-no-repeat animate-float animate-[float_6s_ease-in-out_infinite] delay-[1500ms]" />
        <div className="relative z-10 text-center animate-pulse">🍵 Brewing your Matcha Tea...</div>
      </div>
    );

  return (
    <NftMint
      contract={contract}
      displayName={nft.data?.metadata.name || metadata.data?.name || ""}
      contractImage={metadata.data?.image || ""}
      description={nft.data?.metadata.description || metadata.data?.description || ""}
      currencySymbol="TEA"
      pricePerToken={pricePerToken}
      isERC1155={!!is1155.data}
      isERC721={!!is721.data}
      tokenId={tokenId}
    />
  );
}
