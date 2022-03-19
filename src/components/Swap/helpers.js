export const currentToken = (tokens, value) => {
    return tokens.find((el) => el.onChainFTMetadata.symbol === value);
};

export const swapTokens = (tokens, from, setFrom, setTo, to) => {
    if (to?.balance === "0" || !to?.balance) return;

    if (from?.onChainFTMetadata?.symbol === "NEAR") {
        setFrom(currentToken(tokens, "USN"));
        setTo(tokens[0]);
    } else {
        setFrom(tokens[0]);
        setTo(currentToken(tokens, "USN"));
    }
};

export const exchengeRateTranslation = (token, balance, exchangeRate) => {
    return token?.onChainFTMetadata?.symbol === "NEAR"
        ? balance / exchangeRate
        : balance * exchangeRate;
};

export const tradingFree = (token, balance, exchangeRate) => {
    return token === "NEAR"
        ? (balance / exchangeRate) * 0.002
        : balance * exchangeRate * 0.002;
};

export const MinimumReceived = (token, balance, exchangeRate) => {
    return token === "NEAR" ? balance / exchangeRate : balance * exchangeRate;
};
