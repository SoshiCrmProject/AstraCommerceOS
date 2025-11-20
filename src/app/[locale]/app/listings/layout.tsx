import { ReactNode } from "react";

type ListingsLayoutProps = {
  children: ReactNode;
};

export default function ListingsLayout({ children }: ListingsLayoutProps) {
  return (
    <div className="listings-module">
      {children}
    </div>
  );
}