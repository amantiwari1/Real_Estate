import { createEmotionCache, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { type AppType } from "next/dist/shared/lib/utils";

import "~/styles/globals.css";

const myCache = createEmotionCache({
  key: "mantine",
  prepend: false,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider
      emotionCache={myCache}
      withGlobalStyles
      theme={{
        colorScheme: "dark",
        primaryColor: "green",
        defaultGradient: {
          from: "blue",
          to: "green",
          deg: 10,
        },
      }}
    >
      <NotificationsProvider position="top-right">
        <Component {...pageProps} />
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default MyApp;
