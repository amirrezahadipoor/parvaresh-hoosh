// Screen navigation manager for "پرورش هوش کودک"
window.Nav = (function() {
    const stack = [];
    let current = null;

    function show(name) {
        const all = document.querySelectorAll('.screen');
        all.forEach(s => s.classList.remove('active'));
        const el = document.getElementById('screen-' + name);
        if (el) el.classList.add('active');
        current = name;
        const body = el ? el.querySelector('.main-content, .lesson-body') : null;
        if (body) body.scrollTop = 0;
        return el;
    }

    function push(name) {
        stack.push(current);
        return show(name);
    }

    function back() {
        const prev = stack.pop() || 'home';
        return show(prev);
    }

    function reset(name) {
        stack.length = 0;
        return show(name);
    }

    return { show, push, back, reset, current: () => current };
})();
