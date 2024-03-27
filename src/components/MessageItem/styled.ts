import styled from "@emotion/styled";

export const Item = styled.div``;

export const PaddingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 60%;
  padding: 10px;
`;

export const Profile = styled.img`
  min-width: 32px;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 6px;
  width: calc(100% - 38px);
  background-color: yellow;
`;

export const Name = styled.span`
  width: fit-content;
  margin-bottom: 4px;
  background-color: aqua;
`;

export const Content = styled.div`
  width: 100%;
`;

export const Text = styled.div`
  background-color: chartreuse;
`;

export const ImageMessage = styled.img`
  height: 160px;
  width: 100%;
  object-fit: contain;
`;
