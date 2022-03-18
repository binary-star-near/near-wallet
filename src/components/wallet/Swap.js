import React from "react";
import styled from "styled-components";
import SwapIconTwoArrows from "../svg/SwapIconTwoArrows";

const StyledContainer = styled.div`
    display: flex;
    svg {
        margin-top: 4px;
    }
    .swap {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #24272a;
    }
`;

const Swap = ({ currentToken }) => {
    return (
        <>
            <StyledContainer>
                <SwapIconTwoArrows />
                <div className="swap">
                    <div>Swap</div>
                    <div>to {!currentToken ? `NEAR` : "USN"}</div>
                </div>
            </StyledContainer>
        </>
    );
};

export default Swap;
