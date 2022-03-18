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

export const fetchByUSN = async (
    accountId,
    multiplier,
    slippage,
    amount,
    symbol
) => {
    const env = process.env.NEAR_WALLET_ENV === "development";
    const contractName = env ? "usdn.testnet" : "usn";
    const account = await wallet.getAccount(accountId);

    const usnMethods = {
        viewMethods: ["version", "name", "symbol", "decimals", "ft_balance_of"],
        changeMethods: ["buy", "sell"],
    };

    const usnContract = new nearApiJs.Contract(
        account,
        contractName,
        usnMethods
    );

    let data;
    if (symbol === "NEAR") {
        data = await usnContract.buy({
            args: {
                expected: {
                    multiplier,
                    slippage: "10000",
                    decimals: 28,
                },
            },
            amount: "1000000000000000000000000",
            gas: 50000000000000,
        });
    } else {
        data = await usnContract.buy({
            args: {
                expected: {
                    multiplier,
                    slippage: "10000",
                    decimals: 28,
                },
            },
            amount: "1",
            gas: 100000000000000,
            deposit: 1,
        });
    }

    return data;
};
