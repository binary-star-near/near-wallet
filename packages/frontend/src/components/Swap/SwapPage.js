import * as nearApiJs from "near-api-js";

import React, { useEffect, useState } from "react";
import { Translate } from "react-localize-redux";
import styled from "styled-components";
import { useFungibleTokensIncludingNEAR } from "../../hooks/fungibleTokensIncludingNEAR";
import Container from "../common/styled/Container.css";
import { currentToken, fetchByUSN, swapTokens } from "./helpers";
import SwapTokenContainer from "./SwapTokenContainer";
import { actions as tokensActions } from "../../redux/slices/tokens";
import {
    fetchMultiplier,
    selectMetadataSlice,
} from "../../redux/slices/multiplier";
import { useDispatch, useSelector } from "react-redux";
import { selectAccountId } from "../../redux/slices/account";
import AvailableToSwap from "./AvailableToSwap";
import SwapIconTwoArrows from "../svg/SwapIconTwoArrows";
import SwapInfoContainer from "./SwapInfoContainer";
import FormButton from "../common/FormButton";
import { formatNearAmount } from "../common/balance/helpers";
import { formatTokenAmount } from "../../utils/amounts";
import { wallet } from "../../utils/wallet";
import ImageContainer from "./ImageContainer";
import TextInfoSuccess from "./TextInfoSuccess";

const { fetchTokens } = tokensActions;

const StyledContainer = styled(Container)`
    h1 {
        text-align: center;
        margin-bottom: 30px;
    }
    .text {
        margin-bottom: 11px;
    }

    .iconSwap {
        margin: 0 auto;
        width: fit-content;
        margin-bottom: 30px;

        svg {
            transform: rotate(90deg);
            cursor: pointer;
        }
    }

    .buttons-bottom-buttons {
        margin-top: 30px;

        > button {
            display: block;
            width: 100%;
        }

        .link {
            display: block !important;
            margin: 20px auto !important;
        }
    }

    .text_info_success {
        width: fit-content;
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 28px;
        text-align: center;
        color: #252729;
        margin: 0 auto;
    }
`;

const balanceForError = (from) => {
    return from?.onChainFTMetadata?.symbol === "NEAR"
        ? +formatNearAmount(from?.balance)
        : +formatTokenAmount(from?.balance, from?.onChainFTMetadata?.decimals);
};

const SwapPage = () => {
    const fungibleTokensList = useFungibleTokensIncludingNEAR();
    const accountId = useSelector((state) => selectAccountId(state));
    const miltiplier = useSelector(selectMetadataSlice);
    const dispatch = useDispatch();
    const [from, setFrom] = useState(fungibleTokensList[0]);
    const [to, setTo] = useState(currentToken(fungibleTokensList, "USN"));
    const [inputValueFrom, setInputValueFrom] = useState(100);
    const [slippPageValue, setSlippPageValue] = useState(1);
    const [isSuccess, setSuccess] = useState(false);

    const balance = balanceForError(from);
    const error = balance < +inputValueFrom;
    const splpPageError = slippPageValue < 1 || slippPageValue > 50;

    useEffect(() => {
        dispatch(fetchTokens({ accountId }));
        dispatch(fetchMultiplier());
    }, [dispatch]);

    console.log("slippPageValue");

    return (
        <StyledContainer className="small-centered">
            {!isSuccess ? (
                <>
                    <h1>
                        <Translate id="button.swap" />
                    </h1>
                    <SwapTokenContainer
                        text="swap.from"
                        fromTotoken={from}
                        value={inputValueFrom}
                        setInputValueFrom={setInputValueFrom}
                    />
                    <AvailableToSwap
                        balance={from?.balance}
                        symbol={from?.onChainFTMetadata?.symbol}
                        decimals={from?.onChainFTMetadata?.decimals}
                    />
                    <div
                        className="iconSwap"
                        onClick={() =>
                            swapTokens(
                                fungibleTokensList,
                                from,
                                setFrom,
                                setTo,
                                to
                            )
                        }
                    >
                        <SwapIconTwoArrows
                            width={"20"}
                            height="20"
                            color="#3070C6"
                        />
                    </div>
                    <SwapTokenContainer
                        text="swap.to"
                        fromTotoken={to}
                        muliplier={miltiplier}
                        value={inputValueFrom}
                    />
                    <SwapInfoContainer
                        slipPageError={splpPageError}
                        slippPageValue={slippPageValue}
                        setSlippPageValue={setSlippPageValue}
                        token={from?.onChainFTMetadata?.symbol}
                        exchngeRate={+miltiplier / 10000}
                        amount={inputValueFrom}
                    />
                    <div className="buttons-bottom-buttons">
                        <FormButton
                            type="submit"
                            disabled={error || splpPageError}
                            data-test-id="sendMoneyPageSubmitAmountButton"
                            onClick={() =>
                                fetchByUSN(
                                    accountId,
                                    miltiplier,
                                    +slippPageValue,
                                    +inputValueFrom,
                                    from?.onChainFTMetadata?.symbol
                                )
                            }
                        >
                            <Translate id="button.continue" />
                        </FormButton>
                        <FormButton
                            type="button"
                            // onClick={onClickCancel}
                            className="link"
                            color="gray"
                            linkTo="/"
                        >
                            <Translate id="button.cancel" />
                        </FormButton>
                    </div>
                </>
            ) : (
                <>
                    <ImageContainer />
                    <TextInfoSuccess />
                    <div className="buttons-bottom-buttons">
                        <FormButton
                            type="submit"
                            disabled={error}
                            data-test-id="sendMoneyPageSubmitAmountButton"
                        >
                            <Translate id="button.continue" />
                        </FormButton>
                        <FormButton
                            type="button"
                            // onClick={onClickCancel}
                            className="link"
                            color="gray"
                            linkTo="/"
                        >
                            <Translate id="button.cancel" />
                        </FormButton>
                    </div>
                </>
            )}
        </StyledContainer>
    );
};

export default SwapPage;
