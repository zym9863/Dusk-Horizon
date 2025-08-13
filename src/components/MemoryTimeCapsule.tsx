import { createSignal, createEffect, For } from 'solid-js'
import './MemoryTimeCapsule.css'

interface MemoryCapsule {
  id: string
  title: string
  content: string
  sealedUntil: number
  createdAt: number
  isSealed: boolean
  type: 'text' | 'song' | 'photo'
  songTitle?: string
  photoUrl?: string
}

export default function MemoryTimeCapsule() {
  const [capsules, setCapsules] = createSignal<MemoryCapsule[]>([])
  const [showCreateForm, setShowCreateForm] = createSignal(false)
  const [formData, setFormData] = createSignal({
    title: '',
    content: '',
    type: 'text' as 'text' | 'song' | 'photo',
    songTitle: '',
    sealDays: 30
  })

  // 从localStorage加载胶囊
  createEffect(() => {
    const saved = localStorage.getItem('memory-capsules')
    if (saved) {
      setCapsules(JSON.parse(saved))
    }
  })

  // 保存到localStorage
  createEffect(() => {
    localStorage.setItem('memory-capsules', JSON.stringify(capsules()))
  })

  // 检查胶囊是否到期
  createEffect(() => {
    const interval = setInterval(() => {
      setCapsules(prev => prev.map(capsule => ({
        ...capsule,
        isSealed: Date.now() < capsule.sealedUntil
      })))
    }, 1000)

    return () => clearInterval(interval)
  })

  const createCapsule = () => {
    const data = formData()
    if (!data.title.trim() || !data.content.trim()) return

    const newCapsule: MemoryCapsule = {
      id: `capsule-${Date.now()}`,
      title: data.title,
      content: data.content,
      sealedUntil: Date.now() + (data.sealDays * 24 * 60 * 60 * 1000),
      createdAt: Date.now(),
      isSealed: true,
      type: data.type,
      songTitle: data.type === 'song' ? data.songTitle : undefined
    }

    setCapsules(prev => [...prev, newCapsule])
    setFormData({
      title: '',
      content: '',
      type: 'text',
      songTitle: '',
      sealDays: 30
    })
    setShowCreateForm(false)
  }

  const deleteCapsule = (id: string) => {
    setCapsules(prev => prev.filter(c => c.id !== id))
  }

  const formatTimeRemaining = (sealedUntil: number) => {
    const remaining = sealedUntil - Date.now()
    if (remaining <= 0) return '已解封'
    
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
    
    if (days > 0) return `${days}天${hours}小时`
    if (hours > 0) return `${hours}小时${minutes}分钟`
    return `${minutes}分钟`
  }

  const getCapsuleIcon = (type: string) => {
    switch (type) {
      case 'song': return '🎵'
      case 'photo': return '📷'
      default: return '📝'
    }
  }

  return (
    <div class="memory-time-capsule">
      <div class="capsule-header">
        <h2>往事封存室</h2>
        <p>将过去郑重地封存，给时间一个治愈的机会</p>
        <button 
          class="create-btn"
          onClick={() => setShowCreateForm(true)}
        >
          创建记忆胶囊
        </button>
      </div>

      {showCreateForm() && (
        <div class="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div class="create-form" onClick={(e) => e.stopPropagation()}>
            <h3>创建新的记忆胶囊</h3>
            
            <div class="form-group">
              <label>胶囊标题</label>
              <input
                type="text"
                value={formData().title}
                onInput={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="给这段记忆起个名字..."
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>内容类型</label>
              <div class="type-selector">
                <button
                  class={formData().type === 'text' ? 'type-btn active' : 'type-btn'}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'text' }))}
                >
                  📝 文字
                </button>
                <button
                  class={formData().type === 'song' ? 'type-btn active' : 'type-btn'}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'song' }))}
                >
                  🎵 歌曲
                </button>
              </div>
            </div>

            {formData().type === 'song' && (
              <div class="form-group">
                <label>歌曲名称</label>
                <input
                  type="text"
                  value={formData().songTitle}
                  onInput={(e) => setFormData(prev => ({ ...prev, songTitle: e.target.value }))}
                  placeholder="歌曲名 - 歌手"
                  class="form-input"
                />
              </div>
            )}

            <div class="form-group">
              <label>记忆内容</label>
              <textarea
                value={formData().content}
                onInput={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="写下你想要封存的记忆、感受或想法..."
                class="form-textarea"
                rows="6"
              />
            </div>

            <div class="form-group">
              <label>封存时长</label>
              <select
                value={formData().sealDays}
                onChange={(e) => setFormData(prev => ({ ...prev, sealDays: parseInt(e.target.value) }))}
                class="form-select"
              >
                <option value={7}>7天</option>
                <option value={30}>30天</option>
                <option value={90}>90天</option>
                <option value={365}>一年</option>
              </select>
            </div>

            <div class="form-actions">
              <button class="cancel-btn" onClick={() => setShowCreateForm(false)}>
                取消
              </button>
              <button class="confirm-btn" onClick={createCapsule}>
                封存记忆
              </button>
            </div>
          </div>
        </div>
      )}

      <div class="capsules-grid">
        <For each={capsules()}>
          {(capsule) => (
            <div class={`capsule-card ${capsule.isSealed ? 'sealed' : 'unsealed'}`}>
              <div class="capsule-header-card">
                <span class="capsule-icon">{getCapsuleIcon(capsule.type)}</span>
                <h4 class="capsule-title">{capsule.title}</h4>
                <button 
                  class="delete-btn"
                  onClick={() => deleteCapsule(capsule.id)}
                >
                  ×
                </button>
              </div>
              
              {capsule.isSealed ? (
                <div class="sealed-content">
                  <div class="lock-icon">🔒</div>
                  <p class="seal-message">记忆已封存</p>
                  <p class="time-remaining">
                    还需 {formatTimeRemaining(capsule.sealedUntil)} 解封
                  </p>
                  <div class="seal-date">
                    封存于 {new Date(capsule.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div class="unsealed-content">
                  <div class="unlock-icon">🔓</div>
                  <p class="unseal-message">记忆已解封</p>
                  {capsule.type === 'song' && capsule.songTitle && (
                    <p class="song-title">🎵 {capsule.songTitle}</p>
                  )}
                  <div class="capsule-content">
                    {capsule.content}
                  </div>
                  <div class="unseal-date">
                    解封于 {new Date().toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          )}
        </For>
      </div>

      {capsules().length === 0 && (
        <div class="empty-state">
          <div class="empty-icon">📦</div>
          <p>还没有任何记忆胶囊</p>
          <p>创建第一个胶囊，开始你的情感治愈之旅</p>
        </div>
      )}
    </div>
  )
}