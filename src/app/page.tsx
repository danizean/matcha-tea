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
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import {
  getActiveClaimCondition as getActiveClaimCondition721,
  isERC721,
} from "thirdweb/extensions/erc721";
import { useReadContract } from "thirdweb/react";

export default function Home() {
  const tokenId = defaultTokenId;
  const chain = defineChain(defaultChainId);

  const contract = getContract({
    address: defaultNftContractAddress,
    chain,
    client,
  });

  const isERC721Query = useReadContract(isERC721, { contract });
  const isERC1155Query = useReadContract(isERC1155, { contract });

  const contractMetadataQuery = useReadContract(getContractMetadata, {
    contract,
  });

  const nftQuery = useReadContract(getNFT, {
    contract,
    tokenId,
    queryOptions: { enabled: isERC1155Query.data },
  });

  const claimCondition1155 = useReadContract(getActiveClaimCondition1155, {
    contract,
    tokenId,
    queryOptions: { enabled: isERC1155Query.data },
  });

  const claimCondition721 = useReadContract(getActiveClaimCondition721, {
    contract,
    queryOptions: { enabled: isERC721Query.data },
  });

  const priceInWei = isERC1155Query.data
    ? claimCondition1155.data?.pricePerToken
    : claimCondition721.data?.pricePerToken;

  const currency = isERC1155Query.data
    ? claimCondition1155.data?.currency
    : claimCondition721.data?.currency;

  const currencySymbol = "TEA"; // Patenkan menjadi TEA

  const pricePerToken =
    priceInWei !== null && priceInWei !== undefined
      ? Number(toTokens(priceInWei, 18))
      : null;

  return (
    <NftMint
      contract={contract}
      displayName={contractMetadataQuery.data?.name || ""}
      contractImage={contractMetadataQuery.data?.image || ""}
      description={contractMetadataQuery.data?.description || ""}
      currencySymbol={currencySymbol}
      pricePerToken={pricePerToken}
      isERC1155={!!isERC1155Query.data}
      isERC721={!!isERC721Query.data}
      tokenId={tokenId}
    />
  );
}
