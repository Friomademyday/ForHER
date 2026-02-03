const canvas = document.getElementById('atomCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-journey');
const overlay = document.getElementById('overlay');
const content = document.getElementById('content');
const meterFill = document.getElementById('meter-fill');
const percentageText = document.getElementById('percentage');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let atoms = [];

class Atom {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
    }
}

function initAtoms() {
    for (let i = 0; i < 150; i++) {
        atoms.push(new Atom());
    }
}

function connectAtoms() {
    for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
            const dx = atoms[i].x - atoms[j].x;
            const dy = atoms[i].y - atoms[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(atoms[i].x, atoms[i].y);
                ctx.lineTo(atoms[j].x, atoms[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    atoms.forEach(atom => {
        atom.update();
        atom.draw();
    });
    connectAtoms();
    requestAnimationFrame(animate);
}

startBtn.addEventListener('click', () => {
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        content.classList.remove('hidden');
    }, 2000);
});

window.addEventListener('scroll', () => {
    const texts = document.querySelectorAll('.letter-text');
    const triggerBottom = window.innerHeight / 5 * 4;

    texts.forEach(text => {
        const textTop = text.getBoundingClientRect().top;
        if (textTop < triggerBottom) {
            text.classList.add('visible');
        }
    });

    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const scrollPercent = (scrolled / scrollTotal) * 130;
    
    if (scrollPercent <= 130) {
        meterFill.style.width = scrollPercent + '%';
        percentageText.innerText = Math.floor(scrollPercent) + '%';
    }
});

initAtoms();
animate();
