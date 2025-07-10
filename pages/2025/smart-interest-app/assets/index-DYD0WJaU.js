(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const d of t.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}})();const a={accountTotal:25847.32,interestAccumulated:1247.85,interestPending:87.43,earnedThisMonth:298.67,earnedThisYear:1247.85,lastUpdated:new Date().toLocaleString()};function c(n){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(n)}function o(n,i,s="",r=""){return`
    <div class="card ${r}">
      <div class="card-header">
        <h3 class="card-title">${n}</h3>
        ${s?`<span class="card-subtitle">${s}</span>`:""}
      </div>
      <div class="card-content">
        ${i}
      </div>
    </div>
  `}function l(){const n=document.querySelector("#app");n.innerHTML=`
    <div class="container">
      <header class="header">
        <div class="user-greeting">
          <h1>Welcome back, John</h1>
          <p class="last-updated">Last updated: ${a.lastUpdated}</p>
        </div>
        <div class="notification-icon">
          <span class="notification-dot"></span>
          🔔
        </div>
      </header>

      <main class="main-content">
        <div class="balance-section">
          ${o("Account Total",`<div class="balance-amount">${c(a.accountTotal)}</div>`,"Your current balance","primary-card")}
        </div>

        <div class="metrics-grid">
          ${o("Optimize Annual Rate",'<div class="rate-display">estimates 2% - 4%</div>',"Projected returns","rate-card")}
          
          ${o("Earned",`<div class="earned-amount">${c(a.earnedThisMonth)}</div>`,"This month","earned-card")}
        </div>

        <div class="interest-section">
          <h2 class="section-title">Interest Overview</h2>
          
          <div class="interest-grid">
            ${o("Accumulated",`<div class="interest-amount accumulated">${c(a.interestAccumulated)}</div>
               <div class="interest-growth">+${c(a.earnedThisYear)} this year</div>`,"Total earned to date")}
            
            ${o("Pending this week",`<div class="interest-amount pending">${c(a.interestPending)}</div>
               <div class="interest-note">Next payout in 3 days</div>`,"Weekly accrual")}
          </div>
        </div>

        <div class="quick-actions">
          <button class="action-btn primary">View Details</button>
          <button class="action-btn secondary">Add Funds</button>
        </div>
      </main>
    </div>
  `,document.querySelectorAll(".action-btn").forEach(s=>{s.addEventListener("click",r=>{r.target.style.transform="scale(0.95)",setTimeout(()=>{r.target.style.transform="scale(1)"},150)})});const i=document.querySelector(".notification-dot");i&&setInterval(()=>{i.style.animation="none",setTimeout(()=>{i.style.animation="pulse 2s infinite"},10)},5e3)}l();setInterval(()=>{a.interestPending+=.01,a.lastUpdated=new Date().toLocaleString();const n=document.querySelector(".interest-amount.pending");n&&(n.textContent=c(a.interestPending))},3e4);
