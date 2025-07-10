import './style.css'

// Mock data for the interest app
const userData = {
  accountTotal: 25847.32,
  interestAccumulated: 1247.85,
  interestPending: 87.43,
  annualRate: 4.2,
  earnedThisMonth: 298.67,
  earnedThisYear: 1247.85,
  lastUpdated: new Date().toLocaleString()
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

function formatPercentage(rate) {
  return `${rate.toFixed(2)}%`
}

function createCard(title, content, subtitle = '', className = '') {
  return `
    <div class="card ${className}">
      <div class="card-header">
        <h3 class="card-title">${title}</h3>
        ${subtitle ? `<span class="card-subtitle">${subtitle}</span>` : ''}
      </div>
      <div class="card-content">
        ${content}
      </div>
    </div>
  `
}

function renderApp() {
  const app = document.querySelector('#app')
  
  app.innerHTML = `
    <div class="container">
      <header class="header">
        <div class="user-greeting">
          <h1>Welcome back, John</h1>
          <p class="last-updated">Last updated: ${userData.lastUpdated}</p>
        </div>
        <div class="notification-icon">
          <span class="notification-dot"></span>
          🔔
        </div>
      </header>

      <main class="main-content">
        <div class="balance-section">
          ${createCard(
            'Account Total',
            `<div class="balance-amount">${formatCurrency(userData.accountTotal)}</div>`,
            'Your current balance',
            'primary-card'
          )}
        </div>

        <div class="metrics-grid">
          ${createCard(
            'Optimize Annual Rate',
            `<div class="rate-display">estimates 2% - 4%</div>`,
            'Projected returns',
            'rate-card'
          )}
          
          ${createCard(
            'Earned',
            `<div class="earned-amount">${formatCurrency(userData.earnedThisMonth)}</div>`,
            'This month',
            'earned-card'
          )}
        </div>

        <div class="interest-section">
          <h2 class="section-title">Interest Overview</h2>
          
          <div class="interest-grid">
            ${createCard(
              'Accumulated',
              `<div class="interest-amount accumulated">${formatCurrency(userData.interestAccumulated)}</div>
               <div class="interest-growth">+${formatCurrency(userData.earnedThisYear)} this year</div>`,
              'Total earned to date'
            )}
            
            ${createCard(
              'Pending this week',
              `<div class="interest-amount pending">${formatCurrency(userData.interestPending)}</div>
               <div class="interest-note">Next payout in 3 days</div>`,
              'Weekly accrual'
            )}
          </div>
        </div>

        <div class="quick-actions">
          <button class="action-btn primary">View Details</button>
          <button class="action-btn secondary">Add Funds</button>
        </div>
      </main>
    </div>
  `

  // Add click handlers for interactive elements
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.style.transform = 'scale(0.95)'
      setTimeout(() => {
        e.target.style.transform = 'scale(1)'
      }, 150)
    })
  })

  // Add pulse animation to notification dot
  const notificationDot = document.querySelector('.notification-dot')
  if (notificationDot) {
    setInterval(() => {
      notificationDot.style.animation = 'none'
      setTimeout(() => {
        notificationDot.style.animation = 'pulse 2s infinite'
      }, 10)
    }, 5000)
  }
}

// Initialize the app
renderApp()

// Simulate real-time updates
setInterval(() => {
  userData.interestPending += 0.01
  userData.lastUpdated = new Date().toLocaleString()
  
  const pendingElement = document.querySelector('.interest-amount.pending')
  if (pendingElement) {
    pendingElement.textContent = formatCurrency(userData.interestPending)
  }
}, 30000) // Update every 30 seconds