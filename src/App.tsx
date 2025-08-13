import { createSignal, onCleanup, onMount } from 'solid-js'
import './App.css'
import EndlessRoad from './components/EndlessRoad'
import MemoryTimeCapsule from './components/MemoryTimeCapsule'

// 星空背景组件
const StarryBackground = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    const canvas = canvasRef!;
    const ctx = canvas.getContext('2d')!;
    let stars: { x: number, y: number, radius: number, alpha: number, velocity: { x: number, y: number } }[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 10000);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.2,
          velocity: {
            x: (Math.random() - 0.5) * 0.2,
            y: (Math.random() - 0.5) * 0.2
          }
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        star.x += star.velocity.x;
        star.y += star.velocity.y;

        if (star.x < 0 || star.x > canvas.width) star.velocity.x = -star.velocity.x;
        if (star.y < 0 || star.y > canvas.height) star.velocity.y = -star.velocity.y;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
      resizeCanvas();
      createStars();
    });

    resizeCanvas();
    createStars();
    animate();

    onCleanup(() => {
      window.removeEventListener('resize', resizeCanvas);
    });
  });

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        'z-index': '-1',
        opacity: '0.7'
      }}
    />
  );
};


function App() {
  const [currentView, setCurrentView] = createSignal<'road' | 'capsule'>('road')

  return (
    <div class="app">
      <StarryBackground />

      <header class="app-header">
        <h1 class="app-title">黄昏地平线</h1>
        <nav class="app-nav">
          <button 
            class={currentView() === 'road' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('road')}
          >
            无尽公路
          </button>
          <button 
            class={currentView() === 'capsule' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('capsule')}
          >
            往事封存
          </button>
        </nav>
      </header>
      
      <main class="app-main">
        {currentView() === 'road' ? <EndlessRoad /> : <MemoryTimeCapsule />}
      </main>
    </div>
  )
}

export default App
