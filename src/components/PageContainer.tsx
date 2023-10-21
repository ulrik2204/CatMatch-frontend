import { type ReactElement, type ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

export default function PageContainer(props: PageContainerProps): ReactElement {
  return (
    <div className="align-center min-w-screen flex min-h-screen flex-col items-center">
      <main>{props.children}</main>
    </div>
  );
}
