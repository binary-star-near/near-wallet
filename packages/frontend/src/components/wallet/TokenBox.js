import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { EXPLORER_URL } from '../../config';
import Balance from '../common/balance/Balance';
import TokenIcon from '../send/components/TokenIcon';
import Swap from './Swap';
import TokenAmount from './TokenAmount';
import { formatTokenAmount, removeTrailingZeros } from '../../utils/amounts';

const FRAC_DIGITS = 5;

const amountWithCommas = (amount) => {
    var parts = amount.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

const formatToken = (amount, decimals) => {
    if (amount === '0') {
        return amount;
    }

    let formattedAmount = formatTokenAmount(amount, decimals, FRAC_DIGITS);

    if (formattedAmount === `0.${'0'.repeat(FRAC_DIGITS)}`) {
        return `< ${
            !FRAC_DIGITS ? '0' : `0.${'0'.repeat((FRAC_DIGITS || 1) - 1)}1`
        }`;
    }
    return amountWithCommas(removeTrailingZeros(formattedAmount));
};

const StyledContainer = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 15px 14px;

    @media (max-width: 767px) {
        margin: 0 -14px;
    }

    @media (min-width: 992px) {
        padding: 15px 20px;
    }

    .icon {
        width: 32px;
        height: 32px;
        min-width: 32px;
        min-height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: 50%;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        align-self: center;

        img,
        svg {
            height: 32px;
            width: 32px;
        }
    }

    .desc {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 14px;
        display: block;
        min-width: 0;

        .symbol {
            font-weight: 700;
            font-size: 16px;
            color: #24272a;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            margin-right: 10px;

            a {
                color: inherit;
            }
        }

        .fiat-rate {
            color: #72727a;
            margin-top: 6px;
            white-space: nowrap;
            display: block;
            width: fit-content;

            > span {
                background-color: #f0f0f1;
                padding: 2px 10px;
                border-radius: 40px;
                font-size: 12px;
                display: block;
            }
        }
    }

    .balanceMargin {
        margin-left: auto;
        font-size: 16px;
        font-weight: 600;
        color: #24272a;
        text-align: right;
        white-space: nowrap;

        .fiat-amount {
            font-size: 14px;
            font-weight: 400;
            margin-top: 6px;
            color: #72727a;
            line-height: normal;
        }
    }

    .balance {
        /* margin-left: auto; */
        font-size: 16px;
        font-weight: 600;
        color: #24272a;
        text-align: right;
        white-space: nowrap;

        .fiat-amount {
            font-size: 14px;
            font-weight: 400;
            margin-top: 6px;
            color: #72727a;
            line-height: normal;
        }

        .dots {
            :after {
                position: absolute;
                content: '.';
                font-weight: 300;
                animation: link 1s steps(5, end) infinite;

                @keyframes link {
                    0%,
                    20% {
                        color: rgba(0, 0, 0, 0);
                        text-shadow: 0.3em 0 0 rgba(0, 0, 0, 0),
                            0.6em 0 0 rgba(0, 0, 0, 0);
                    }
                    40% {
                        color: #24272a;
                        text-shadow: 0.3em 0 0 rgba(0, 0, 0, 0),
                            0.6em 0 0 rgba(0, 0, 0, 0);
                    }
                    60% {
                        text-shadow: 0.3em 0 0 #24272a,
                            0.6em 0 0 rgba(0, 0, 0, 0);
                    }
                    80%,
                    100% {
                        text-shadow: 0.3em 0 0 #24272a, 0.6em 0 0 #24272a;
                    }
                }
            }
        }
    }
`;

const TokenBox = ({ token, onClick }) => {
    const withSymbol =
        token.onChainFTMetadata?.symbol !== 'NEAR' ||
        token.onChainFTMetadata?.symbol !== 'USN';

    const currentClassName =
        token.onChainFTMetadata?.symbol === 'NEAR' ||
        token.onChainFTMetadata?.symbol === 'USN';
    return (
        <StyledContainer
            className='token-box'
            onClick={onClick ? () => onClick(token) : null}
            data-test-id={`token-selection-${token.contractName || 'NEAR'}`}
        >
            <div style={{ display: 'flex', width: '100%' }}>
                <div className='icon'>
                    <TokenIcon
                        symbol={token.onChainFTMetadata?.symbol}
                        icon={token.onChainFTMetadata?.icon}
                    />
                </div>
                <div className='desc'>
                    {token.contractName ? (
                        <span className='symbol' title={token.contractName}>
                            <a
                                href={`${EXPLORER_URL}/accounts/${token.contractName}`}
                                onClick={(e) => e.stopPropagation()}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                {token.onChainFTMetadata?.name ||
                                    token.onChainFTMetadata?.symbol}
                            </a>
                        </span>
                    ) : (
                        <span className='symbol'>
                            {token.onChainFTMetadata?.symbol}
                        </span>
                    )}
                    <span className='fiat-rate'>
                        {token.coingeckoMetadata?.usd ? (
                            <>
                                $
                                {new Intl.NumberFormat('ru-RU', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(token.coingeckoMetadata?.usd)}
                            </>
                        ) : (
                            <span>
                                <Translate id='tokenBox.priceUnavailable' />
                            </span>
                        )}
                    </span>
                </div>
                {token.onChainFTMetadata?.symbol === 'NEAR' &&
                !token.contractName ? (
                    <div className='balance'>
                        <Balance
                            amount={token.balance}
                            data-test-id='walletHomeNearBalance'
                            symbol={false}
                        />
                    </div>
                ) : (
                    <TokenAmount
                        token={token}
                        className={
                            currentClassName ? 'balance' : 'balanceMargin'
                        }
                        withSymbol={withSymbol}
                    />
                )}
            </div>
            {!onClick &&
                (token.onChainFTMetadata?.symbol === 'NEAR' ||
                    token.onChainFTMetadata?.symbol === 'USN') && (
                    <Swap
                        currentToken={
                            token.onChainFTMetadata?.symbol === 'NEAR'
                        }
                    />
                )}
        </StyledContainer>
    );
};

export default TokenBox;
