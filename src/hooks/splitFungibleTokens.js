import { useMemo } from "react";

export const useSplitFungibleTokens = (fungibleTokens) => {
    const mainTokens = useMemo(
        () =>
            fungibleTokens.filter(
                (el) =>
                    el.onChainFTMetadata.symbol === "NEAR" ||
                    el.onChainFTMetadata.symbol === "USN"
            ),
        [fungibleTokens]
    );
    const othersTokens = useMemo(
        () =>
            fungibleTokens.filter(
                (el) =>
                    el.onChainFTMetadata.symbol !== "NEAR" &&
                    el.onChainFTMetadata.symbol !== "USN"
            ),
        [fungibleTokens]
    );

    return [mainTokens, othersTokens];
};
