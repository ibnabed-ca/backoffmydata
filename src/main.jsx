import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function Shield({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></svg>;
}

function App() {
  const [checkout, setCheckout] = useState(false);
  const closeButton = useRef(null);
  const checkoutButton = useRef(null);

  useEffect(() => {
    if (!checkout) return;
    closeButton.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setCheckout(false);
      if (event.key === 'Tab') {
        const buttons = event.currentTarget.querySelectorAll('[data-checkout-dialog] button');
        if (buttons.length && (document.activeElement === buttons[0] && event.shiftKey || document.activeElement === buttons[buttons.length - 1] && !event.shiftKey)) {
          event.preventDefault();
          (event.shiftKey ? buttons[buttons.length - 1] : buttons[0]).focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); checkoutButton.current?.focus(); };
  }, [checkout]);

  return <div className="page">
    <div className="notice">Prototype preview · No payment or service is live</div>
    <header className="header wrap">
      <a className="brand" href="#top" aria-label="Back Off My Data home"><span className="brand-mark"><Shield size={22}/></span><span>back off<br/><strong>my data.</strong></span></a>
      <span className="header-note">A little more privacy. A lot more you.</span>
    </header>
    <main id="top" className="wrap main">
      <div className="intro">
        <div className="eyebrow"><span>✳</span> YOUR DATA. YOUR CALL.</div>
        <h1>Tell your data<br/><em>to back off.</em></h1>
        <p className="lead">A proposed service to help request the removal of your personal information—and keep following up.</p>
        <div className="benefits" aria-label="Proposed plan highlights">
          <div><span className="benefit-icon">✓</span><span>Deletion request support</span></div>
          <div><span className="benefit-icon">✓</span><span>Daily follow-up activity, where appropriate</span></div>
          <div><span className="benefit-icon">✓</span><span>Guidance for freezing credit at all 3 bureaus</span></div>
        </div>
      </div>
      <aside className="plan" aria-label="Proposed one-year plan">
        <div className="plan-top"><span>THE PRIVACY PLAN</span><span className="plan-symbol"><Shield size={22}/></span></div>
        <h2>One year of<br/>showing up.</h2>
        <div className="price"><strong>$79<span>.99</span></strong><span>for one year<br/><small>Proposed price</small></span></div>
        <button ref={checkoutButton} className="checkout-button" onClick={() => setCheckout(true)}>Preview checkout</button>
        <p className="checkout-note">Prototype only. Checkout is not live.</p>
        <div className="plan-line"></div>
        <p className="plan-caption">Less data drama.<br/><strong>More peace of mind.</strong></p>
      </aside>
    </main>
    <footer className="wrap footer">
      <details><summary>Important details <span>+</span></summary><p>This is a concept, not a live service. Request availability, frequency, and results depend on company policies, verification, applicable law, and technical access. Deletion is not guaranteed. Credit freezes are free directly from each bureau; this prototype does not place them.</p><a href="https://www.consumerfinance.gov/ask-cfpb/what-do-i-do-if-i-am-a-victim-of-identity-theft-en-31/" target="_blank" rel="noreferrer">Learn about free credit freezes</a></details>
      <span>BACK OFF MY DATA · CONCEPT</span>
    </footer>
    {checkout && <div className="backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckout(false); }}>
      <div className="dialog" data-checkout-dialog role="dialog" aria-modal="true" aria-labelledby="checkout-title" aria-describedby="checkout-description">
        <button ref={closeButton} className="close" onClick={() => setCheckout(false)} aria-label="Close checkout preview">×</button>
        <div className="eyebrow">CHECKOUT PREVIEW</div>
        <h2 id="checkout-title">Privacy plan</h2>
        <div className="order"><span>One year of proposed service</span><strong>$79.99</strong></div>
        <p id="checkout-description">This is a prototype. Checkout is coming later; no payment or personal information is collected.</p>
        <button className="checkout-button" onClick={() => setCheckout(false)}>Back to the page</button>
      </div>
    </div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
