import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5177';

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const issues = {
    consoleErrors: [] as string[],
    brokenLinks: [] as { page: string; link: string; error: string }[],
    missingComponents: [] as { page: string; issue: string }[],
    uiIssues: [] as { page: string; issue: string; severity: string }[],
    functionality: [] as { page: string; feature: string; status: string; notes: string }[],
  };

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      issues.consoleErrors.push(`[${msg.location().url}] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    issues.consoleErrors.push(`PAGE ERROR: ${err.message}`);
  });

  console.log('Starting comprehensive QA tests...\n');

  // Test 1: Login Page
  console.log('Testing: Login Page');
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    const title = await page.textContent('h1');
    console.log(`  Title: ${title}`);

    // Check for demo credentials section
    const demoSection = await page.locator('text=DEMO CREDENTIALS').count();
    console.log(`  Demo credentials section: ${demoSection > 0 ? 'FOUND' : 'MISSING'}`);

    // Check login form elements
    const emailInput = await page.locator('input[type="email"]').count();
    const passwordInput = await page.locator('input[type="password"]').count();
    const submitButton = await page.locator('button[type="submit"]').count();
    console.log(`  Form elements: email=${emailInput}, password=${passwordInput}, submit=${submitButton}`);

    if (!emailInput || !passwordInput || !submitButton) {
      issues.uiIssues.push({ page: 'Login', issue: 'Missing form elements', severity: 'critical' });
    }
  } catch (error: any) {
    issues.missingComponents.push({ page: 'Login', issue: error.message });
  }

  // Test 2: Demo Login and Dashboard
  console.log('\nTesting: Dashboard');
  try {
    // Use demo login
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.click('text=Super Admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 5000 });

    const dashboardTitle = await page.textContent('h1');
    console.log(`  Title: ${dashboardTitle}`);

    // Check stats cards
    const statsCards = await page.locator('.text-2xl.font-bold').count();
    console.log(`  Stats cards found: ${statsCards}`);

    // Check for placeholder charts
    const chartPlaceholders = await page.locator('text=Revenue Chart Placeholder').count();
    const customerPlaceholders = await page.locator('text=Customer Chart Placeholder').count();
    if (chartPlaceholders > 0 || customerPlaceholders > 0) {
      issues.uiIssues.push({ page: 'Dashboard', issue: 'Chart placeholder text visible - charts not implemented', severity: 'medium' });
    }

    // Check Recent Shipments table
    const tableHeaders = await page.locator('thead th').count();
    console.log(`  Table headers: ${tableHeaders}`);
  } catch (error: any) {
    issues.missingComponents.push({ page: 'Dashboard', issue: error.message });
  }

  // Test 3: Shipments Page
  console.log('\nTesting: Shipments Page');
  try {
    await page.goto(`${BASE_URL}/shipments`, { waitUntil: 'networkidle' });
    const title = await page.textContent('h1');
    console.log(`  Title: ${title}`);

    // Check for shipment items
    const shipments = await page.locator('tbody tr').count();
    console.log(`  Shipments displayed: ${shipments}`);

    // Check action buttons work
    const moreButton = await page.locator('button:has(svg)').first();
    if (moreButton) {
      await moreButton.click();
      const dropdown = await page.locator('text=View Details').count();
      console.log(`  Action dropdown: ${dropdown > 0 ? 'WORKING' : 'BROKEN'}`);
      await page.keyboard.press('Escape');
    }

    // Check Export button
    const exportButton = await page.locator('button:has-text("Export")').count();
    console.log(`  Export button: ${exportButton > 0 ? 'FOUND' : 'MISSING'}`);

    // Check New Shipment button
    const newShipmentButton = await page.locator('button:has-text("New Shipment")').count();
    console.log(`  New Shipment button: ${newShipmentButton > 0 ? 'FOUND' : 'MISSING'}`);
  } catch (error: any) {
    issues.missingComponents.push({ page: 'Shipments', issue: error.message });
  }

  // Test 4: Customers Page
  console.log('\nTesting: Customers Page');
  try {
    await page.goto(`${BASE_URL}/customers`, { waitUntil: 'networkidle' });
    const title = await page.textContent('h1');
    console.log(`  Title: ${title}`);

    const customerCards = await page.locator('.bg-slate-800\\/50.rounded-2xl').count();
    console.log(`  Customer cards: ${customerCards}`);
  } catch (error: any) {
    issues.missingComponents.push({ page: 'Customers', issue: error.message });
  }

  // Test 5: Tracking Page
  console.log('\nTesting: Tracking Page');
  try {
    await page.goto(`${BASE_URL}/tracking`, { waitUntil: 'networkidle' });
    const title = await page.textContent('h1');
    console.log(`  Title: ${title}`);

    const trackingCards = await page.locator('.grid.grid-cols-1.lg\\:grid-cols-2 .rounded-2xl').count();
    console.log(`  Tracking cards: ${trackingCards}`);
  } catch (error: any) {
    issues.missingComponents.push({ page: 'Tracking', issue: error.message });
  }

  // Test 6: Analytics Page
  console.log('\nTesting: Analytics Page');
  try {
    await page.goto(`${BASE_URL}/analytics`, { waitUntil: 'networkidle' });
    const title = await page.textContent('h1');
    console.log(`  Title: ${title}`);

    const metrics = await page.locator('.grid-cols-1 .rounded-2xl').count();
    console.log(`  Metric cards: ${metrics}`);
  } catch (error: any) {
    issues.missingComponents.push({ page: 'Analytics', issue: error.message });
  }

  // Test 7: AI Documents Page
  console.log('\nTesting: AI Documents Page');
  try {
    await page.goto(`${BASE_URL}/ai-documents`, { waitUntil: 'networkidle' });
    const title = await page.textContent('h1');
    console.log(`  Title: ${title}`);

    // Check for document type options
    const docTypes = await page.locator('button:has-text("Air Waybill")').count();
    console.log(`  Document types visible: ${docTypes > 0 ? 'YES' : 'NO'}`);

    // Check Generate button
    const generateButton = await page.locator('button:has-text("Generate Document")').count();
    console.log(`  Generate button: ${generateButton > 0 ? 'FOUND' : 'MISSING'}`);

    // Select a shipment and try to generate
    const shipmentSelect = await page.locator('.rounded-xl.border').first();
    if (shipmentSelect) {
      await shipmentSelect.click();
      await page.click('button:has-text("Generate Document")');
      await page.waitForTimeout(3000);

      // Check preview/download/send buttons
      const previewBtn = await page.locator('button:has-text("Preview")').count();
      const downloadBtn = await page.locator('button:has-text("Download PDF")').count();
      const sendBtn = await page.locator('button:has-text("Send to Customer")').count();

      console.log(`  Post-generation buttons: Preview=${previewBtn}, Download=${downloadBtn}, Send=${sendBtn}`);

      if (previewBtn > 0 && downloadBtn > 0 && sendBtn > 0) {
        // Test if buttons are clickable
        try {
          await page.locator('button:has-text("Preview")').click();
          issues.functionality.push({ page: 'AI Documents', feature: 'Preview button', status: 'NEEDS TESTING', notes: 'Button exists but modal/functionality not verified' });
        } catch (e) {
          issues.functionality.push({ page: 'AI Documents', feature: 'Preview button', status: 'BROKEN', notes: 'Button exists but may not open modal' });
        }
      } else {
        issues.functionality.push({ page: 'AI Documents', feature: 'Post-generation actions', status: 'MISSING', notes: 'Buttons appear only after generation but may be non-functional' });
      }
    }
  } catch (error: any) {
    issues.missingComponents.push({ page: 'AI Documents', issue: error.message });
  }

  // Test 8: Approvals Page
  console.log('\nTesting: Approvals Page');
  try {
    await page.goto(`${BASE_URL}/approvals`, { waitUntil: 'networkidle' });
    const title = await page.textContent('h1');
    console.log(`  Title: ${title}`);

    // Check for approval items
    const approvalItems = await page.locator('.border-b.border-slate-800').count();
    console.log(`  Approval items: ${approvalItems}`);

    // Click on first pending item if exists
    const firstItem = await page.locator('button:has-text("Customs Invoice")').first();
    if (await firstItem.count() > 0) {
      await firstItem.click();
      await page.waitForTimeout(500);

      const approveBtn = await page.locator('button:has-text("Approve")').count();
      const rejectBtn = await page.locator('button:has-text("Reject")').count();
      const editApproveBtn = await page.locator('button:has-text("Edit & Approve")').count();

      console.log(`  Action buttons: Approve=${approveBtn}, Reject=${rejectBtn}, Edit&Approve=${editApproveBtn}`);

      if (approveBtn > 0 && rejectBtn > 0) {
        // Try approve action
        await page.locator('button:has-text("Approve & Execute")').click();
        await page.waitForTimeout(1000);

        const statusChanged = await page.locator('text=Approved').count();
        console.log(`  Approval action: ${statusChanged > 0 ? 'WORKING' : 'NEEDS VERIFICATION'}`);
      }
    }
  } catch (error: any) {
    issues.missingComponents.push({ page: 'Approvals', issue: error.message });
  }

  // Test 9: Placeholder Pages
  console.log('\nTesting: Placeholder Pages (should show "coming soon")');
  const placeholderRoutes = [
    '/ai-invoices',
    '/ai-creative',
    '/ai-analyst',
    '/email-system',
    '/workflows',
    '/autopilot',
    '/automation-rules',
    '/document-parser',
    '/voice-tools',
    '/api-playground',
    '/invoices',
    '/businesses',
    '/audit-logs',
    '/users',
    '/roles',
    '/branches',
    '/settings',
    '/support'
  ];

  for (const route of placeholderRoutes) {
    try {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
      const comingSoon = await page.locator('text=coming soon').count();
      const rocket = await page.locator('text=🚀').count();
      console.log(`  ${route}: ${comingSoon > 0 || rocket > 0 ? 'PLACEHOLDER (expected)' : 'MISSING placeholder text'}`);

      if (comingSoon === 0 && rocket === 0) {
        issues.uiIssues.push({ page: route, issue: 'Missing expected placeholder content', severity: 'low' });
      }
    } catch (error: any) {
      issues.missingComponents.push({ page: route, issue: error.message });
    }
  }

  // Test 10: Navigation and Sidebar
  console.log('\nTesting: Sidebar Navigation');
  try {
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    const sidebarLinks = await page.locator('nav a').count();
    console.log(`  Sidebar links found: ${sidebarLinks}`);

    // Check logout links to non-existent routes
    const logoutBtn = await page.locator('button:has-text("Sign Out")').count();
    console.log(`  Sign Out button: ${logoutBtn > 0 ? 'FOUND' : 'MISSING'}`);

    if (logoutBtn > 0) {
      await page.locator('button:has-text("Sign Out")').click();
      // Verify it redirects or shows error
      const currentUrl = page.url();
      console.log(`  After Sign Out click, URL: ${currentUrl}`);
      if (!currentUrl.includes('/login')) {
        issues.functionality.push({ page: 'Sidebar', feature: 'Sign Out', status: 'BROKEN', notes: 'Clicking sign out does not redirect to login' });
      }
    }
  } catch (error: any) {
    issues.missingComponents.push({ page: 'Sidebar', issue: error.message });
  }

  // Test 11: Header Components
  console.log('\nTesting: Header Components');
  try {
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    const notifications = await page.locator('button:has([class*="Bell"])').count();
    console.log(`  Notifications bell: ${notifications > 0 ? 'FOUND' : 'MISSING'}`);

    const profile = await page.locator('button:has([class*="rounded-full"])').count();
    console.log(`  Profile button: ${profile > 0 ? 'FOUND' : 'MISSING'}`);

    const aiGenerate = await page.locator('a:has-text("AI Generate")').count();
    console.log(`  AI Generate link: ${aiGenerate > 0 ? 'FOUND' : 'MISSING'}`);
  } catch (error: any) {
    issues.missingComponents.push({ page: 'Header', issue: error.message });
  }

  // Test 12: 404 Redirect
  console.log('\nTesting: 404 Handling');
  try {
    await page.goto(`${BASE_URL}/non-existent-page-123`, { waitUntil: 'networkidle' });
    const currentUrl = page.url();
    console.log(`  Non-existent route redirects to: ${currentUrl.includes('/dashboard') ? 'dashboard (CORRECT)' : currentUrl}`);
  } catch (error: any) {
    issues.missingComponents.push({ page: '404', issue: error.message });
  }

  await browser.close();

  // Print final report
  console.log('\n' + '='.repeat(80));
  console.log('QA TEST REPORT - AirPak Express Admin Portal');
  console.log('='.repeat(80));

  console.log('\n## Console Errors');
  if (issues.consoleErrors.length === 0) {
    console.log('  No console errors detected!');
  } else {
    issues.consoleErrors.forEach(err => console.log(`  - ${err}`));
  }

  console.log('\n## Missing Components / Page Errors');
  if (issues.missingComponents.length === 0) {
    console.log('  No missing component errors!');
  } else {
    issues.missingComponents.forEach(item => console.log(`  - [${item.page}] ${item.issue}`));
  }

  console.log('\n## UI Issues');
  if (issues.uiIssues.length === 0) {
    console.log('  No UI issues detected!');
  } else {
    issues.uiIssues.forEach(item => console.log(`  - [${item.severity.toUpperCase()}] [${item.page}] ${item.issue}`));
  }

  console.log('\n## Functionality Issues');
  if (issues.functionality.length === 0) {
    console.log('  All tested functionality working!');
  } else {
    issues.functionality.forEach(item => console.log(`  - [${item.page}] ${item.feature}: ${item.status} - ${item.notes}`));
  }

  console.log('\n## Placeholder Pages (Expected)');
  console.log('  The following pages are placeholder stubs with no real functionality:');
  console.log('  - /ai-invoices, /ai-creative, /ai-analyst');
  console.log('  - /email-system, /workflows, /autopilot, /automation-rules');
  console.log('  - /document-parser, /voice-tools, /api-playground');
  console.log('  - /invoices, /businesses, /audit-logs');
  console.log('  - /users, /roles, /branches, /settings, /support');
  console.log('  - /forgot-password');

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`  Console Errors: ${issues.consoleErrors.length}`);
  console.log(`  Missing Components: ${issues.missingComponents.length}`);
  console.log(`  UI Issues: ${issues.uiIssues.length}`);
  console.log(`  Functionality Issues: ${issues.functionality.length}`);
  console.log('='.repeat(80));
}

runTests().catch(console.error);
