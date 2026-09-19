/* ============================================================
   B.H.U.M.I — Shared Utility Functions
   Used across: citizen.js, authority.js, government.js
   ============================================================ */

'use strict';

/* ── Format Numbers ───────────────────────────────────────── */
function formatNumber(n) {
    return Number(n).toLocaleString('en-IN');
}

function formatCurrency(n, symbol = '₹') {
    if (n >= 10000000) return `${symbol}${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000)   return `${symbol}${(n / 100000).toFixed(2)} L`;
    if (n >= 1000)     return `${symbol}${(n / 1000).toFixed(1)}K`;
    return `${symbol}${n}`;
}

/* ── Date Helpers ─────────────────────────────────────────── */
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
}

function formatDateFull(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}

function todayISO() {
    return new Date().toISOString().split('T')[0];
}

function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
}

function daysBetween(a, b) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((new Date(b) - new Date(a)) / msPerDay);
}

/* ── String Helpers ───────────────────────────────────────── */
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function titleCase(str) {
    return str.split(' ').map(capitalize).join(' ');
}

function truncate(str, maxLen = 80) {
    if (!str || str.length <= maxLen) return str;
    return str.slice(0, maxLen).trim() + '…';
}

function generateId(prefix = 'BHM', length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = prefix + '-';
    for (let i = 0; i < length; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

/* ── DOM Helpers ──────────────────────────────────────────── */
function $(selector, parent = document) {
    return parent.querySelector(selector);
}

function $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
}

function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'className') el.className = v;
        else if (k === 'style' && typeof v === 'object') {
            Object.assign(el.style, v);
        } else {
            el.setAttribute(k, v);
        }
    });
    children.forEach(child => {
        if (typeof child === 'string') el.appendChild(document.createTextNode(child));
        else if (child instanceof Node) el.appendChild(child);
    });
    return el;
}

function showElement(el) {
    if (el) el.style.display = '';
}

function hideElement(el) {
    if (el) el.style.display = 'none';
}

function toggleClass(el, cls, force) {
    if (el) el.classList.toggle(cls, force);
}

function setHTML(selector, html, parent = document) {
    const el = parent.querySelector(selector);
    if (el) el.innerHTML = html;
}

/* ── Validation ───────────────────────────────────────────── */
function isValidAadhaar(str) {
    return /^\d{12}$/.test(str.replace(/\s/g, ''));
}

function isValidPhone(str) {
    return /^[6-9]\d{9}$/.test(str.replace(/\s/g, ''));
}

function isValidEmail(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
}

function isValidKhasra(str) {
    return /^[\d]{1,6}(\/[A-Za-z\d]+)?$/.test(str.trim());
}

function isValidPAN(str) {
    return /^[A-Z]{5}\d{4}[A-Z]$/.test(str.trim().toUpperCase());
}

function isNonEmpty(str) {
    return str && str.trim().length > 0;
}

/* ── Local Storage Helpers ────────────────────────────────── */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.warn('B.H.U.M.I: localStorage write failed', e);
        return false;
    }
}

function loadFromStorage(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        return raw !== null ? JSON.parse(raw) : fallback;
    } catch (e) {
        return fallback;
    }
}

function removeFromStorage(key) {
    try { localStorage.removeItem(key); } catch (e) { /* silent */ }
}

function clearStorage() {
    try { localStorage.clear(); } catch (e) { /* silent */ }
}

/* ── Debounce / Throttle ──────────────────────────────────── */
function debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function throttle(fn, limit = 100) {
    let last = 0;
    return function (...args) {
        const now = Date.now();
        if (now - last >= limit) {
            last = now;
            fn.apply(this, args);
        }
    };
}

/* ── Toast (global, re-exported) ─────────────────────────── */
function toast(message, type = 'info', duration = 3500) {
    const existing = document.getElementById('bhToast');
    if (existing) existing.remove();

    const colors = {
        success: ['rgba(16,185,129,0.14)', 'rgba(16,185,129,0.3)', '#10B981'],
        warning: ['rgba(245,158,11,0.14)', 'rgba(245,158,11,0.3)', '#F59E0B'],
        error:   ['rgba(239,68,68,0.14)',  'rgba(239,68,68,0.3)',  '#EF4444'],
        info:    ['rgba(159,165,213,0.14)','rgba(159,165,213,0.3)','#9FA5D5'],
    };
    const [bg, border, color] = colors[type] || colors.info;

    const el = document.createElement('div');
    el.id = 'bhToast';
    el.style.cssText = `
        position:fixed; bottom:1.5rem; right:1.5rem;
        background:${bg}; border:1px solid ${border}; color:${color};
        padding:0.875rem 1.25rem; border-radius:12px;
        font-size:0.85rem; font-weight:600; z-index:99999;
        backdrop-filter:blur(10px); font-family:inherit;
        box-shadow:0 8px 32px rgba(0,0,0,0.4); max-width:340px;
        line-height:1.5; opacity:1; transform:translateY(0);
        transition:opacity 0.3s ease, transform 0.3s ease;
    `;
    el.textContent = message;
    document.body.appendChild(el);

    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px)';
        setTimeout(() => el.remove(), 300);
    }, duration);
}

/* ── Blockchain Mock Hash Generator ──────────────────────── */
function mockBlockchainHash() {
    const hex = '0123456789abcdef';
    return '0x' + Array.from({ length: 64 }, () =>
        hex[Math.floor(Math.random() * 16)]
    ).join('');
}

function mockTxHash() {
    const hex = '0123456789abcdef';
    return '0x' + Array.from({ length: 40 }, () =>
        hex[Math.floor(Math.random() * 16)]
    ).join('');
}

/* ── Async Delay (for simulated API calls) ────────────────── */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* ── Simulate API fetch ───────────────────────────────────── */
async function simulateFetch(data, ms = 800) {
    await delay(ms);
    return { ok: true, data };
}

/* ── Copy to Clipboard ───────────────────────────────────── */
async function copyToClipboard(text, label = 'Copied') {
    try {
        await navigator.clipboard.writeText(text);
        toast(`${label} to clipboard!`, 'success', 2000);
        return true;
    } catch {
        toast('Copy failed. Please copy manually.', 'error');
        return false;
    }
}

/* ── Khasra Formatter ─────────────────────────────────────── */
function formatKhasra(str) {
    if (!str) return '';
    return str.trim().toUpperCase().replace(/\s+/g, '');
}

/* ── Aadhaar Mask ─────────────────────────────────────────── */
function maskAadhaar(str) {
    const clean = str.replace(/\D/g, '');
    if (clean.length !== 12) return str;
    return `XXXX XXXX ${clean.slice(8)}`;
}

/* ── Active nav detection ─────────────────────────────────── */
function setActiveNavFromURL() {
    const path = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.href && path.includes(item.getAttribute('href'))) {
            item.classList.add('active');
        }
    });
}

/* ── Countdown Timer ─────────────────────────────────────── */
function startCountdown(seconds, onTick, onEnd) {
    let remaining = seconds;
    onTick(remaining);
    const interval = setInterval(() => {
        remaining--;
        onTick(remaining);
        if (remaining <= 0) {
            clearInterval(interval);
            if (onEnd) onEnd();
        }
    }, 1000);
    return interval; // caller can clearInterval if needed
}

/* ── Export all for module use (if ever bundled) ─────────── */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatNumber, formatCurrency, formatDate, formatDateFull,
        todayISO, daysAgo, daysBetween,
        capitalize, titleCase, truncate, generateId,
        $, $$, createElement, showElement, hideElement, toggleClass, setHTML,
        isValidAadhaar, isValidPhone, isValidEmail, isValidKhasra, isValidPAN, isNonEmpty,
        saveToStorage, loadFromStorage, removeFromStorage, clearStorage,
        debounce, throttle,
        toast, showToast: toast,
        mockBlockchainHash, mockTxHash,
        delay, simulateFetch,
        copyToClipboard, formatKhasra, maskAadhaar,
        setActiveNavFromURL, startCountdown,
    };
}
