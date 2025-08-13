import { createSignal } from 'solid-js'
import './App.css'
import EndlessRoad from './components/EndlessRoad'
import MemoryTimeCapsule from './components/MemoryTimeCapsule'

function App() {
  const [currentView, setCurrentView] = createSignal<'road' | 'capsule'>('road')

  return (
    <div class="app">
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
