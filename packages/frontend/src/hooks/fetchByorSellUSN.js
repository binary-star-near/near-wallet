import * as nearApiJs from "near-api-js";
import { useState } from "react";
import { IS_MAINNET } from "../config";
import { wallet } from "../utils/wallet";

export const useFetchByorSellUSN = () => {
    const [isLoading, setIsLoading] = useState(false);
    const contractName = !IS_MAINNET ? "usdn.testnet" : "usn";
    const usnMethods = {
        viewMethods: ["version", "name", "symbol", "decimals", "ft_balance_of"],
        changeMethods: ["buy", "sell"],
    };

    const fetchByOrSell = async (
        accountId,
        multiplier,
        slippage,
        amount,
        symbol
    ) => {
        const account = await wallet.getAccount(accountId);
        const usnContract = new nearApiJs.Contract(
            account,
            contractName,
            usnMethods
        );
       
        if (symbol === "NEAR") {
            await usnContract.buy({
                args: {
                    expected: {
                        multiplier,
                        slippage: `${Math.round(
                            (multiplier / 100) * slippage
                        )}`,
                        decimals: 28,
                    },
                },
                amount: `${amount + new Array(24).fill(0).join("")}`,
                gas: 50000000000000,
            });
           
        } else {
           await usnContract.sell({
                args: {
                    amount: `${amount + new Array(18).fill(0).join("")}`,
                    expected: {
                        multiplier,
                        slippage: `${Math.round(
                            (multiplier / 100) * slippage
                        )}`,
                        decimals: 28,
                    },
                },
                amount: 1,
                gas: 100000000000000,
            });
        }
    };

    return { fetchByOrSell, isLoading, setIsLoading};
};
