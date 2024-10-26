import styled from '@emotion/styled';
import { Button } from '@mui/material';

interface SidebarContainerProps {
  isHovered: boolean;
}

interface SidebarItemProps {
  selected?: boolean;
  isHovered: boolean;
}

export const SidebarContainer = styled.div<SidebarContainerProps>`
  width: ${(props) => (props.isHovered ? '250px' : '70px')};
  height: calc(100vh - 100px);
  background-color: #3C4C3D;
  position: fixed;
  top: 100px;
  left: 0;
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 100;
`;

export const SidebarWrapper = styled.div<SidebarContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isHovered ? 'flex-start' : 'center')};
  height: 100%;
  padding-top: 20px;
`;

export const SidebarItemButton = styled(Button)<SidebarItemProps>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  color: white !important;
  text-transform: none;
  padding: 15px;
  transition: background-color 0.2s;
  background-color: ${(props) => (props.selected ? '#2E3B2F' : 'transparent')};
  border-radius: 1;
  &:hover {
    background-color: #334134;
  }
`;

export const SidebarIcon = styled.div`
  min-width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    font-size: 32px;
  }
`;

interface SidebarTextProps {
  isHovered: boolean;
}

export const SidebarText = styled.span<SidebarTextProps>`
  margin-left: 10px;
  white-space: nowrap;
  opacity: ${(props) => (props.isHovered ? 1 : 0)};
  transition: opacity 0.3s ease;
  font-size: 18px;
`;
