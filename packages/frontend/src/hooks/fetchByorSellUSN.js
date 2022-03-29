import * as nearApiJs from "near-api-js";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showCustomAlert } from "../redux/actions/status";
import { wallet } from "../utils/wallet";

const env = process.env.NEAR_WALLET_ENV === "development";

export const useFetchByorSellUSN = () => {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    // const [isSuccess, setSuccess] = useState(false);
    const env = process.env.NEAR_WALLET_ENV === "development";
    const contractName = env ? "usdn.testnet" : "usn";

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
        
        //  catch (error) {
        //     dispatch(showCustomAlert({
        //         errorMessage: error.message,
        //         success: false,
        //         messageCodeHeader: 'error',
        //     }));
        //     if (error) {
        //         setSuccess(false);
        //     } 
           
        // } finally {
        //     setIsLoading(false);
        // }
    };

    return { fetchByOrSell, isLoading, setIsLoading};
};
