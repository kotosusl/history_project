<template>
  <section id="hero" class="hero">
    <div class="radiation-bg"></div>
    <div class="hero-content">
      <div class="hero-text" ref="heroTextRef">
        <div class="date-badge">26 апреля 1986 года</div>
        <h1 class="title">Чернобыльская катастрофа</h1>
        <div class="subtitle-container">
          <span class="subtitle">{{ typedText }}</span>
          <span class="cursor">|</span>
        </div>
        <p class="description">
          Крупнейшая техногенная катастрофа в истории человечества, изменившая мир навсегда
        </p>
        <div class="hero-buttons">
          <button class="btn btn-primary" @click="scrollToSection('facts')">
            Предпосылки
          </button>
          <button class="btn btn-outline" @click="scrollToSection('consequences')">
            Последствия
          </button>
        </div>
      </div>
      <div class="hero-image" ref="heroImageRef">
        <div class="reactor-container">
          <div class="reactor">
            <span class="reactor-icon">☢️</span>
            <div class="radiation-rings">
              <div class="ring ring-1"></div>
              <div class="ring ring-2"></div>
              <div class="ring ring-3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="scroll-indicator" @click="scrollToSection('facts')">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <p>Узнать подробнее</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const typedText = ref<string>('')
const fullText: string = 'Трагедия, которую нельзя забыть'
const heroTextRef = ref<HTMLElement | null>(null)
const heroImageRef = ref<HTMLElement | null>(null)

const emit = defineEmits<{
  (e: 'open-modal', data: { title: string; content: string[]; icon: string }): void
}>()

const typeText = (): void => {
  let index = 0
  const interval = window.setInterval(() => {
    if (index < fullText.length) {
      typedText.value += fullText.charAt(index)
      index++
    } else {
      clearInterval(interval)
    }
  }, 80)
}

const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  typeText()
  
  setTimeout(() => {
    if (heroTextRef.value) {
      heroTextRef.value.style.opacity = '1'
      heroTextRef.value.style.transform = 'translateY(0)'
    }
  }, 500)
  
  setTimeout(() => {
    if (heroImageRef.value) {
      heroImageRef.value.style.opacity = '1'
      heroImageRef.value.style.transform = 'translateY(0)'
    }
  }, 800)
})
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem 2rem;
  position: relative;
  overflow: hidden;
}

.radiation-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 50%, rgba(255, 107, 26, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
  animation: bgPulse 4s ease-in-out infinite;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
}

.date-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 107, 26, 0.1);
  border: 1px solid rgba(255, 107, 26, 0.3);
  border-radius: 50px;
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ff6b1a, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.subtitle-container {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  min-height: 2rem;
  display: flex;
  align-items: center;
  gap: 2px;
}

.subtitle {
  color: var(--secondary);
  font-weight: 600;
}

.cursor {
  color: var(--secondary);
  animation: blink 1s infinite;
}

.description {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 500px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
}

.btn-primary {
  background: linear-gradient(135deg, #ff6b1a, #cc5500);
  color: white;
  border: none;
  box-shadow: 0 5px 15px rgba(255, 107, 26, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 26, 0.5);
}

.btn-outline {
  border: 2px solid var(--primary);
  color: var(--primary);
  background: transparent;
}

.btn-outline:hover {
  background: var(--primary);
  color: white;
}

.hero-image {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.reactor-container {
  position: relative;
  width: 350px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reactor {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reactor-icon {
  font-size: 8rem;
  position: relative;
  z-index: 2;
  animation: reactorFloat 3s ease-in-out infinite;
}

.radiation-rings {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring {
  position: absolute;
  border: 2px solid rgba(255, 107, 26, 0.3);
  border-radius: 50%;
  animation: ringExpand 3s ease-out infinite;
}

.ring-1 { width: 150px; height: 150px; animation-delay: 0s; }
.ring-2 { width: 250px; height: 250px; animation-delay: 1s; }
.ring-3 { width: 350px; height: 350px; animation-delay: 2s; }

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  cursor: pointer;
  z-index: 1;
  transition: all 0.3s ease;
}

.scroll-indicator:hover {
  transform: translateX(-50%) translateY(5px);
}

.mouse {
  width: 25px;
  height: 40px;
  border: 2px solid var(--text-muted);
  border-radius: 15px;
  margin: 0 auto 0.5rem;
  position: relative;
}

.wheel {
  width: 3px;
  height: 8px;
  background: var(--text-muted);
  border-radius: 2px;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  animation: scroll 2s infinite;
}

.scroll-indicator p {
  font-size: 0.8rem;
  color: var(--text-muted);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes reactorFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(5deg); }
  75% { transform: translateY(-10px) rotate(-5deg); }
}

@keyframes ringExpand {
  0% {
    opacity: 1;
    transform: scale(0.5);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}

@keyframes bgPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes scroll {
  0% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(15px); }
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  
  .hero-text {
    order: 2;
  }
  
  .hero-image {
    order: 1;
  }
  
  .title {
    font-size: 2.5rem;
  }
  
  .description {
    margin: 0 auto 2rem;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .reactor-container {
    width: 250px;
    height: 250px;
  }
  
  .reactor-icon {
    font-size: 6rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }
  
  .subtitle-container {
    font-size: 1.2rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>