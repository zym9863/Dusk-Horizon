import { createSignal, createEffect, For } from 'solid-js'
import './EndlessRoad.css'

interface Thought {
  id: string
  content: string
  timestamp: number
  speed: number
}

export default function EndlessRoad() {
  const [thoughts, setThoughts] = createSignal<Thought[]>([])
  const [inputValue, setInputValue] = createSignal('')

  // 模拟其他用户的思绪流
  const sampleThoughts = [
    "今晚的月亮很亮，但我心里很暗",
    "想念那个再也不会回来的夏天",
    "有些歌听着听着就哭了",
    "如果时间能倒流该多好",
    "城市那么大，为什么还是觉得孤独",
    "想要一个拥抱，但不知道从谁那里得到",
    "梦里花落知多少",
    "等风来，等你来，等一个不确定的未来"
  ]

  // 定期添加新的思绪
  createEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% 概率添加新思绪
        const randomThought = sampleThoughts[Math.floor(Math.random() * sampleThoughts.length)]
        const newThought: Thought = {
          id: `anonymous-${Date.now()}-${Math.random()}`,
          content: randomThought,
          timestamp: Date.now(),
          speed: 0.5 + Math.random() * 0.5 // 随机速度
        }
        setThoughts(prev => [...prev, newThought].slice(-20)) // 保持最新20条
      }
    }, 3000 + Math.random() * 5000) // 3-8秒随机间隔

    return () => clearInterval(interval)
  })

  const handleSubmit = () => {
    const content = inputValue().trim()
    if (!content) return

    const newThought: Thought = {
      id: `user-${Date.now()}`,
      content,
      timestamp: Date.now(),
      speed: 0.8
    }

    setThoughts(prev => [...prev, newThought])
    setInputValue('')

    // 模拟思绪"驶过"的感觉
    setTimeout(() => {
      setThoughts(prev => prev.filter(t => t.id !== newThought.id))
    }, 8000)
  }

  return (
    <div class="endless-road">
      <div class="road-container">
        <div class="horizon-line"></div>
        
        <div class="thoughts-stream">
          <For each={thoughts()}>
            {(thought) => (
              <div 
                class="thought-bubble"
                style={{
                  'animation-duration': `${10 / thought.speed}s`,
                  'animation-delay': `${Math.random() * 2}s`
                }}
              >
                {thought.content}
              </div>
            )}
          </For>
        </div>

        <div class="input-section">
          <div class="input-container">
            <textarea
              value={inputValue()}
              onInput={(e) => setInputValue(e.target.value)}
              placeholder="在这无尽的公路上，写下此刻的心境..."
              class="thought-input"
              rows="3"
            />
            <button 
              class="submit-btn"
              onClick={handleSubmit}
              disabled={!inputValue().trim()}
            >
              让它驶过
            </button>
          </div>
        </div>
      </div>

      <div class="road-info">
        <p>在这条无尽的公路上，每个人都是匿名的过客</p>
        <p>写下你的心境，然后看着它消失在地平线上</p>
      </div>
    </div>
  )
}