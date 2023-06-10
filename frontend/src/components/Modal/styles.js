import styled from 'styled-components';

export const Header = styled.header`
  height: clamp(20rem, 34vw, 50rem);
  display: flex;
  position: relative;
  align-items: flex-end;
  padding: 1.5vw 3vw;
  border-radius: .5rem .5rem 0 0;
  background: linear-gradient(0deg, #181818 1%, transparent 99%),
    url(${(props) => props.background}) no-repeat;
  background-position: center;
  background-size: cover;

  h3 {
    font-weight: normal;
    margin-bottom: max(1vw, 1rem);
  }
`;

export const Main = styled.main`
  padding: 1.5vw 3vw;

  & .separator {
    line-height: 2;
    margin-top: 1.5vw;
  }
`;

export const Description = styled.div`
  display: flex;
  margin-bottom: 1vw;

  section {
    width: 45vw;
    margin-left: 1.5vw;

    @media (max-width: 700px) {
      display: none;
    }
  }
`;
