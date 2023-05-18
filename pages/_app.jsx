import "../styles/globals.css";
import "react";
import ErrorBoundary from "./error-boundary";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
