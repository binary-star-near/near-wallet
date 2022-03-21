import React from "react";
import { Translate } from "react-localize-redux";
import styled from "styled-components";
import { formatTokenAmount } from "../../utils/amounts";
import { formatNearAmount } from "../common/balance/helpers";

const StyledAvailableContainer = styled.div`
    text-align: right;
    width: 100%;
    margin-top: 5px;
    color: #252729;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 10px;

    span {
        color: green;
    }
`;

function AvailableToSwap({ balance, symbol, decimals }) {
    const amountoShow = balance && formatNearAmount(balance);
    return (
        <StyledAvailableContainer>
            <Translate id="swap.AvailableToSwap" />{" "}
            <span>
                {balance ? (
                    <>
                        {" "}
                        {symbol === "NEAR"
                            ? amountoShow
                            : formatTokenAmount(balance, decimals)}
                    </>
                ) : (
                    <span className="dots" />
                )}{" "}
                <>{symbol}</>
            </span>
        </StyledAvailableContainer>
    );
}

export default AvailableToSwap;
