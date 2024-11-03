import { Box } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

import {
  DinnerLogo,
  RamenLogo,
  SaladLogo,
  ChristmasDinnerLogo,
  BiryaniLogo,
  DietLogo,
  IntroPlateLogo,
  TacoLogo,
  RoastedChickenLogo,
  ItalianFoodLogo
} from '@src/assets';

export const IntroContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 5vh 5vw;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const TextContainer = styled(Box)`
  flex: 1;
  max-width: 500px;
  height: 250px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const ImageContainer = styled(Box)`
  flex: 1;
  max-width: 500px;
  height: 250px;
  margin-left: 20px;
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-left: 0;
    margin-top: 20px;
  }
`;

const baseSvgStyle = `
  width: 1px;
  height: 1px;
`;

export const StyledItalianFood = styled(ItalianFoodLogo)`
${baseSvgStyle}
`;

export const StyledBiryani = styled(BiryaniLogo)`
  ${baseSvgStyle}
`;

export const StyledDiet = styled(DietLogo)`
  ${baseSvgStyle}
`;

export const StyledDinner = styled(DinnerLogo)`
  ${baseSvgStyle}
`;

export const StyledRamen = styled(RamenLogo)`
  ${baseSvgStyle}
`;

export const StyledSalad = styled(SaladLogo)`
  ${baseSvgStyle}
`;

export const StyledChicken = styled(RoastedChickenLogo)`
  ${baseSvgStyle}
`;

export const StyledTaco = styled(TacoLogo)`
  ${baseSvgStyle}
`;

export const StyledTurkey = styled(ChristmasDinnerLogo)`
  ${baseSvgStyle}
`;

export const StyledIntroPlate = styled(IntroPlateLogo)`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 175px;
  height: 200px;
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 1));
`;

const moveAcross = keyframes`
  0%, 10%, 100% {
    left: -100px;
    top: 35%;
    transform: scale(1) translateY(-50%);
    opacity: 0;
  }
  40% {
    left: calc(50% - 52px);
    top: 35%;
    transform: scale(1) translateY(-50%);
    opacity: 1;
  }
  50% {
    left: calc(50% - 52px);
    top: 40%;
    transform: scale(1.4) translateY(-50%);
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 1));
    opacity: 1;
  }
  60% {
    left: calc(50% - 52px);
    top: 35%;
    transform: scale(1) translateY(-50%);
    opacity: 1;
  }
  70% {
    left: calc(50% - 52px);
    top: 35%;
    transform: scale(1) translateY(-50%);
    opacity: 1;
  }
  90%, 95% {
    left: 100%;
    top: 35%;
    transform: scale(1) translateY(-50%);
    opacity: 0;
  }
`;

export const AnimatedIcon = styled(Box)`
  position: absolute;
  width: 100px;
  height: 100px;
  animation: ${moveAcross} 6s linear;
  animation-fill-mode: forwards;
`;
