/**
 * 工具箱 - 通用JavaScript函数
 * 包含：复制到剪贴板、下载文件、工具函数等
 */

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @param {HTMLElement} btn - 触发按钮（可选，用于显示反馈）
 */
function copyToClipboard(text, btn) {
    if (!text) {
        showMessage('没有可复制的内容', 'error');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showMessage('已复制到剪贴板', 'success');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✓ 已复制';
            btn.classList.add('btn-success');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('btn-success');
            }, 1500);
        }
    }).catch(err => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showMessage('已复制到剪贴板', 'success');
        } catch (e) {
            showMessage('复制失败，请手动复制', 'error');
        }
        document.body.removeChild(textarea);
    });
}

/**
 * 下载文件
 * @param {string} content - 文件内容
 * @param {string} filename - 文件名
 * @param {string} mimeType - MIME类型
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage(`文件 "${filename}" 已下载`, 'success');
}

/**
 * 下载Base64图片
 * @param {string} base64Data - Base64数据
 * @param {string} filename - 文件名
 */
function downloadBase64Image(base64Data, filename) {
    const a = document.createElement('a');
    a.href = base64Data;
    a.download = filename || 'image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showMessage('图片已下载', 'success');
}

/**
 * 显示消息提示
 * @param {string} message - 消息内容
 * @param {string} type - 类型：success/error
 */
function showMessage(message, type) {
    // 移除已有的消息
    const existing = document.querySelector('.toast-message');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = `toast-message ${type === 'success' ? 'success-message' : 'error-message'}`;
    div.textContent = message;
    div.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 0.95rem;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: fadeIn 0.2s ease;
    `;

    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2500);
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 检查密码强度
 * @param {string} password - 密码
 * @returns {string} - weak/medium/strong
 */
function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
}

/**
 * 生成随机密码
 * @param {number} length - 长度
 * @param {Object} options - 选项
 */
function generatePassword(length, options) {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (options.lower) chars += lower;
    if (options.upper) chars += upper;
    if (options.number) chars += numbers;
    if (options.symbol) chars += symbols;

    if (!chars) chars = lower;

    let password = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
    }
    return password;
}

/**
 * 高亮JSON字符串
 * @param {string} json - JSON字符串
 */
function highlightJSON(json) {
    return json
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/(".*?")(\s*:\s*)/g, '<span class="json-key">$1</span>$2')
        .replace(/: "(.*?)"/g, ': <span class="json-string">"$1"</span>')
        .replace(/: (\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
        .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
        .replace(/: (null)/g, ': <span class="json-null">$1</span>');
}

/**
 * 简单的行对比算法
 * @param {string} textA - 文本A
 * @param {string} textB - 文本B
 */
function diffText(textA, textB) {
    const linesA = textA.split('\n');
    const linesB = textB.split('\n');
    const resultA = [];
    const resultB = [];

    let i = 0, j = 0;
    while (i < linesA.length || j < linesB.length) {
        if (i >= linesA.length) {
            resultB.push({ type: 'added', text: linesB[j] });
            j++;
        } else if (j >= linesB.length) {
            resultA.push({ type: 'removed', text: linesA[i] });
            i++;
        } else if (linesA[i] === linesB[j]) {
            resultA.push({ type: 'same', text: linesA[i] });
            resultB.push({ type: 'same', text: linesB[j] });
            i++; j++;
        } else {
            // 简单匹配：如果下一行能匹配，则当前行是删除/新增
            const nextMatchA = j + 1 < linesB.length && linesA[i] === linesB[j + 1];
            const nextMatchB = i + 1 < linesA.length && linesA[i + 1] === linesB[j];

            if (nextMatchA && !nextMatchB) {
                resultB.push({ type: 'added', text: linesB[j] });
                j++;
            } else if (nextMatchB && !nextMatchA) {
                resultA.push({ type: 'removed', text: linesA[i] });
                i++;
            } else {
                resultA.push({ type: 'removed', text: linesA[i] });
                resultB.push({ type: 'added', text: linesB[j] });
                i++; j++;
            }
        }
    }

    return { resultA, resultB };
}

/**
 * 渲染差异结果
 * @param {Array} diff - 差异数组
 * @param {HTMLElement} container - 容器元素
 */
function renderDiff(diff, container) {
    container.innerHTML = diff.map(line => {
        const escaped = line.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        if (line.type === 'removed') return `<div class="diff-removed">- ${escaped || ' '}</div>`;
        if (line.type === 'added') return `<div class="diff-added">+ ${escaped || ' '}</div>`;
        return `<div>${escaped || ' '}</div>`;
    }).join('');
}

/**
 * HEX转RGB
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * RGB转HEX
 */
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = Math.max(0, Math.min(255, x)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

/**
 * RGB转HSL
 */
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

/**
 * HSL转RGB
 */
function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// ===== 流量统计（全站生效）=====
// 部署后，把下面引号里换成你的 51.la 统计 ID（官网 sdk.51.la 注册，无需 ICP 备案），
// 全站所有页面会自动加载统计，无需逐个修改页面。留空则不加统计。
window.SITE_ANALYTICS_ID = '3Qcg75RJeJ8BQX6c'; // 例如 '3xAbC123xxxx'
function loadAnalytics() {
    const id = window.SITE_ANALYTICS_ID;
    if (!id) return;
    const s = document.createElement('script');
    s.charset = 'UTF-8';
    s.id = 'LA_COLLECT';
    s.src = '//sdk.51.la/js-sdk-pro.min.js';
    document.head.appendChild(s);
    const init = document.createElement('script');
    init.textContent = 'LA.init({id:"' + id + '",ck:"' + id + '",autoTrack:true})';
    document.head.appendChild(init);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 当前年份
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    // 流量统计
    loadAnalytics();
});


/**
 * 移动端菜单开关：切换导航的展开/收起
 */
function toggleMenu() {
    const nav = document.getElementById('navLinks');
    if (nav) nav.classList.toggle('open');
}
