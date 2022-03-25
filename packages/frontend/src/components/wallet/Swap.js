import React from 'react';
import { Translate } from 'react-localize-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import SwapIconTwoArrows from '../svg/SwapIconTwoArrows';

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    svg {
        margin-top: 4px;
    }
    .swap {
        display: flex;
        white-space: nowrap;
        margin-left: 10px;
        font-size: 14px;
        font-weight: 600;
        color:${({currentToken}) => (currentToken ? '#24272a' : '#b7b7b7')};
    }
`;

const Swap = ({ currentToken, onClick, linkTo , history}) => {
    return (
        <>
        <StyledContainer 
            currentToken={currentToken} 
            onClick={(e) => {
                onClick && onClick(e);
                linkTo && history.push(linkTo);
                
            }}>
                <SwapIconTwoArrows color={currentToken ? '#000' : '#b7b7b7'}/>
                <div className='swap'>
                    {/* <div>Swap</div> */}
                    <div><Translate id='tokenBox.swapTo'/> {!currentToken ? `NEAR` : 'USN'}</div>
                </div>
        </StyledContainer>
        </>
    );
};

export default withRouter(Swap);
