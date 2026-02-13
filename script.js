const canvas = document.getElementById('universeCanvas');
const ctx = canvas.getContext('2d');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const speedSlider = document.getElementById('speedSlider');
const speedLabel = document.getElementById('speedLabel');
const planetName = document.getElementById('planetName');
const planetInfo = document.getElementById('planetInfo');

// Resize canvas to fit container
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Planet data
const planets = [
    {
        name: 'Mercury',
        distance: 60,
        size: 3,
        speed: 0.04,
        color: '#C0A080',
        orbitColor: '#444',
        info: 'The smallest planet and closest to the Sun. Mercury has extreme temperatures ranging from 430°C during the day to -180°C at night. It has a thin atmosphere and is named after the Roman messenger god. One day on Mercury equals 59 Earth days!'
    },
    {
        name: 'Venus',
        distance: 100,
        size: 7,
        speed: 0.015,
        color: '#D4A574',
        orbitColor: '#444',
        info: 'The hottest planet with surface temperatures reaching 464°C. Venus has a thick toxic atmosphere of carbon dioxide with sulfuric acid clouds. It is the only planet that rotates backwards. Venus is named after the Roman goddess of love and beauty, and is the brightest planet visible from Earth.'
    },
    {
        name: 'Earth',
        distance: 140,
        size: 7.5,
        speed: 0.01,
        color: '#87CEEB',
        orbitColor: '#444',
        info: 'Our home planet! Earth is the only known planet with life and vast amounts of liquid water. It has a protective magnetic field and a diverse atmosphere containing oxygen. Earth is about 4.5 billion years old and hosts over 8.7 million species of life. Our planet orbits the Sun every 365.25 days.'
    },
    {
        name: 'Mars',
        distance: 180,
        size: 5,
        speed: 0.008,
        color: '#D2B48C',
        orbitColor: '#444',
        info: 'The red planet! Mars has a thin atmosphere and surface temperatures averaging -65°C. It features Olympus Mons, the largest volcano in the solar system, and a giant canyon system called Valles Marineris. Evidence suggests Mars once had liquid water. It is named after the Roman god of war and is a primary target for human exploration.'
    },
    {
        name: 'Jupiter',
        distance: 240,
        size: 20,
        speed: 0.002,
        color: '#DAA520',
        orbitColor: '#444',
        info: 'The largest planet in our solar system! Jupiter is a massive gas giant with a mass greater than all other planets combined. It features the Great Red Spot, a storm larger than Earth that has raged for at least 400 years. Jupiter has 95 known moons, including the large Galilean moons. It has a faint ring system and a powerful magnetic field.'
    },
    {
        name: 'Saturn',
        distance: 290,
        size: 16,
        speed: 0.0009,
        color: '#F4A460',
        orbitColor: '#444',
        info: 'Famous for its spectacular ring system made of ice and rock! Saturn is a gas giant and the second-largest planet. Its rings are composed of billions of particles ranging from tiny specks to house-sized chunks. Saturn has 146 known moons, including the large moon Titan which has a thick atmosphere and liquid methane oceans. Saturn is the lightest planet relative to its size.'
    },
    {
        name: 'Uranus',
        distance: 340,
        size: 10,
        speed: 0.0004,
        color: '#4FD0E7',
        orbitColor: '#444',
        info: 'An ice giant with a unique extreme rotation! Uranus rotates on its side with an axis tilt of 98 degrees, likely due to a collision in the distant past. Its blue-green color comes from methane in its atmosphere. Uranus has a faint ring system and 28 known moons. Surface temperatures drop to -224°C. It takes 84 Earth years to orbit the Sun!'
    },
    {
        name: 'Neptune',
        distance: 390,
        size: 10,
        speed: 0.0001,
        color: '#4166F5',
        orbitColor: '#444',
        info: 'The windiest planet with wind speeds exceeding 2,100 km/h! Neptune is a deep blue ice giant at the edge of our solar system. Its color comes from methane absorption of red light. Neptune was discovered in 1846 through mathematical predictions before being observed. It has 16 known moons and a faint ring system. A year on Neptune equals 165 Earth years!'
    }
];

const sun = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 25,
    color: '#FDB813'
};

let angle = 0;
let isPaused = false;
let speedMultiplier = 1;
let selectedPlanet = null;

// Draw stars background
function drawStars() {
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
        const seed = i * 12321;
        const x = (seed % canvas.width);
        const y = ((seed * 7) % canvas.height);
        const brightness = (seed % 100) / 100;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.8})`;
        ctx.fillRect(x, y, 1, 1);
    }
}

// Draw sun
function drawSun() {
    // Sun glow
    const gradient = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, sun.size * 3);
    gradient.addColorStop(0, 'rgba(253, 184, 19, 0.4)');
    gradient.addColorStop(1, 'rgba(253, 184, 19, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(sun.x - sun.size * 3, sun.y - sun.size * 3, sun.size * 6, sun.size * 6);

    // Sun body
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.size, 0, Math.PI * 2);
    ctx.fillStyle = sun.color;
    ctx.fill();

    // Sun shine
    ctx.strokeStyle = 'rgba(255, 255, 200, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Draw orbit
function drawOrbit(distance) {
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, distance, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(100, 100, 150, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Draw planet
function drawPlanet(planet, x, y) {
    // Planet glow
    const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, planet.size * 2);
    glowGradient.addColorStop(0, planet.color + '40');
    glowGradient.addColorStop(1, planet.color + '00');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(x - planet.size * 2, y - planet.size * 2, planet.size * 4, planet.size * 4);

    // Planet body
    ctx.beginPath();
    ctx.arc(x, y, planet.size, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;
    ctx.fill();

    // Planet shine
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Get planet position
function getPlanetPosition(planet, currentAngle) {
    const x = sun.x + Math.cos(currentAngle) * planet.distance;
    const y = sun.y + Math.sin(currentAngle) * planet.distance;
    return { x, y };
}

// Check if point is on planet
function getPlanetAtPoint(x, y) {
    for (let planet of planets) {
        const pos = getPlanetPosition(planet, angle);
        const distance = Math.hypot(pos.x - x, pos.y - y);
        if (distance < planet.size + 5) {
            return planet;
        }
    }
    return null;
}

// Draw info text for selected planet
function drawSelectedPlanetInfo() {
    if (selectedPlanet) {
        const pos = getPlanetPosition(selectedPlanet, angle);
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(selectedPlanet.name, pos.x, pos.y - selectedPlanet.size - 20);
    }
}

// Main animation loop
function animate() {
    // Clear canvas
    ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background elements
    drawStars();
    drawSun();

    // Update angle if not paused
    if (!isPaused) {
        angle += 0.001 * speedMultiplier;
    }

    // Draw planets
    for (let planet of planets) {
        drawOrbit(planet.distance);
        const pos = getPlanetPosition(planet, angle + planet.speed * angle * speedMultiplier);
        drawPlanet(planet, pos.x, pos.y);
    }

    // Draw selected planet info
    drawSelectedPlanetInfo();

    requestAnimationFrame(animate);
}

// Event listeners
pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
});

resetBtn.addEventListener('click', () => {
    angle = 0;
    isPaused = false;
    pauseBtn.textContent = 'Pause';
    selectedPlanet = null;
    planetName.textContent = 'Select a Planet';
    planetInfo.textContent = 'Click on a planet to learn more about it';
});

speedSlider.addEventListener('input', (e) => {
    speedMultiplier = parseFloat(e.target.value);
    speedLabel.textContent = `Speed: ${speedMultiplier.toFixed(1)}x`;
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    selectedPlanet = getPlanetAtPoint(x, y);
    
    if (selectedPlanet) {
        planetName.textContent = selectedPlanet.name;
        planetInfo.textContent = selectedPlanet.info;
    } else {
        planetName.textContent = 'Select a Planet';
        planetInfo.textContent = 'Click on a planet to learn more about it';
    }
});

// Highlight planet on hover
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const planet = getPlanetAtPoint(x, y);
    canvas.style.cursor = planet ? 'pointer' : 'crosshair';
});

// Start animation
animate();
