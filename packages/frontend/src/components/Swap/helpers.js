import * as nearApiJs from 'near-api-js';
import { useEffect, useState } from 'react';
import { wallet } from '../../utils/wallet';
import { IS_MAINNET } from '../../config';


export const currentToken = (tokens, value) => {
    return tokens.find((el) => el.onChainFTMetadata.symbol === value);
};

export const swapTokens = (tokens, from, setFrom, setTo, to) => {
    if (to?.balance === '0' || !to?.balance) return;

    if (from?.onChainFTMetadata?.symbol === 'NEAR') {
        setFrom(currentToken(tokens, 'USN'));
        setTo(tokens[0]);
    } else {
        setFrom(tokens[0]);
        setTo(currentToken(tokens, 'USN'));
    }
};

export const exchengeRateTranslation = (token, balance, exchangeRate) => {
    return token?.onChainFTMetadata?.symbol === 'NEAR'
        ? balance / exchangeRate
        : balance * exchangeRate;
};

export const tradingFree = (token, balance, exchangeRate) => {
    return token === 'NEAR'
        ? (balance / exchangeRate) * 0.002
        : balance * exchangeRate * 0.002;
};

export const MinimumReceived = (token, balance, exchangeRate) => {
    return token === 'NEAR' ? balance / exchangeRate : balance * exchangeRate;
};

const useDebounce = (value,delay) => {
    const [deboucedValue,setDeboucedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDeboucedValue(value)
        },delay)
        return () => {
            clearTimeout(handler)
        }
    },[value])

   return  deboucedValue;
}

const roundeUSNExchange = (amount,exchangeRate) => {
   const cuurrentExchangeRate =  +exchangeRate / 10000

   return Math.ceil(amount * cuurrentExchangeRate)
}

async function fetchCommissiom (accountId,amount,exchangeRate,token) {
    const contractName = !IS_MAINNET ? 'usdn.testnet' : 'usn';
    const currentTooken = token?.onChainFTMetadata?.symbol === 'NEAR'
    const formatUSN = new Array(18).fill(0).join('')
    const cuurrentExchangeRate =  +exchangeRate / 10000
    const usnMethods = {
        viewMethods: ['version', 'name', 'symbol', 'decimals', 'ft_balance_of'],
        changeMethods: ['buy', 'sell','spread'],
    };
    const account = await wallet.getAccount(accountId);
    const usnContract = new nearApiJs.Contract(
        account,
        contractName,
        usnMethods
    );
    const USNamount = `${currentTooken ? roundeUSNExchange(amount,exchangeRate) + formatUSN: amount + formatUSN}`
    const result = await usnContract.spread({ amount:USNamount }) / 1000000

    return currentTooken ? (cuurrentExchangeRate * amount) * result : (amount / cuurrentExchangeRate ) * result 
}

export const commission = (accountId,amount,delay,exchangeRate,token) => {
    const [commissionFree,setCommissionFree] = useState('')
    const [isLoadingCommission,setIsLoadingCommission] = useState(false)
    const debounceValue = useDebounce(amount,delay)

  
    useEffect(() => {
        const getCommission = async () => {
            if(debounceValue) {
                setIsLoadingCommission(true)
                await fetchCommissiom(accountId,debounceValue,exchangeRate,token).then(res => setCommissionFree(res))
                setIsLoadingCommission(false)
            }
        }
        
        getCommission()
       
        return () => setCommissionFree('')
    },[debounceValue,exchangeRate,token])
    
    return {commissionFree, isLoadingCommission}
}