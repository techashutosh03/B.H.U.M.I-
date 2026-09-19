/* ============================================================
   B.H.U.M.I — Authority Portal JavaScript
   Handles: verification queue, eKYC flow, registry & mutation,
            blockchain recording, sidebar, document actions
   ============================================================ */

'use strict';

/* ════════════════════════════════════════════════════════════
   SIDEBAR TOGGLE
   ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const sidebar     = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleBtn   = document.getElementById('sidebarToggle');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            if (mainContent) mainContent.classList.toggle('expanded');
        });
    }

    // Page-specific inits
    if (document.getElementById('verificationQueue')) initVerification();
    if (document.getElementById('ekycFlow'))          initEkyc();
    if (document.getElementById('registryForm'))      initRegistry();
    if (document.getElementById('authorityDash'))     initAuthorityDash();
});

/* ════════════════════════════════════════════════════════════
   AUTHORITY DASHBOARD
   ════════════════════════════════════════════════════════════ */

function initAuthorityDash() {
    animateCounters();
    startLiveClock();
}

function animateCounters() {
    document.querySelectorAll('[data-counter]').forEach(el => {
        const target = parseInt(el.dataset.counter, 10);
        let current  = 0;
        const step   = Math.ceil(target / 60);
        const timer  = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current.toLocaleString('en-IN');
            if (current >= target) clearInterval(timer);
        }, 20);
    });
}

function startLiveClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;
    const update = () => {
        el.textContent = new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };
    update();
    setInterval(update, 1000);
}

/* ════════════════════════════════════════════════════════════
   DOCUMENT VERIFICATION PAGE
   ════════════════════════════════════════════════════════════ */

const VERIFICATION_QUEUE = [
    {
        id: 'VER-2024-4821',
        applicant: 'Rajesh Kumar Tiwari',
        khasra: '2241/B',
        district: 'Lucknow',
        type: 'Sale Deed',
        submitted: '12 Nov 2024',
        aadhaar: 'XXXX XXXX 8821',
        docs: ['Sale Agreement.pdf', 'Aadhaar Copy.pdf', 'NOC.pdf', 'Encumbrance Certificate.pdf'],
        status: 'pending',
        priority: 'high',
    },
    {
        id: 'VER-2024-4792',
        applicant: 'Meena Devi Sharma',
        khasra: '1120/A',
        district: 'Agra',
        type: 'Gift Deed',
        submitted: '11 Nov 2024',
        aadhaar: 'XXXX XXXX 4413',
        docs: ['Gift Deed Draft.pdf', 'Relationship Proof.pdf', 'Property Map.pdf'],
        status: 'pending',
        priority: 'normal',
    },
    {
        id: 'VER-2024-4745',
        applicant: 'Suresh Yadav',
        khasra: '5561/2',
        district: 'Varanasi',
        type: 'Inheritance',
        submitted: '10 Nov 2024',
        aadhaar: 'XXXX XXXX 9930',
        docs: ['Death Certificate.pdf', 'Legal Heir Certificate.pdf', 'Land Record.pdf'],
        status: 'review',
        priority: 'high',
    },
    {
        id: 'VER-2024-4701',
        applicant: 'Anita Gupta',
        khasra: '334/C',
        district: 'Kanpur',
        type: 'Sale Deed',
        submitted: '09 Nov 2024',
        aadhaar: 'XXXX XXXX 7712',
        docs: ['Sale Agreement.pdf', 'Bank NOC.pdf', 'Stamp Paper.pdf'],
        status: 'approved',
        priority: 'normal',
    },
    {
        id: 'VER-2024-4688',
        applicant: 'Vikram Singh',
        khasra: '8920/D',
        district: 'Meerut',
        type: 'Partition Deed',
        submitted: '08 Nov 2024',
        aadhaar: 'XXXX XXXX 2245',
        docs: ['Partition Agreement.pdf', 'Survey Map.pdf', 'Court Order.pdf'],
        status: 'rejected',
        priority: 'low',
    },
];

let currentVerDoc = null;

function initVerification() {
    renderVerificationQueue();
    setupVerificationFilters();
}

function renderVerificationQueue(filter = 'all') {
    const list = document.getElementById('verificationQueue');
    if (!list) return;

    const filtered = filter === 'all'
        ? VERIFICATION_QUEUE
        : VERIFICATION_QUEUE.filter(d => d.status === filter);

    if (filtered.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:3rem; color:var(--text-muted);">
                <div style="font-size:2rem; margin-bottom:0.5rem;">📭</div>
                No documents in this queue.
            </div>`;
        return;
    }

    const priorityIcon = { high:'🔴', normal:'🟡', low:'🟢' };
    const statusMap    = {
        pending:  `<span class="status-badge status-pending">● Pending</span>`,
        review:   `<span class="status-badge status-review">● Under Review</span>`,
        approved: `<span class="status-badge status-approved">● Approved</span>`,
        rejected: `<span class="status-badge status-rejected">● Rejected</span>`,
    };

    list.innerHTML = filtered.map(doc => `
        <div class="verification-item" data-id="${doc.id}">
            <div class="ver-item-left">
                <div class="ver-priority-dot" title="Priority: ${doc.priority}">
                    ${priorityIcon[doc.priority] || '⚪'}
                </div>
                <div class="ver-info">
                    <div class="ver-applicant">${doc.applicant}</div>
                    <div class="ver-meta">
                        <span>${doc.id}</span>
                        <span>•</span>
                        <span>${doc.type}</span>
                        <span>•</span>
                        <span>Khasra: ${doc.khasra}</span>
                        <span>•</span>
                        <span>${doc.district}</span>
                    </div>
                    <div class="ver-date">Submitted: ${doc.submitted}</div>
                </div>
            </div>
            <div class="ver-item-right">
                ${statusMap[doc.status] || ''}
                <button class="btn-ver-review"
                        onclick="openVerificationDetail('${doc.id}')">
                    Review →
                </button>
            </div>
        </div>
    `).join('');
}

function setupVerificationFilters() {
    document.querySelectorAll('[data-ver-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-ver-filter]')
                    .forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderVerificationQueue(btn.dataset.verFilter);
        });
    });
}

function openVerificationDetail(id) {
    currentVerDoc = VERIFICATION_QUEUE.find(d => d.id === id);
    if (!currentVerDoc) return;

    const panel = document.getElementById('verDetailPanel');
    if (!panel) return;

    panel.innerHTML = `
        <div class="ver-detail-header">
            <div>
                <div class="ver-detail-title">${currentVerDoc.applicant}</div>
                <div class="ver-detail-id">${currentVerDoc.id}</div>
            </div>
            <button onclick="closeVerDetail()"
                    style="background:var(--secondary-bg);border:1px solid var(--border-color);
                           color:var(--text-gray);padding:0.4rem 0.75rem;border-radius:8px;
                           cursor:pointer;font-family:inherit;">✕</button>
        </div>

        <div class="ver-detail-grid">
            <div class="ver-field">
                <div class="ver-field-label">Deed Type</div>
                <div class="ver-field-value">${currentVerDoc.type}</div>
            </div>
            <div class="ver-field">
                <div class="ver-field-label">Khasra No.</div>
                <div class="ver-field-value">${currentVerDoc.khasra}</div>
            </div>
            <div class="ver-field">
                <div class="ver-field-label">District</div>
                <div class="ver-field-value">${currentVerDoc.district}</div>
            </div>
            <div class="ver-field">
                <div class="ver-field-label">Aadhaar</div>
                <div class="ver-field-value">${currentVerDoc.aadhaar}</div>
            </div>
        </div>

        <div class="ver-docs-title">Attached Documents</div>
        <div class="ver-docs-list">
            ${currentVerDoc.docs.map((doc, i) => `
                <div class="ver-doc-item">
                    <span class="ver-doc-icon">📄</span>
                    <span class="ver-doc-name">${doc}</span>
                    <button onclick="previewDoc(${i})"
                            style="padding:0.3rem 0.6rem;border-radius:6px;
                                   background:var(--secondary-bg);border:1px solid var(--border-color);
                                   color:var(--text-gray);font-size:0.75rem;cursor:pointer;
                                   font-family:inherit;">
                        View
                    </button>
                </div>
            `).join('')}
        </div>

        <div class="ver-action-row">
            <button class="btn-ver-approve" onclick="approveDocument('${currentVerDoc.id}')">
                ✅ Approve & Forward
            </button>
            <button class="btn-ver-reject" onclick="openRejectModal('${currentVerDoc.id}')">
                ✕ Reject
            </button>
        </div>
    `;

    panel.classList.add('open');
}

function closeVerDetail() {
    const panel = document.getElementById('verDetailPanel');
    if (panel) panel.classList.remove('open');
    currentVerDoc = null;
}

function approveDocument(id) {
    const doc = VERIFICATION_QUEUE.find(d => d.id === id);
    if (!doc) return;
    doc.status = 'approved';
    renderVerificationQueue();
    closeVerDetail();
    showAuthorityToast(`Document ${id} approved and forwarded to eKYC.`, 'success');
}

function openRejectModal(id) {
    const modal = document.getElementById('rejectModal');
    if (!modal) {
        // Fallback: simple prompt
        const reason = prompt('Enter rejection reason:');
        if (reason) rejectDocument(id, reason);
        return;
    }
    modal.dataset.targetId = id;
    modal.classList.add('active');
}

function rejectDocument(id, reason) {
    const doc = VERIFICATION_QUEUE.find(d => d.id === id);
    if (!doc) return;
    doc.status = 'rejected';
    doc.rejectReason = reason;
    renderVerificationQueue();
    closeVerDetail();
    showAuthorityToast(`Document ${id} rejected.`, 'error');
}

function previewDoc(index) {
    showAuthorityToast(`Opening document preview (simulated)…`, 'info');
}


/* ════════════════════════════════════════════════════════════
   eKYC PAGE
   ════════════════════════════════════════════════════════════ */

let ekycStep     = 1;
const EKYC_STEPS = 4;

function initEkyc() {
    showEkycStep(1);

    document.getElementById('ekycAadhaar')?.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 12);
        formatAadhaarInput(this);
    });

    document.getElementById('ekycOTPInput')?.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
    });
}

function formatAadhaarInput(input) {
    const raw   = input.value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < raw.length; i += 4) parts.push(raw.slice(i, i + 4));
    input.value = parts.join(' ');
}

function showEkycStep(step) {
    ekycStep = step;
    for (let i = 1; i <= EKYC_STEPS; i++) {
        const el = document.getElementById(`ekycStep${i}`);
        if (el) el.style.display = (i === step) ? 'block' : 'none';
    }

    // Update step indicator
    document.querySelectorAll('.ekyc-step-dot').forEach((dot, idx) => {
        dot.classList.toggle('active',    idx + 1 === step);
        dot.classList.toggle('completed', idx + 1 < step);
    });
}

async function sendOTP() {
    const aadhaarEl = document.getElementById('ekycAadhaar');
    if (!aadhaarEl) return;

    const raw = aadhaarEl.value.replace(/\s/g, '');
    if (raw.length !== 12) {
        showAuthorityToast('Please enter a valid 12-digit Aadhaar number.', 'error');
        return;
    }

    const btn = document.getElementById('sendOTPBtn');
    if (btn) {
        btn.textContent = 'Sending…';
        btn.disabled    = true;
    }

    await simulateDelay(1500);

    showEkycStep(2);
    showAuthorityToast('OTP sent to registered mobile number.', 'success');

    // Countdown
    let secs = 30;
    const resendBtn  = document.getElementById('resendOTPBtn');
    const countdownEl= document.getElementById('otpCountdown');

    if (countdownEl && resendBtn) {
        resendBtn.disabled = true;
        const timer = setInterval(() => {
            secs--;
            countdownEl.textContent = `Resend in ${secs}s`;
            if (secs <= 0) {
                clearInterval(timer);
                resendBtn.disabled      = false;
                countdownEl.textContent = '';
            }
        }, 1000);
    }
}

async function verifyOTP() {
    const otp = document.getElementById('ekycOTPInput')?.value.trim();
    if (!otp || otp.length < 6) {
        showAuthorityToast('Please enter the 6-digit OTP.', 'error');
        return;
    }

    showAuthorityToast('Verifying OTP…', 'info');
    await simulateDelay(1200);

    // Simulated success (any 6-digit OTP passes in demo)
    showEkycStep(3);
    populateEkycDetails();
}

function populateEkycDetails() {
    const detail = document.getElementById('ekycFetchedDetails');
    if (!detail) return;

    detail.innerHTML = `
        <div class="ekyc-detail-row">
            <div class="ekyc-detail-item">
                <div class="ekyc-detail-label">Full Name</div>
                <div class="ekyc-detail-value">Rajesh Kumar Tiwari</div>
            </div>
            <div class="ekyc-detail-item">
                <div class="ekyc-detail-label">Date of Birth</div>
                <div class="ekyc-detail-value">14 August 1978</div>
            </div>
            <div class="ekyc-detail-item">
                <div class="ekyc-detail-label">Gender</div>
                <div class="ekyc-detail-value">Male</div>
            </div>
            <div class="ekyc-detail-item">
                <div class="ekyc-detail-label">Aadhaar No.</div>
                <div class="ekyc-detail-value">XXXX XXXX 8821</div>
            </div>
            <div class="ekyc-detail-item" style="grid-column: 1 / -1">
                <div class="ekyc-detail-label">Address</div>
                <div class="ekyc-detail-value">
                    House No. 42, Gomti Nagar, Lucknow, Uttar Pradesh — 226010
                </div>
            </div>
        </div>
    `;
}

async function confirmEkyc() {
    showAuthorityToast('Recording eKYC to blockchain…', 'info');
    await simulateDelay(2000);

    const hash = mockBlockchainHash();
    showEkycStep(4);

    const hashEl = document.getElementById('ekycBlockchainHash');
    if (hashEl) hashEl.textContent = hash;

    showAuthorityToast('eKYC verified and blockchain record created.', 'success');
}

function mockBlockchainHash() {
    const hex = '0123456789abcdef';
    return '0x' + Array.from({ length: 64 }, () =>
        hex[Math.floor(Math.random() * 16)]
    ).join('');
}


/* ════════════════════════════════════════════════════════════
   REGISTRY & MUTATION PAGE
   ════════════════════════════════════════════════════════════ */

function initRegistry() {
    setupRegistryTabs();
    setupRegistryFormValidation();
}

function setupRegistryTabs() {
    document.querySelectorAll('[data-reg-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('[data-reg-tab]')
                    .forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.reg-tab-panel')
                    .forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.getElementById(tab.dataset.regTab);
            if (panel) panel.classList.add('active');
        });
    });
}

function setupRegistryFormValidation() {
    const form = document.getElementById('registryForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitRegistry();
    });
}

async function submitRegistry() {
    const fields = {
        khasra:   document.getElementById('regKhasra')?.value.trim(),
        seller:   document.getElementById('regSeller')?.value.trim(),
        buyer:    document.getElementById('regBuyer')?.value.trim(),
        area:     document.getElementById('regArea')?.value.trim(),
        deedType: document.getElementById('regDeedType')?.value,
        stampVal: document.getElementById('regStampValue')?.value.trim(),
    };

    const errors = [];
    if (!fields.khasra)   errors.push('Khasra number is required.');
    if (!fields.seller)   errors.push('Seller name is required.');
    if (!fields.buyer)    errors.push('Buyer name is required.');
    if (!fields.area)     errors.push('Area is required.');
    if (!fields.deedType) errors.push('Deed type is required.');
    if (!fields.stampVal) errors.push('Stamp duty value is required.');

    if (errors.length > 0) {
        showAuthorityToast(errors[0], 'error');
        return;
    }

    const submitBtn = document.getElementById('registrySubmitBtn');
    if (submitBtn) {
        submitBtn.textContent = 'Processing…';
        submitBtn.disabled    = true;
    }

    showAuthorityToast('Initiating blockchain transaction…', 'info');
    await simulateDelay(1000);
    showAuthorityToast('Smart contract executing…', 'info');
    await simulateDelay(1500);

    const txHash  = mockTxHash();
    const regId   = generateRegistryId();

    // Show success panel
    const successPanel = document.getElementById('registrySuccess');
    if (successPanel) {
        document.getElementById('regSuccessId').textContent  = regId;
        document.getElementById('regSuccessTx').textContent  = txHash;
        document.getElementById('regSuccessDate').textContent =
            new Date().toLocaleDateString('en-IN', {
                day:'numeric', month:'long', year:'numeric'
            });
        successPanel.style.display = 'block';
        successPanel.scrollIntoView({ behavior:'smooth' });
    }

    if (submitBtn) {
        submitBtn.textContent = 'Record on Blockchain';
        submitBtn.disabled    = false;
    }

    showAuthorityToast(`Registry ${regId} successfully recorded on blockchain!`, 'success');
}

function mockTxHash() {
    const hex = '0123456789abcdef';
    return '0x' + Array.from({ length: 40 }, () =>
        hex[Math.floor(Math.random() * 16)]
    ).join('');
}

function generateRegistryId() {
    const yr  = new Date().getFullYear();
    const num = Math.floor(Math.random() * 90000) + 10000;
    return `REG-${yr}-${num}`;
}

/* Mutation Form */
async function submitMutation() {
    const mutKhasra = document.getElementById('mutKhasra')?.value.trim();
    const mutType   = document.getElementById('mutType')?.value;
    const mutReason = document.getElementById('mutReason')?.value.trim();

    if (!mutKhasra || !mutType || !mutReason) {
        showAuthorityToast('Please fill all mutation fields.', 'error');
        return;
    }

    showAuthorityToast('Processing mutation…', 'info');
    await simulateDelay(1800);

    const mutId = `MUT-${new Date().getFullYear()}-${Math.floor(Math.random()*90000+10000)}`;
    showAuthorityToast(`Mutation ${mutId} approved and updated in Khatauni.`, 'success');

    const mutForm = document.getElementById('mutationForm');
    if (mutForm) mutForm.reset();
}


/* ════════════════════════════════════════════════════════════
   SHARED HELPERS
   ════════════════════════════════════════════════════════════ */

async function simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showAuthorityToast(message, type = 'info') {
    const colors = {
        success: ['rgba(16,185,129,0.12)', 'rgba(16,185,129,0.3)', '#10B981'],
        error:   ['rgba(239,68,68,0.12)',  'rgba(239,68,68,0.3)',  '#EF4444'],
        warning: ['rgba(245,158,11,0.12)', 'rgba(245,158,11,0.3)', '#F59E0B'],
        info:    ['rgba(159,165,213,0.12)','rgba(159,165,213,0.3)','#9FA5D5'],
    };
    const [bg, border, color] = colors[type] || colors.info;

    const existing = document.getElementById('authToast');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id    = 'authToast';
    el.style.cssText = `
        position:fixed; bottom:1.5rem; right:1.5rem;
        background:${bg}; border:1px solid ${border}; color:${color};
        padding:0.875rem 1.25rem; border-radius:12px;
        font-size:0.85rem; font-weight:600; z-index:9999;
        backdrop-filter:blur(8px); font-family:inherit;
        box-shadow:0 8px 24px rgba(0,0,0,0.4); max-width:340px;
        line-height:1.5; opacity:1; transition:all 0.3s ease;
    `;
    el.textContent = message;
    document.body.appendChild(el);

    setTimeout(() => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(8px)';
        setTimeout(() => el.remove(), 300);
    }, 3500);
}
