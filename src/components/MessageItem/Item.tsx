import React, { forwardRef, useEffect } from "react";
import * as S from "./styled";
import { observer } from "mobx-react-lite";
import { DataModel } from "../../models/DataModel";

interface ItemProps {
  message: DataModel;
  idx: number;
}

const Item = observer(
  forwardRef<HTMLDivElement, ItemProps>((props, ref) => {
    const { message, idx } = props;
    // console.log(message);

    useEffect(() => {
      console.log("reRendered", idx);
    }, [message.metadata.lastMessage]);

    return (
      <S.Item ref={ref}>
        <S.PaddingWrapper>
          <S.Profile src={message.profile ?? ""} height={32} width={32} />
          <S.Info>
            <S.Name>
              {message.last_name} {message.first_name} {message.id} {idx}{" "}
            </S.Name>
            <S.Content>
              {message.image ? (
                <S.ImageMessage src={message.image ?? ""} />
              ) : (
                <S.Text>{message.text}</S.Text>
              )}
            </S.Content>
          </S.Info>
        </S.PaddingWrapper>
      </S.Item>
    );
  })
);

export default Item;
