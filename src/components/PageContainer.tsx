import { type ReactElement, type ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

export default function PageContainer(props: PageContainerProps): ReactElement {
  return (
    <div className="align-center align-center min-w-screen flex min-h-screen flex-col items-center bg-red-500">
      <div>{props.children}</div>
    </div>
  );
}
