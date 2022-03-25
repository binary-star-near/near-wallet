import React from "react";
import styled from "styled-components";
import { MinimumReceived, tradingFree } from "./helpers";
import SwapInfoItem from "./SwapInfoItem";

const StyledContainer = styled.div`
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
`;

function SwapInfoContainer({
    exchngeRate,
    amount,
    token,
    setSlippPageValue,
    slippPageValue,
    slipPageError,
}) {
    const isNear = token === "NEAR";
    const expectedPrice = isNear
        ? +amount * exchngeRate
        : +amount / exchngeRate;
    const symbol = !isNear ? "NEAR" : "USN";

    return (
        <StyledContainer>
            <SwapInfoItem
                leftText="swap.slipPage"
                // rightText={exchngeRate}
                slipPageError={slipPageError}
                slippPageValue={slippPageValue}
                setSlippPageValue={setSlippPageValue}
            />
            <SwapInfoItem leftText={"swap.pairPrice"} rightText={`1 ${isNear ? 'NEAR': 'USN'} = ${isNear ? 1 * exchngeRate : 1 / exchngeRate} ${symbol}`} />
            <SwapInfoItem
                leftText={"swap.ExpectedPrice"}
                rightText={`${amount} ${token} = ${expectedPrice} ${symbol}`}
            />
            <SwapInfoItem
                leftText={"swap.TradingFee"}
                rightText={
                    tradingFree(symbol, amount, exchngeRate) + ` ${symbol}`
                }
            />
            <SwapInfoItem
                leftText={"swap.MinimumReceived"}
                rightText={
                    MinimumReceived(symbol, amount, exchngeRate) -
                    tradingFree(symbol, amount, exchngeRate) +
                    ` ${symbol}`
                }
            />
        </StyledContainer>
    );
}

export default SwapInfoContainer;
