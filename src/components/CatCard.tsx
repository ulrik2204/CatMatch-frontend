import { type ReactElement } from "react";

type CatCardProps = {
  catId: string;
};

export default function CatCard(props: CatCardProps): ReactElement {
  return (
    <div className="aspect-square h-96 w-96 rounded border bg-gray-100 p-2">
      <img
        draggable={false}
        src={props.catId}
        alt="Picture"
        className="aspect-auto h-full w-full object-contain"
      />
    </div>
  );
}
