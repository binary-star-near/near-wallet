import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BN from 'bn.js';
import set from 'lodash.set';
import { createSelector } from 'reselect';
<<<<<<< HEAD
import { CREATE_USN_CONTRACT } from '../../../../../../features'
=======

import { CREATE_USN_CONTRACT } from '../../../../../../features';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
import { WHITELISTED_CONTRACTS, IS_MAINNET} from '../../../config';
import FungibleTokens from '../../../services/FungibleTokens';
import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';
import createParameterSelector from '../createParameterSelector';
import { selectUSDNTokenFiatValueUSD } from '../tokenFiatValues';

<<<<<<< HEAD
const currentContractName = !IS_MAINNET ? 'usdn.testnet': 'usn'
=======
const currentContractName = !IS_MAINNET ? 'usdn.testnet': 'usn';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

const SLICE_NAME = 'tokens';

const initialState = {
    ownedTokens: {
        byAccountId: {},
    },
    metadata: {
        byContractName: {},
    },
};

const initialOwnedTokenState = {
    ...initialStatusState,
    balance: '',
};

async function getCachedContractMetadataOrFetch(contractName, state) {
    let contractMetadata = selectOneContractMetadata(state, { contractName });
    if (contractMetadata) {
        return contractMetadata;
    }
    return FungibleTokens.getMetadata({ contractName });
}

const fetchOwnedTokensForContract = createAsyncThunk(
    `${SLICE_NAME}/fetchOwnedTokensForContract`,
    async ({ accountId, contractName }, thunkAPI) => {
        const {
            actions: { addTokensMetadata },
        } = tokensSlice;
        const { dispatch } = thunkAPI;

        const balance = await FungibleTokens.getBalanceOf({
            contractName,
            accountId,
        });

        dispatch(addTokensMetadata({ accountId, contractName, balance }));
    },
    {
        condition: ({ accountId, contractName }, thunkAPI) => {
            const { getState } = thunkAPI;
            if (
                selectOneTokenLoading(getState(), { accountId, contractName })
            ) {
                return false;
            }
        },
    }
);

const fetchTokens = createAsyncThunk(
    `${SLICE_NAME}/fetchTokens`,
    async ({ accountId }, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;

        const likelyContracts = [
            ...new Set([
                ...(await FungibleTokens.getLikelyTokenContracts({
                    accountId,
                })),
                ...WHITELISTED_CONTRACTS,
            ]),
        ];

        if (!likelyContracts.includes(currentContractName) && CREATE_USN_CONTRACT) {
            likelyContracts.push(currentContractName);
        }

        await Promise.all(
            likelyContracts.map(async (contractName) => {
                const {
                    actions: { setContractMetadata },
                } = tokensSlice;
                try {
                    const contractMetadata =
                        await getCachedContractMetadataOrFetch(
                            contractName,
                            getState()
                        );
                    if (
                        !selectOneContractMetadata(getState(), {
                            contractName,
                        })
                    ) {
                        dispatch(
                            setContractMetadata({
                                contractName,
                                metadata: contractMetadata,
                            })
                        );
                    }
                    await dispatch(
                        fetchOwnedTokensForContract({
                            accountId,
                            contractName,
                        })
                    );
                } catch (e) {
                    // Continue loading other likely contracts on failures
                    console.warn(`Failed to load FT for ${contractName}`, e);
                }
            })
        );
    }
);

const fetchToken = createAsyncThunk(
    `${SLICE_NAME}/fetchToken`,
    async ({ contractName, accountId }, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;
        const {
            actions: { setContractMetadata },
        } = tokensSlice;
        try {
            const contractMetadata = await getCachedContractMetadataOrFetch(
                contractName,
                getState()
            );
            if (!selectOneContractMetadata(getState(), { contractName })) {
                dispatch(
                    setContractMetadata({
                        contractName,
                        metadata: contractMetadata,
                    })
                );
            }
            if (accountId) {
                await dispatch(
                    fetchOwnedTokensForContract({ accountId, contractName })
                );
            }
        } catch (e) {
            // Continue loading other likely contracts on failures
            console.warn(`Failed to load FT for ${contractName}`, e);
        }
    }
);

const tokensSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setContractMetadata(state, { payload }) {
            const { metadata, contractName } = payload;
            set(state, ['metadata', 'byContractName', contractName], metadata);
        },
        addTokensMetadata(state, { payload }) {
            const { contractName, balance, accountId } = payload;
            set(
                state,
                [
                    'ownedTokens',
                    'byAccountId',
                    accountId,
                    contractName,
                    'balance',
                ],
                balance
            );
        },
    },
    extraReducers: (builder) => {
        handleAsyncThunkStatus({
            asyncThunk: fetchOwnedTokensForContract,
            buildStatusPath: ({
                meta: {
                    arg: { accountId, contractName },
                },
            }) => ['ownedTokens', 'byAccountId', accountId, contractName],
            builder,
        });
    },
});

export default tokensSlice;

export const actions = {
    fetchToken,
    fetchTokens,
    ...tokensSlice.actions,
};
export const reducer = tokensSlice.reducer;

const getAccountIdParam = createParameterSelector((params) => params.accountId);

// Top level selectors
const selectTokensSlice = (state) => state[tokensSlice.name];
const selectMetadataSlice = createSelector(
    selectTokensSlice,
    ({ metadata }) => metadata || {}
);
const selectOwnedTokensSlice = createSelector(
    selectTokensSlice,
    ({ ownedTokens }) => ownedTokens
);

// Contract metadata selectors
// Returns contract metadata for every contract in the store, in an object keyed by contractName
export const selectAllContractMetadata = createSelector(
    selectMetadataSlice,
    (metadata) => metadata.byContractName || {}
);

const getContractNameParam = createParameterSelector(
    (params) => params.contractName
);

export const selectOneContractMetadata = createSelector(
    [selectAllContractMetadata, getContractNameParam],
    (metadataByContractName, contractName) =>
        metadataByContractName[contractName]
);

const selectOwnedTokensForAccount = createSelector(
    [selectOwnedTokensSlice, getAccountIdParam],
    (ownedTokens, accountId) => ownedTokens.byAccountId[accountId] || {}
);

export const selectOneTokenFromOwnedTokens = createSelector(
    [selectOwnedTokensForAccount, getContractNameParam],
    (ownedTokensForAccount, contractName) =>
        ownedTokensForAccount[contractName] || initialOwnedTokenState
);

export const selectTokensWithMetadataForAccountId = createSelector(
    [
        selectAllContractMetadata,
        selectOwnedTokensForAccount,
        selectUSDNTokenFiatValueUSD,
    ],
    (allContractMetadata, ownedTokensForAccount, usd) =>
        Object.entries(ownedTokensForAccount)
            .filter(([contractName, { balance }]) => {
                // We need to see our contract even with zero balance
<<<<<<< HEAD
                if(contractName === currentContractName) {
                     return true;
                }
                return !new BN(balance).isZero()
=======
                if (contractName === currentContractName) {
                     return true;
                }
                return !new BN(balance).isZero();
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
            })
            .sort(([a], [b]) =>
                allContractMetadata[a].name.localeCompare(
                    allContractMetadata[b].name
                )
            )
            .map(([contractName, { balance }]) => ({
                ...initialOwnedTokenState,
                contractName,
                balance,
                onChainFTMetadata: allContractMetadata[contractName] || {},
<<<<<<< HEAD
                coingeckoMetadata:
=======
                fiatValueMetadata:
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
                    contractName === currentContractName ? { usd } : {},
            }))
);

export const selectTokensLoading = createSelector(
    [selectOwnedTokensSlice, getAccountIdParam],
    (ownedTokens, accountId) =>
        Object.entries(ownedTokens.byAccountId[accountId] || {}).some(
            ([
                _,
                {
                    status: { loading },
                },
            ]) => loading
        )
);

const selectOneTokenLoading = createSelector(
    [selectOneTokenFromOwnedTokens],
    (token) => token.status.loading
);
