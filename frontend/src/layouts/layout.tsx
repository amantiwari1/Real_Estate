import { AppShell } from "@mantine/core";
import React from "react";
import Header from "~/components/Header";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AppShell
      style={{
        // light gray background
        background: "#27272a",
      }}
      padding="md"
      navbar={<Navbar />}
      header={<Header />}
      footer={<Footer />}
    >
      {children}
    </AppShell>
  );
};

export default Layout;
