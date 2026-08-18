// Advanced Early Childhood Cognitive Assessment & Radar Intelligence Engine
// Based on Gardner's Multiple Intelligences, Raven's Matrices, and Piagetian Early Stages - ZERO EMOJIS
window.IQAssessment = (function() {
    const STORAGE_KEY = 'parvaresh_hoosh_iq_v3';

    // 6 Core Cognitive Dimensions (Clean text without emojis)
    const DOMAINS = {
        logic: { id: 'logic', title: 'استدلال منطقی و حل مسئله', short: 'منطق و الگو', color: '#A29BFE' },
        spatial: { id: 'spatial', title: 'هوش فضایی و تجسم هندسی', short: 'تجسم فضایی', color: '#00D2D3' },
        memory: { id: 'memory', title: 'حافظه فعال و تمرکز شناختی', short: 'حافظه و تمرکز', color: '#FF763B' },
        math: { id: 'math', title: 'هوش عددی و درک ریاضی', short: 'حس عدد و حساب', color: '#4ECDC4' },
        verbal: { id: 'verbal', title: 'هوش کلامی و آواشناسی', short: 'زبان و الفبا', color: '#FF6B6B' },
        science_socio: { id: 'science_socio', title: 'کشف محیط و هوش هیجانی', short: 'علوم و احساسات', color: '#F9CA24' }
    };

    let state = {
        records: {},
        lastUpdated: Date.now()
    };

    function load() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) state = JSON.parse(data);
        } catch (e) {}

        Object.keys(DOMAINS).forEach(key => {
            if (!state.records[key]) {
                state.records[key] = {
                    score: 65,
                    attempts: 0,
                    correct: 0,
                    history: [],
                    level: 1
                };
            }
        });
    }

    function persist() {
        try {
            state.lastUpdated = Date.now();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {}
    }

    function resolveDimension(domainOrType) {
        switch (domainOrType) {
            case 'reading':
            case 'verbal': return 'verbal';
            case 'math': return 'math';
            case 'logic':
            case 'raven': return 'logic';
            case 'spatial':
            case 'shadow':
            case 'jigsaw': return 'spatial';
            case 'memory':
            case 'simon':
            case 'disappeared':
            case 'focus': return 'memory';
            case 'science':
            case 'socio-emotional':
            case 'art':
            default: return 'science_socio';
        }
    }

    function recordTrial(domainOrType, isCorrect, responseTimeMs) {
        const dimKey = resolveDimension(domainOrType);
        const record = state.records[dimKey];
        if (!record) return;

        record.attempts++;
        if (isCorrect) record.correct++;

        const delta = isCorrect ? 3.5 : -2.5;
        record.score = Math.max(40, Math.min(100, record.score + delta));

        if (isCorrect && record.score >= 80 && record.level < 8) {
            record.level++;
        }

        record.history.push({
            t: Date.now(),
            correct: isCorrect,
            speed: responseTimeMs || 3000
        });

        if (record.history.length > 50) record.history.shift();
        persist();
    }

    function getReport() {
        const dimensions = [];
        let totalScore = 0;

        Object.keys(DOMAINS).forEach(key => {
            const def = DOMAINS[key];
            const rec = state.records[key];
            const score = Math.round(rec.score);
            totalScore += score;

            let status = 'سطح پایه‌ای';
            let badgeColor = '#95A5A6';
            let advice = 'با تمرین‌های روزانه ۵ دقیقه‌ای به رشد چشمگیر می‌رسد.';

            if (score >= 85) {
                status = 'استعداد درخشان';
                badgeColor = '#00B894';
                advice = 'درک سریع و هوش سرشار در این زمینه؛ آماده برای پازل‌های پیچیده‌تر.';
            } else if (score >= 70) {
                status = 'رشد عالی و متناسب';
                badgeColor = '#0984E3';
                advice = 'مهارت در حال تثبیت است؛ با تشویق مداوم توانایی‌هایش شکوفا می‌شود.';
            } else if (score >= 55) {
                status = 'در حال یادگیری';
                badgeColor = '#F39C12';
                advice = 'توصیه می‌شود فعالیت‌های این بخش با همراهی والد در قالب بازی مرور شود.';
            } else {
                status = 'نیازمند همراهی و تمرین';
                badgeColor = '#E74C3C';
                advice = 'تمرین‌های حسی و عینی به ایجاد درک عمیق‌تر کمک می‌کند.';
            }

            dimensions.push({
                id: def.id,
                title: def.title,
                short: def.short,
                color: def.color,
                score,
                level: rec.level,
                attempts: rec.attempts,
                status,
                badgeColor,
                advice
            });
        });

        const overallIQ = Math.round(totalScore / dimensions.length);

        let estimatedMentalAge = '۵ الی ۵.۵ سال';
        let headline = 'روند رشد شناختی متعادل و فعال';

        if (overallIQ >= 85) {
            estimatedMentalAge = '۶.۵ الی ۷ سال (پیشرفته‌تر از میانگین)';
            headline = 'هوش سرشار و کنجکاوی فوق‌العاده در پردازش اطلاعات';
        } else if (overallIQ >= 72) {
            estimatedMentalAge = '۵.۵ الی ۶ سال (کاملاً متناسب و پویا)';
            headline = 'هوش و یادگیری فعال و روبه‌رشد در تمام حوزه‌ها';
        } else if (overallIQ >= 60) {
            estimatedMentalAge = '۴.۵ الی ۵ سال (در حال شکل‌گیری پایه‌ها)';
            headline = 'علاقه‌مند به بازی و نیازمند تکرار شیرین روزانه';
        }

        return {
            overallIQ,
            estimatedMentalAge,
            headline,
            dimensions
        };
    }

    function drawRadarChart(canvas) {
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) * 0.72;

        const report = getReport();
        const dims = report.dimensions;
        const numAxes = dims.length;
        const angleStep = (Math.PI * 2) / numAxes;

        // Concentric webs
        const levels = [0.25, 0.5, 0.75, 1.0];
        levels.forEach(lvl => {
            ctx.beginPath();
            for (let i = 0; i < numAxes; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + Math.cos(angle) * (radius * lvl);
                const y = centerY + Math.sin(angle) * (radius * lvl);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = lvl === 1.0 ? '#D6D0FB' : '#EFEAFC';
            ctx.lineWidth = lvl === 1.0 ? 2 : 1.5;
            ctx.stroke();
        });

        // Spokes
        for (let i = 0; i < numAxes; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#D6D0FB';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            const labelDist = radius + 22;
            const lx = centerX + Math.cos(angle) * labelDist;
            const ly = centerY + Math.sin(angle) * labelDist;

            ctx.font = 'bold 12px Vazirmatn, sans-serif';
            ctx.fillStyle = '#2D3436';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(dims[i].short, lx, ly);
        }

        // Polygon
        ctx.beginPath();
        const points = [];
        dims.forEach((d, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const ratio = (d.score - 20) / 80;
            const currentR = Math.max(radius * 0.25, radius * Math.min(1.0, ratio));
            const x = centerX + Math.cos(angle) * currentR;
            const y = centerY + Math.sin(angle) * currentR;
            points.push({ x, y, color: d.color, score: d.score });

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();

        const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
        grad.addColorStop(0, 'rgba(108, 92, 231, 0.45)');
        grad.addColorStop(1, 'rgba(0, 210, 211, 0.25)');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = '#6C5CE7';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 3;
            ctx.stroke();
        });
    }

    load();
    return {
        recordTrial,
        getReport,
        drawRadarChart,
        DOMAINS
    };
})();
