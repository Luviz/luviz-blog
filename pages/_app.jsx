import "../styles/globals.css";
import "react";
import ErrorBoundary from "./error-boundary";

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp;
