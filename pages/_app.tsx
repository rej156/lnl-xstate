import React from "react";
import { inspect } from "@xstate/inspect";
import { useEffect } from "react";
import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (!window) {
      return;
    }
    inspect({
      // url: "https://statecharts.io/inspect",
      iframe: false,
    });
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
