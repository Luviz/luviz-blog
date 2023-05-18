import { Html, Head, Main, NextScript } from "next/document";
import ErrorBoundary from "./error-boundary";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="The blog of Bardia Jedi Software developer"
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:image"
          content="https://bardiajedi.com/images/bjIcon.png"
        />
        <meta
          name="twitter:image"
          content="https://preview.bardiajedi.com/images/bjIcon.png"
        />
        <meta name="twitter:site" content="@bardiajedi" />
        <meta name="twitter:creator" content="@bardiajedi" />
        <meta
          name="og:description"
          content="The blog of Bardia Jedi Software developer"
        />
        <meta
          name="image"
          property="og:image"
          content="https://bardiajedi.com/images/bjIcon.png"
        />
        <meta
          name="image"
          property="og:image"
          content="https://preview.bardiajedi.com/images/bjIcon.png"
        />
      </Head>
      <body>
        <ErrorBoundary>
          <Main />
        </ErrorBoundary>
        <NextScript />
      </body>
    </Html>
  );
}
