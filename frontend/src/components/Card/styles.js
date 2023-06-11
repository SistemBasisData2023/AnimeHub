import styled from 'styled-components';

export const Container = styled.div`
  width: 45vw;

  & + & {
    margin-left: 0.5rem;
  }
`;

export const Button = styled.button`
  height: 100%;
  cursor: pointer;
  transition: transform ease 200ms;

  &:hover {
    transform: scale(1.1);
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
`;

export const Image = styled.img`
  position: absolute;
  top: 50%; /* Vertically center */
  left: 0;
  transform: translateY(-50%); /* Translate up by half of its height */
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.25rem;
`;
