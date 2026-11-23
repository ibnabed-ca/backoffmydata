import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  const [checkout, setCheckout] = useState(false);
  const closeRef = useRef(null);
  const openRef = useRef(null);
  useEffect(() => {
    if (!checkout) return;
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') setCheckout(false);
      if (event.key === 'Tab') { event.preventDefault(); closeRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); openRef.current?.focus(); };
  }, [checkout]);

  return <div className="page">
    <header className="header"><a className="brand" href="./" aria-label="Back Off My Data home"><span className="mark" aria-hidden="true">✳</span><span>back off<br/><strong>my data.</strong></span></a><a className="details-link" href="./disclaimers.html">Details</a></header>
    <main className="hero">
      <div className="eyebrow">YOUR DATA. YOUR CALL.</div>
      <h1>Don’t let your rights<br/><em>get buried in paperwork.</em></h1>
      <p>All Californians have the legal right to submit free data privacy and data removal requests to data brokers. BackOffMyData is a helpful service that automatically sends all these requests for you in return for a small fee. Protect yourself from spammers, scammers, and hackers around the world, and sign up for BackOffMyData today!</p>
      <div className="offer"><strong>$79</strong><span> | One Year Warranty</span><button ref={openRef} onClick={() => setCheckout(true)}>Preview checkout</button></div>
      <span className="prototype">Prototype · Not yet available</span>
    </main>
    <footer><a href="./disclaimers.html">Details &amp; disclaimers</a></footer>
    {checkout && <div className="backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setCheckout(false); }}><div className="dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><span className="eyebrow">CHECKOUT PREVIEW</span><h2 id="checkout-title">One-time charge: $79.</h2><p>Checkout and service are not live yet. No payment or personal information is collected.</p><button ref={closeRef} onClick={() => setCheckout(false)}>Back to the page</button></div></div>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
