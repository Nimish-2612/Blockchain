import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  <Toaster position="top-right" reverseOrder={false} />;
  return <Component {...pageProps} />;
}

export default MyApp;
