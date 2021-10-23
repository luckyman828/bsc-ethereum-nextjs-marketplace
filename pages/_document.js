import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
            <link rel="icon" href="/img/favicon.png" type="image/png" />

            <link rel="stylesheet" href="/assets/css/style.css" />
            
        </Head>
        <body>
            <Main />
            <NextScript />
            <Script src="/assets/js/vendor/core.min.js"></Script>

            <Script src="/assets/js/vendor/popper.min.js"></Script>
            <Script src="/assets/js/vendor/bootstrap.min.js"></Script>

            <Script src="/assets/js/vendor/all.min.js"></Script>
            <Script src="/assets/js/vendor/slider.min.js"></Script>
            <Script src="/assets/js/vendor/countdown.min.js"></Script>
            <Script src="/assets/js/vendor/shuffle.min.js"></Script>

            <Script src="/assets/js/main.js"></Script>
        </body>
      </Html>
    )
  }
}

export default MyDocument
