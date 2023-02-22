import { AppShell } from "@mantine/core";
import React from "react";
import Header from "~/components/Header";
import Navbar from "~/components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AppShell padding="md" navbar={<Navbar />} header={<Header />}>
      {children}
    </AppShell>
  );
};

export default Layout;
