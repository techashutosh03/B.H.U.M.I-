/* ============================================================
   B.H.U.M.I — Government HQ JavaScript
   Handles: monitoring table, heatmap, analytics charts,
            dispute cards, modal, filters, pagination
   ============================================================ */

'use strict';

/* ── CSS Variables (reference only) ──────────────────────── */
const GOV_COLORS = {
    lavender:  '#9FA5D5',
    peach:     '#FED7B8',
    green:     '#10B981',
    yellow:    '#F59E0B',
    red:       '#EF4444',
    purple:    '#8B5CF6',
    blue:      '#3B82F6',
    gridLine:  '#3D4166',
    tickColor: '#B8BFEA',
};

/* ════════════════════════════════════════════════════════════
   SIDEBAR TOGGLE (shared with all gov pages)
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

    // Close sidebar on mobile if clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar) {
            if (!sidebar.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });
});


/* ════════════════════════════════════════════════════════════
   MONITORING PAGE — TEHSIL TABLE DATA
   ════════════════════════════════════════════════════════════ */

const TEHSIL_DATA = [
    { name:'Agra Sadar', district:'Agra',       registries:8420, mutations:3210, pending:284, coverage:97, status:'active' },
    { name:'Fatehabad',  district:'Agra',       registries:4180, mutations:1640, pending:512, coverage:88, status:'pending' },
    { name:'Etmadpur',   district:'Agra',       registries:2930, mutations: 980, pending:120, coverage:94, status:'active' },
    { name:'Lucknow Sadar', district:'Lucknow', registries:9840, mutations:4120, pending:340, coverage:98, status:'active' },
    { name:'Bakshi Ka Talab', district:'Lucknow', registries:5210, mutations:2180, pending:189, coverage:95, status:'active' },
    { name:'Mohanlalganj',  district:'Lucknow', registries:3760, mutations:1490, pending:421, coverage:87, status:'pending' },
    { name:'Varanasi Sadar',district:'Varanasi',registries:7840, mutations:3280, pending:218, coverage:96, status:'active' },
    { name:'Pindra',     district:'Varanasi',   registries:3120, mutations:1140, pending:380, coverage:82, status:'pending' },
    { name:'Arajiline',  district:'Varanasi',   registries:2480, mutations: 890, pending:640, coverage:71, status:'inactive' },
    { name:'Kanpur Sadar',district:'Kanpur',    registries:8190, mutations:3410, pending:290, coverage:97, status:'active' },
    { name:'Bilhaur',    district:'Kanpur',     registries:3490, mutations:1360, pending:452, coverage:85, status:'pending' },
    { name:'Ghatampur',  district:'Kanpur',     registries:2860, mutations:1020, pending:320, coverage:89, status:'active' },
    { name:'Prayagraj Sadar', district:'Prayagraj', registries:9120, mutations:3840, pending:180, coverage:98, status:'active' },
    { name:'Phulpur',    district:'Prayagraj',  registries:4280, mutations:1680, pending:390, coverage:90, status:'active' },
    { name:'Handia',     district:'Prayagraj',  registries:2940, mutations:1090, pending:510, coverage:83, status:'pending' },
    { name:'Soraon',     district:'Prayagraj',  registries:1840, mutations: 620, pending:720, coverage:68, status:'inactive' },
    { name:'Mathura Sadar', district:'Mathura', registries:6320, mutations:2480, pending:210, coverage:96, status:'active' },
    { name:'Chhata',     district:'Mathura',    registries:2890, mutations: 980, pending:340, coverage:88, status:'pending' },
    { name:'Mant',       district:'Mathura',    registries:1760, mutations: 560, pending:480, coverage:75, status:'inactive' },
    { name:'Allahabad City', district:'Prayagraj', registries:5840, mutations:2310, pending:280, coverage:94, status:'active' },
    { name:'Naini',      district:'Prayagraj',  registries:3120, mutations:1180, pending:390, coverage:89, status:'active' },
    { name:'Meja',       district:'Prayagraj',  registries:1940, mutations: 680, pending:550, coverage:74, status:'pending' },
    { name:'Baraut',     district:'Baghpat',    registries:4210, mutations:1640, pending:210, coverage:95, status:'active' },
    { name:'Chhaprauli', district:'Baghpat',    registries:2180, mutations: 820, pending:320, coverage:87, status:'active' },
    { name:'Pilana',     district:'Baghpat',    registries:1540, mutations: 510, pending:480, coverage:72, status:'inactive' },
    { name:'Azamgarh Sadar', district:'Azamgarh', registries:5180, mutations:2040, pending:310, coverage:93, status:'active' },
    { name:'Lalganj',    district:'Azamgarh',   registries:2840, mutations:1020, pending:420, coverage:86, status:'pending' },
    { name:'Sagri',      district:'Azamgarh',   registries:1920, mutations: 640, pending:590, coverage:70, status:'inactive' },
    { name:'Gorakhpur Sadar', district:'Gorakhpur', registries:7240, mutations:2980, pending:250, coverage:97, status:'active' },
    { name:'Sahjanwa',   district:'Gorakhpur',  registries:3480, mutations:1280, pending:380, coverage:89, status:'active' },
    { name:'Campierganj',district:'Gorakhpur',  registries:2140, mutations: 780, pending:510, coverage:80, status:'pending' },
    { name:'Meerut Sadar', district:'Meerut',   registries:8840, mutations:3620, pending:190, coverage:98, status:'active' },
    { name:'Hapur',      district:'Meerut',     registries:4120, mutations:1580, pending:280, coverage:93, status:'active' },
    { name:'Sardhana',   district:'Meerut',     registries:2680, mutations: 940, pending:370, coverage:88, status:'pending' },
    { name:'Muzaffarnagar', district:'Muzaffarnagar', registries:6180, mutations:2420, pending:230, coverage:95, status:'active' },
    { name:'Budhana',    district:'Muzaffarnagar', registries:3020, mutations:1120, pending:410, coverage:86, status:'pending' },
    { name:'Shahpur',    district:'Muzaffarnagar', registries:1880, mutations: 610, pending:560, coverage:71, status:'inactive' },
    { name:'Bareilly Sadar', district:'Bareilly', registries:7480, mutations:3040, pending:220, coverage:96, status:'active' },
    { name:'Faridpur',   district:'Bareilly',   registries:3280, mutations:1240, pending:350, coverage:89, status:'active' },
    { name:'Mirganj',    district:'Bareilly',   registries:2040, mutations: 720, pending:490, coverage:77, status:'pending' },
    { name:'Aligarh Sadar', district:'Aligarh', registries:6840, mutations:2760, pending:240, coverage:96, status:'active' },
    { name:'Iglas',      district:'Aligarh',    registries:2940, mutations:1080, pending:380, coverage:87, status:'pending' },
];

/* Pagination state */
let tehsilPage          = 1;
const TEHSIL_PER_PAGE   = 10;
let filteredTehsils     = [...TEHSIL_DATA];

function initMonitoringTable() {
    renderTehsilTable();
}

function renderTehsilTable() {
    const tbody = document.getElementById('tehsilTableBody');
    if (!tbody) return;

    const start = (tehsilPage - 1) * TEHSIL_PER_PAGE;
    const end   = start + TEHSIL_PER_PAGE;
    const page  = filteredTehsils.slice(start, end);

    tbody.innerHTML = page.map(row => {
        const coverageClass = row.coverage >= 90 ? 'green'
                            : row.coverage >= 75 ? '' : 'peach';
        const statusMap = {
            active:   '<span class="badge badge-active">● Active</span>',
            pending:  '<span class="badge badge-pending">● Pending</span>',
            inactive: '<span class="badge badge-inactive">● Inactive</span>',
        };
        return `
        <tr>
            <td>
                <div class="region-name">${row.name}</div>
            </td>
            <td>
                <div class="region-district">${row.district}</div>
            </td>
            <td>${row.registries.toLocaleString('en-IN')}</td>
            <td>${row.mutations.toLocaleString('en-IN')}</td>
            <td style="color:${row.pending > 400 ? GOV_COLORS.yellow : 'inherit'}">
                ${row.pending.toLocaleString('en-IN')}
            </td>
            <td>
                <div class="progress-bar-wrap">
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill ${coverageClass}"
                             style="width:${row.coverage}%"></div>
                    </div>
                    <span class="progress-label">${row.coverage}%</span>
                </div>
            </td>
            <td>${statusMap[row.status] || ''}</td>
        </tr>`;
    }).join('');

    // Update pagination info
    const info = document.getElementById('paginationInfo');
    if (info) {
        const s = start + 1;
        const e = Math.min(end, filteredTehsils.length);
        info.textContent = `Showing ${s}–${e} of ${filteredTehsils.length} tehsils`;
    }
}

function filterTehsilTable(query) {
    const q = query.toLowerCase().trim();
    const districtVal = document.getElementById('districtFilter')?.value || 'all';
    applyTehsilFilters(q, districtVal);
}

function filterByDistrict(value) {
    const q = document.getElementById('tehsilSearch')?.value.toLowerCase().trim() || '';
    applyTehsilFilters(q, value);
}

function applyTehsilFilters(query, district) {
    filteredTehsils = TEHSIL_DATA.filter(row => {
        const matchQuery    = !query || row.name.toLowerCase().includes(query) ||
                              row.district.toLowerCase().includes(query);
        const matchDistrict = district === 'all' || row.district.toLowerCase() === district.toLowerCase();
        return matchQuery && matchDistrict;
    });
    tehsilPage = 1;
    renderTehsilTable();
}

function changePage(dir) {
    const maxPage = Math.ceil(filteredTehsils.length / TEHSIL_PER_PAGE);
    tehsilPage = Math.max(1, Math.min(tehsilPage + dir, maxPage));
    renderTehsilTable();
}


/* ════════════════════════════════════════════════════════════
   HEATMAP
   ════════════════════════════════════════════════════════════ */

function initHeatmap() {
    const grid = document.getElementById('heatmapGrid');
    if (!grid) return;

    const days  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const weeks = 7;
    const cells = [];

    for (let w = 0; w < weeks; w++) {
        for (let d = 0; d < 7; d++) {
            const val   = Math.floor(Math.random() * 6); // 0–5
            const level = val === 0 ? '' : `level-${val > 5 ? 5 : val}`;
            const count = val === 0 ? 0 : Math.floor(Math.random() * 800) + 50;
            cells.push({ level, count, day: days[d], week: w + 1 });
        }
    }

    grid.innerHTML = cells.map(c => `
        <div class="heatmap-cell ${c.level}"
             data-tooltip="${c.day} Wk${c.week}: ${c.count} registrations"
             title="${c.day} Week ${c.week}: ${c.count} registrations">
        </div>
    `).join('');
}


/* ════════════════════════════════════════════════════════════
   ANALYTICS PAGE — CHARTS
   ════════════════════════════════════════════════════════════ */

const MONTHLY_LABELS = ['Jan','Feb','Mar','Apr','May','Jun',
                        'Jul','Aug','Sep','Oct','Nov','Dec'];

const MONTHLY_DATA = {
    '2024': [9200, 10400, 11800, 12400, 13100, 14200,
             15800, 14900, 13400, 12800, 11200, 9800],
    '2023': [8100, 9200, 10400, 11200, 11900, 12800,
             13900, 13200, 12100, 11400, 10200, 8900],
    '2022': [7200, 8100, 9300, 10100, 10800, 11600,
             12800, 12100, 11200, 10600, 9400, 8200],
};

const PROJECTED_REVENUE = {
    '2024': [58,62,71,76,82,88,94,89,81,78,68,59],
    '2023': [52,57,64,70,75,81,87,83,76,71,63,54],
    '2022': [46,51,58,63,68,74,80,76,70,65,57,49],
};

const ACTUAL_REVENUE = {
    '2024': [61,65,73,74,85,91,98,88,84,75,null,null],
    '2023': [54,59,66,72,77,84,89,85,74,69,61,52],
    '2022': [48,53,60,65,70,76,82,78,72,67,59,51],
};

let monthlyChart, deedChart, districtChart, revenueChart;

function initAnalyticsCharts(year = '2024') {
    buildMonthlyTrendChart(year);
    buildDeedDoughnut();
    buildDistrictBar();
    buildRevenueChart(year);
    renderDeedBreakdownTable();
    updateSelectedYearLabel(year);
}

function updateAnalyticsCharts(year) {
    updateSelectedYearLabel(year);

    if (monthlyChart) {
        monthlyChart.data.datasets[0].data = MONTHLY_DATA[year];
        monthlyChart.update();
    }
    if (revenueChart) {
        revenueChart.data.datasets[0].data = PROJECTED_REVENUE[year];
        revenueChart.data.datasets[1].data = ACTUAL_REVENUE[year];
        revenueChart.update();
    }
}

function updateSelectedYearLabel(year) {
    const el = document.getElementById('selectedYear');
    if (el) el.textContent = year;
}

function buildMonthlyTrendChart(year) {
    const ctx = document.getElementById('monthlyTrendChart');
    if (!ctx) return;

    monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: MONTHLY_LABELS,
            datasets: [{
                label: 'Registrations',
                data: MONTHLY_DATA[year],
                borderColor: GOV_COLORS.lavender,
                backgroundColor: 'rgba(159,165,213,0.08)',
                borderWidth: 2.5,
                pointRadius: 4,
                pointBackgroundColor: GOV_COLORS.lavender,
                pointBorderColor: '#252841',
                pointBorderWidth: 2,
                tension: 0.4,
                fill: true,
            }],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: GOV_COLORS.tickColor, font: { size: 11 } } },
                tooltip: {
                    backgroundColor: '#252841',
                    borderColor: '#4A4E7A',
                    borderWidth: 1,
                    titleColor: '#F0F2FF',
                    bodyColor: '#B8BFEA',
                    callbacks: {
                        label: ctx => ` ${ctx.parsed.y.toLocaleString('en-IN')} registrations`
                    }
                }
            },
            scales: {
                x: {
                    grid:  { color: GOV_COLORS.gridLine },
                    ticks: { color: GOV_COLORS.tickColor, font: { size: 10 } },
                },
                y: {
                    grid:  { color: GOV_COLORS.gridLine },
                    ticks: {
                        color: GOV_COLORS.tickColor,
                        font: { size: 10 },
                        callback: v => v.toLocaleString('en-IN')
                    },
                }
            }
        }
    });
}

function buildDeedDoughnut() {
    const ctx = document.getElementById('deedDoughnutChart');
    if (!ctx) return;

    deedChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Sale Deed','Gift Deed','Inheritance','Others'],
            datasets: [{
                data: [65, 20, 10, 5],
                backgroundColor: [
                    GOV_COLORS.lavender,
                    GOV_COLORS.peach,
                    GOV_COLORS.green,
                    GOV_COLORS.yellow,
                ],
                borderColor: '#252841',
                borderWidth: 3,
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: GOV_COLORS.tickColor,
                        font: { size: 11 },
                        padding: 14,
                        boxWidth: 12,
                        usePointStyle: true,
                    }
                },
                tooltip: {
                    backgroundColor: '#252841',
                    borderColor: '#4A4E7A',
                    borderWidth: 1,
                    titleColor: '#F0F2FF',
                    bodyColor: '#B8BFEA',
                    callbacks: {
                        label: ctx => ` ${ctx.label}: ${ctx.parsed}%`
                    }
                }
            }
        }
    });
}

function buildDistrictBar() {
    const ctx = document.getElementById('districtBarChart');
    if (!ctx) return;

    const labels = ['Lucknow','Meerut','Prayagraj','Agra','Kanpur','Varanasi','Gorakhpur','Mathura'];
    const data   = [18420, 15640, 14820, 13910, 13290, 12840, 10740, 9820];

    districtChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Registrations',
                data,
                backgroundColor: data.map((_, i) =>
                    i % 2 === 0
                        ? 'rgba(159,165,213,0.55)'
                        : 'rgba(254,215,184,0.45)'),
                borderColor: data.map((_, i) =>
                    i % 2 === 0 ? GOV_COLORS.lavender : GOV_COLORS.peach),
                borderWidth: 1.5,
                borderRadius: 6,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#252841',
                    borderColor: '#4A4E7A',
                    borderWidth: 1,
                    titleColor: '#F0F2FF',
                    bodyColor: '#B8BFEA',
                    callbacks: {
                        label: ctx => ` ${ctx.parsed.x.toLocaleString('en-IN')}`
                    }
                }
            },
            scales: {
                x: {
                    grid:  { color: GOV_COLORS.gridLine },
                    ticks: {
                        color: GOV_COLORS.tickColor,
                        font: { size: 10 },
                        callback: v => v.toLocaleString('en-IN')
                    }
                },
                y: {
                    grid:  { color: 'transparent' },
                    ticks: { color: GOV_COLORS.tickColor, font: { size: 10 } }
                }
            }
        }
    });
}

function buildRevenueChart(year) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: MONTHLY_LABELS,
            datasets: [
                {
                    label: 'Projected',
                    data: PROJECTED_REVENUE[year],
                    borderColor: 'rgba(159,165,213,0.5)',
                    borderDash: [5, 4],
                    borderWidth: 1.8,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: false,
                },
                {
                    label: 'Actual',
                    data: ACTUAL_REVENUE[year],
                    borderColor: GOV_COLORS.peach,
                    backgroundColor: 'rgba(254,215,184,0.07)',
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointBackgroundColor: GOV_COLORS.peach,
                    pointBorderColor: '#252841',
                    pointBorderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    spanGaps: false,
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: GOV_COLORS.tickColor, font: { size: 11 } } },
                tooltip: {
                    backgroundColor: '#252841',
                    borderColor: '#4A4E7A',
                    borderWidth: 1,
                    titleColor: '#F0F2FF',
                    bodyColor: '#B8BFEA',
                    callbacks: {
                        label: ctx => ` ₹${ctx.parsed.y} Cr`
                    }
                }
            },
            scales: {
                x: {
                    grid:  { color: GOV_COLORS.gridLine },
                    ticks: { color: GOV_COLORS.tickColor, font: { size: 10 } }
                },
                y: {
                    grid:  { color: GOV_COLORS.gridLine },
                    ticks: {
                        color: GOV_COLORS.tickColor,
                        font: { size: 10 },
                        callback: v => `₹${v}Cr`
                    }
                }
            }
        }
    });
}

/* Deed Breakdown Table */
function renderDeedBreakdownTable() {
    const tbody = document.getElementById('deedBreakdownBody');
    if (!tbody) return;

    const rows = [
        { district:'Lucknow',     sale:11980, gift:3690, inherit:1840, others:910,  revenue:128 },
        { district:'Meerut',      sale:10170, gift:3130, inherit:1560, others:780,  revenue:112 },
        { district:'Prayagraj',   sale: 9640, gift:2970, inherit:1480, others:730,  revenue:105 },
        { district:'Agra',        sale: 9040, gift:2780, inherit:1390, others:700,  revenue: 98 },
        { district:'Kanpur',      sale: 8640, gift:2660, inherit:1330, others:660,  revenue: 93 },
        { district:'Varanasi',    sale: 8350, gift:2570, inherit:1290, others:630,  revenue: 89 },
        { district:'Gorakhpur',   sale: 6980, gift:2150, inherit:1070, others:540,  revenue: 74 },
        { district:'Mathura',     sale: 6380, gift:1970, inherit: 980, others:490,  revenue: 68 },
        { district:'Bareilly',    sale: 5890, gift:1810, inherit: 910, others:450,  revenue: 63 },
        { district:'Muzaffarnagar',sale:4870, gift:1500, inherit: 750, others:375,  revenue: 52 },
    ];

    tbody.innerHTML = rows.map(r => {
        const total = r.sale + r.gift + r.inherit + r.others;
        return `
        <tr>
            <td class="region-name">${r.district}</td>
            <td>${r.sale.toLocaleString('en-IN')}</td>
            <td>${r.gift.toLocaleString('en-IN')}</td>
            <td>${r.inherit.toLocaleString('en-IN')}</td>
            <td>${r.others.toLocaleString('en-IN')}</td>
            <td><strong>${total.toLocaleString('en-IN')}</strong></td>
            <td style="color:var(--accent-peach); font-weight:600;">₹${r.revenue} Cr</td>
        </tr>`;
    }).join('');
}


/* ════════════════════════════════════════════════════════════
   DISPUTES PAGE
   ════════════════════════════════════════════════════════════ */

const DISPUTES_DATA = [
    {
        id: 'DSP-2024-0891',
        title: 'Boundary Encroachment — Khasra 1142/A',
        type: 'boundary',
        district: 'Agra',
        tehsil: 'Agra Sadar',
        filedBy: 'Ramesh Kumar Sharma',
        filedOn: '14 Mar 2024',
        status: 'open',
        khasra: '1142/A',
        area: '0.42 Bigha',
        description: 'Complainant alleges that the adjacent plot holder has encroached approximately 0.08 bigha of registered land by extending boundary wall illegally.',
        timeline: [
            { type:'filed',   date:'14 Mar 2024', event:'Dispute Filed',       note:'Submitted via citizen portal' },
            { type:'review',  date:'18 Mar 2024', event:'Assigned to Patwari', note:'Patwari Suresh Verma assigned' },
            { type:'pending', date:'22 Mar 2024', event:'Site Inspection Scheduled', note:'Visit on 28 Mar 2024' },
        ]
    },
    {
        id: 'DSP-2024-0804',
        title: 'Ownership Dispute — Plot No. 284, Lucknow',
        type: 'ownership',
        district: 'Lucknow',
        tehsil: 'Lucknow Sadar',
        filedBy: 'Priya Devi Mishra',
        filedOn: '02 Feb 2024',
        status: 'review',
        khasra: '284/B',
        area: '1.2 Bigha',
        description: 'Two claimants presenting conflicting sale deeds for the same plot. One deed dated 2018 and another dated 2021. Blockchain verification initiated.',
        timeline: [
            { type:'filed',   date:'02 Feb 2024', event:'Dispute Filed',       note:'Via local authority office' },
            { type:'review',  date:'08 Feb 2024', event:'Documents Collected',  note:'Both parties submitted papers' },
            { type:'review',  date:'15 Feb 2024', event:'Blockchain Audit',     note:'Smart contract records reviewed' },
            { type:'pending', date:'20 Feb 2024', event:'Hearing Scheduled',    note:'Set for 05 Mar 2024' },
        ]
    },
    {
        id: 'DSP-2024-0731',
        title: 'Inheritance Claim — Agricultural Land',
        type: 'inheritance',
        district: 'Varanasi',
        tehsil: 'Varanasi Sadar',
        filedBy: 'Sunita Yadav',
        filedOn: '18 Jan 2024',
        status: 'resolved',
        khasra: '5561/2',
        area: '3.8 Bigha',
        description: 'Three legal heirs disputed partition of agricultural land following intestate succession. Mediation conducted and consent decree issued.',
        timeline: [
            { type:'filed',    date:'18 Jan 2024', event:'Dispute Filed',      note:'Inheritance claim raised' },
            { type:'review',   date:'25 Jan 2024', event:'Mediation Initiated', note:'All 3 heirs present' },
            { type:'review',   date:'02 Feb 2024', event:'Partition Agreed',   note:'Equal 1/3 split accepted' },
            { type:'resolved', date:'10 Feb 2024', event:'Resolved & Recorded', note:'New Khataunis issued' },
        ]
    },
    {
        id: 'DSP-2024-0698',
        title: 'Fraudulent Registration Claim — Kanpur',
        type: 'fraud',
        district: 'Kanpur',
        tehsil: 'Kanpur Sadar',
        filedBy: 'Vikram Singh Chauhan',
        filedOn: '05 Jan 2024',
        status: 'escalated',
        khasra: '890/C',
        area: '0.8 Bigha',
        description: 'Complainant claims forged Power of Attorney was used to transfer property without consent. FIR registered. Matter escalated to district court.',
        timeline: [
            { type:'filed',  date:'05 Jan 2024', event:'Fraud Complaint Filed', note:'Police complaint attached' },
            { type:'review', date:'10 Jan 2024', event:'FIR Registered',        note:'Kanpur Kotwali PS' },
            { type:'review', date:'18 Jan 2024', event:'Technical Audit',       note:'Digital signature verified' },
            { type:'review', date:'25 Jan 2024', event:'Escalated to Court',    note:'Kanpur District Court' },
        ]
    },
    {
        id: 'DSP-2024-0612',
        title: 'Boundary Dispute — Prayagraj Rural',
        type: 'boundary',
        district: 'Prayagraj',
        tehsil: 'Phulpur',
        filedBy: 'Anita Gupta',
        filedOn: '28 Dec 2023',
        status: 'open',
        khasra: '2234/1',
        area: '0.6 Bigha',
        description: 'Neighbour has reportedly installed boundary markers encroaching 12 feet into complainant\'s recorded land parcel.',
        timeline: [
            { type:'filed',   date:'28 Dec 2023', event:'Dispute Filed',     note:'Via citizen portal' },
            { type:'review',  date:'04 Jan 2024', event:'Notice Issued',     note:'Sent to opposite party' },
            { type:'pending', date:'12 Jan 2024', event:'Awaiting Response', note:'Response deadline 20 Jan' },
        ]
    },
    {
        id: 'DSP-2024-0551',
        title: 'Ownership Conflict — Mathura Commercial Plot',
        type: 'ownership',
        district: 'Mathura',
        tehsil: 'Mathura Sadar',
        filedBy: 'Rohit Kumar Agarwal',
        filedOn: '12 Dec 2023',
        status: 'review',
        khasra: '114/A',
        area: '2.1 Bigha',
        description: 'Two brothers disputing ownership of commercial plot inherited from father. Registry shows both names but deed mutation was filed independently by elder brother.',
        timeline: [
            { type:'filed',   date:'12 Dec 2023', event:'Filed',            note:'Submitted at tehsil office' },
            { type:'review',  date:'19 Dec 2023', event:'Family Mediation', note:'Jointly conducted' },
            { type:'pending', date:'02 Jan 2024', event:'Pending Outcome',  note:'Final hearing on 15 Jan' },
        ]
    },
    {
        id: 'DSP-2023-0489',
        title: 'Land Grab — Meerut Agricultural',
        type: 'fraud',
        district: 'Meerut',
        tehsil: 'Hapur',
        filedBy: 'Geeta Devi Sharma',
        filedOn: '30 Nov 2023',
        status: 'resolved',
        khasra: '4421/3',
        area: '5.4 Bigha',
        description: 'Local builder allegedly acquired agricultural land using falsified NOC. Revenue records corrected after blockchain audit confirmed original owner.',
        timeline: [
            { type:'filed',    date:'30 Nov 2023', event:'Filed',             note:'Emergency petition' },
            { type:'review',   date:'05 Dec 2023', event:'Blockchain Audit',  note:'Discrepancy detected' },
            { type:'review',   date:'12 Dec 2023', event:'Records Corrected', note:'Patwari corrected entry' },
            { type:'resolved', date:'20 Dec 2023', event:'Resolved',          note:'Land restored to owner' },
        ]
    },
    {
        id: 'DSP-2023-0402',
        title: 'Inheritance — Gorakhpur Agricultural Dispute',
        type: 'inheritance',
        district: 'Gorakhpur',
        tehsil: 'Sahjanwa',
        filedBy: 'Suresh Yadav & Brothers',
        filedOn: '14 Nov 2023',
        status: 'escalated',
        khasra: '8891/B',
        area: '12.6 Bigha',
        description: 'Five legal heirs could not agree on partition of large agricultural holding. Case escalated to revenue tribunal after two failed mediation sessions.',
        timeline: [
            { type:'filed',  date:'14 Nov 2023', event:'Filed',             note:'5 claimants registered' },
            { type:'review', date:'22 Nov 2023', event:'Mediation 1',       note:'No consensus reached' },
            { type:'review', date:'30 Nov 2023', event:'Mediation 2',       note:'Failed again' },
            { type:'review', date:'08 Dec 2023', event:'Escalated to Tribunal', note:'Revenue Tribunal, Gorakhpur' },
        ]
    },
];

let filteredDisputes    = [...DISPUTES_DATA];
let disputePage         = 1;
const DISPUTES_PER_PAGE = 6;

function renderDisputeCards() {
    const list  = document.getElementById('disputesList');
    const empty = document.getElementById('disputesEmpty');
    const info  = document.getElementById('disputePaginationInfo');
    if (!list) return;

    const start = (disputePage - 1) * DISPUTES_PER_PAGE;
    const end   = start + DISPUTES_PER_PAGE;
    const page  = filteredDisputes.slice(start, end);

    if (page.length === 0) {
        list.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    const statusIconMap = {
        open:      { cls:'',         icon:'⚠️' },
        review:    { cls:'review',   icon:'🔍' },
        resolved:  { cls:'resolved', icon:'✅' },
        escalated: { cls:'',         icon:'🚨' },
    };

    const statusBadgeMap = {
        open:      `<span class="badge badge-inactive">● Open</span>`,
        review:    `<span class="badge badge-review">● Under Review</span>`,
        resolved:  `<span class="badge badge-active">● Resolved</span>`,
        escalated: `<span class="badge badge-pending">● Escalated</span>`,
    };

    list.innerHTML = page.map(d => {
        const si = statusIconMap[d.status] || { cls:'', icon:'📁' };
        return `
        <div class="dispute-card" onclick="openDisputeModal('${d.id}')">
            <div class="dispute-card-header">
                <div class="dispute-id-wrap">
                    <div class="dispute-icon ${si.cls}">${si.icon}</div>
                    <div>
                        <div class="dispute-title">${d.title}</div>
                        <div class="dispute-id-text">${d.id}</div>
                    </div>
                </div>
                ${statusBadgeMap[d.status] || ''}
            </div>

            <div class="dispute-meta">
                <div class="dispute-meta-item">
                    <span>📍</span>
                    <span>${d.tehsil}, ${d.district}</span>
                </div>
                <div class="dispute-meta-item">
                    <span>🗓</span>
                    <span>Filed: ${d.filedOn}</span>
                </div>
                <div class="dispute-meta-item">
                    <span>👤</span>
                    <span>${d.filedBy}</span>
                </div>
                <div class="dispute-meta-item">
                    <span>📐</span>
                    <span>${d.area}</span>
                </div>
            </div>

            <div class="dispute-description">${d.description}</div>

            <div class="dispute-actions" onclick="event.stopPropagation()">
                <button class="btn-dispute btn-dispute-view"
                        onclick="openDisputeModal('${d.id}')">
                    View Details
                </button>
                ${d.status !== 'resolved'
                    ? `<button class="btn-dispute btn-dispute-resolve"
                               onclick="markResolved('${d.id}')">
                           Mark Resolved
                       </button>`
                    : ''}
                ${d.status === 'open' || d.status === 'review'
                    ? `<button class="btn-dispute btn-dispute-escalate"
                               onclick="escalateDispute('${d.id}')">
                           Escalate
                       </button>`
                    : ''}
            </div>
        </div>`;
    }).join('');

    if (info) {
        const s = start + 1;
        const e = Math.min(end, filteredDisputes.length);
        info.textContent = `Showing ${s}–${e} of ${filteredDisputes.length} disputes`;
    }
}

function filterDisputes() {
    const query    = document.getElementById('disputeSearch')?.value.toLowerCase().trim() || '';
    const status   = document.getElementById('statusFilter')?.value || 'all';
    const district = document.getElementById('disputeDistrictFilter')?.value || 'all';
    const type     = document.getElementById('typeFilter')?.value || 'all';

    filteredDisputes = DISPUTES_DATA.filter(d => {
        const matchQ = !query || d.id.toLowerCase().includes(query)
                               || d.title.toLowerCase().includes(query)
                               || d.khasra.toLowerCase().includes(query)
                               || d.filedBy.toLowerCase().includes(query);
        const matchS = status   === 'all' || d.status   === status;
        const matchD = district === 'all' || d.district === district;
        const matchT = type     === 'all' || d.type     === type;
        return matchQ && matchS && matchD && matchT;
    });

    disputePage = 1;
    renderDisputeCards();
}

function disputeChangePage(dir) {
    const maxPage = Math.ceil(filteredDisputes.length / DISPUTES_PER_PAGE);
    disputePage = Math.max(1, Math.min(disputePage + dir, maxPage));
    renderDisputeCards();
}

function markResolved(id) {
    const d = DISPUTES_DATA.find(x => x.id === id);
    if (!d) return;
    d.status = 'resolved';
    d.timeline.push({
        type: 'resolved',
        date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
        event: 'Marked Resolved',
        note: 'Resolved by Government HQ',
    });
    filteredDisputes = [...DISPUTES_DATA];
    renderDisputeCards();
    showToast(`Dispute ${id} marked as resolved.`, 'success');
}

function escalateDispute(id) {
    const d = DISPUTES_DATA.find(x => x.id === id);
    if (!d) return;
    d.status = 'escalated';
    d.timeline.push({
        type: 'review',
        date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
        event: 'Escalated by HQ',
        note: 'Forwarded to District Court',
    });
    filteredDisputes = [...DISPUTES_DATA];
    renderDisputeCards();
    showToast(`Dispute ${id} escalated to court.`, 'warning');
}

/* Modal */
function openDisputeModal(id) {
    const d = DISPUTES_DATA.find(x => x.id === id);
    if (!d) return;

    document.getElementById('modalDisputeTitle').textContent = d.title;

    const tlHtml = d.timeline.map(t => `
        <div class="timeline-item">
            <div class="timeline-dot ${t.type}">${
                t.type === 'filed'    ? '📁'
              : t.type === 'review'  ? '🔍'
              : t.type === 'resolved'? '✅'
              : '⏳'
            }</div>
            <div class="timeline-content">
                <div class="tl-date">${t.date}</div>
                <div class="tl-event">${t.event}</div>
                <div class="tl-note">${t.note}</div>
            </div>
        </div>
    `).join('');

    document.getElementById('modalDisputeBody').innerHTML = `
        <div class="field-row">
            <div class="field-item">
                <div class="field-label">Dispute ID</div>
                <div class="field-value" style="font-family:monospace">${d.id}</div>
            </div>
            <div class="field-item">
                <div class="field-label">Status</div>
                <div class="field-value">${d.status.toUpperCase()}</div>
            </div>
            <div class="field-item">
                <div class="field-label">Khasra No.</div>
                <div class="field-value">${d.khasra}</div>
            </div>
            <div class="field-item">
                <div class="field-label">Area</div>
                <div class="field-value">${d.area}</div>
            </div>
            <div class="field-item">
                <div class="field-label">District</div>
                <div class="field-value">${d.district}</div>
            </div>
            <div class="field-item">
                <div class="field-label">Tehsil</div>
                <div class="field-value">${d.tehsil}</div>
            </div>
            <div class="field-item" style="grid-column: 1 / -1">
                <div class="field-label">Filed By</div>
                <div class="field-value">${d.filedBy} — ${d.filedOn}</div>
            </div>
            <div class="field-item" style="grid-column: 1 / -1">
                <div class="field-label">Description</div>
                <div class="field-value" style="font-weight:400; line-height:1.6; font-size:0.85rem;">
                    ${d.description}
                </div>
            </div>
        </div>
        <div class="dispute-timeline">
            <div class="dispute-timeline-title">Case Timeline</div>
            ${tlHtml}
        </div>
    `;

    document.getElementById('disputeModalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDisputeModal() {
    document.getElementById('disputeModalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('disputeModalOverlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeDisputeModal();
        });
    }

    // Init disputes if on disputes page
    if (document.getElementById('disputesList')) {
        renderDisputeCards();
    }

    // Init analytics if on analytics page
    if (document.getElementById('monthlyTrendChart')) {
        initAnalyticsCharts('2024');
    }

    // Init monitoring if on monitoring page
    if (document.getElementById('tehsilTableBody')) {
        initMonitoringTable();
        initHeatmap();
    }
});


/* ════════════════════════════════════════════════════════════
   EXPORT HELPERS
   ════════════════════════════════════════════════════════════ */

function exportCSV() {
    const headers = ['Tehsil','District','Registries','Mutations','Pending','Coverage%','Status'];
    const rows    = filteredTehsils.map(r =>
        [r.name, r.district, r.registries, r.mutations, r.pending, r.coverage, r.status].join(',')
    );
    downloadCSV([headers.join(','), ...rows].join('\n'), 'b_h_u_m_i_monitoring.csv');
}

function exportReport() {
    showToast('Analytics report export initiated. Check downloads.', 'success');
}

function exportDisputes() {
    const headers = ['ID','Title','Type','District','Tehsil','Filed By','Filed On','Status'];
    const rows    = filteredDisputes.map(d =>
        [d.id, `"${d.title}"`, d.type, d.district, d.tehsil, d.filedBy, d.filedOn, d.status].join(',')
    );
    downloadCSV([headers.join(','), ...rows].join('\n'), 'b_h_u_m_i_disputes.csv');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filename} downloaded successfully.`, 'success');
}


/* ════════════════════════════════════════════════════════════
   TOAST NOTIFICATION
   ════════════════════════════════════════════════════════════ */

function showToast(message, type = 'success') {
    const existing = document.getElementById('b_h_u_m_iToast');
    if (existing) existing.remove();

    const colorMap = {
        success: { bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.3)', text:'#10B981' },
        warning: { bg:'rgba(245,158,11,0.12)',  border:'rgba(245,158,11,0.3)',  text:'#F59E0B' },
        error:   { bg:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.3)',   text:'#EF4444' },
        info:    { bg:'rgba(159,165,213,0.12)', border:'rgba(159,165,213,0.3)', text:'#9FA5D5' },
    };
    const c = colorMap[type] || colorMap.info;

    const toast = document.createElement('div');
    toast.id    = 'b_h_u_m_iToast';
    toast.style.cssText = `
        position: fixed; bottom: 1.5rem; right: 1.5rem;
        background: ${c.bg}; border: 1px solid ${c.border};
        color: ${c.text}; padding: 0.875rem 1.25rem;
        border-radius: 12px; font-size: 0.85rem; font-weight: 600;
        z-index: 9999; backdrop-filter: blur(8px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        transform: translateY(0); opacity: 1;
        transition: all 0.3s ease; max-width: 340px;
        font-family: inherit; line-height: 1.5;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
