<template>
  <section id="facts" class="facts">
    <div class="container">
      <h2 class="section-title">Предпосылки катастрофы</h2>
      <p class="section-subtitle">Нажмите на карточку, чтобы узнать подробнее</p>
      <div class="facts-grid">
        <div class="fact-card" 
             v-for="fact in facts" 
             :key="fact.id"
             ref="factCardsRef"
             @click="openFactModal(fact)">
          <div class="fact-icon">{{ fact.icon }}</div>
          <div class="fact-period">{{ fact.period }}</div>
          <h3 class="fact-title">{{ fact.title }}</h3>
          <p class="fact-description">{{ fact.description }}</p>
          <button class="fact-details-btn">Подробнее →</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Fact } from '../types'

interface Props {
  facts: Fact[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'open-modal', data: { title: string; content: string[]; icon: string }): void
}>()

const factCardsRef = ref<HTMLElement[]>([])

const openFactModal = (fact: Fact) => {
  emit('open-modal', {
    title: fact.title,
    content: fact.details,
    icon: fact.icon
  })
}

onMounted(() => {
  const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          const target = entry.target as HTMLElement
          target.style.opacity = '1'
          target.style.transform = 'translateY(0)'
        }, index * 150)
      }
    })
  }, { threshold: 0.1 })
  
  factCardsRef.value.forEach(card => {
    if (card) observer.observe(card)
  })
})
</script>

<style scoped>
.facts {
  padding: 5rem 2rem;
  background: var(--dark);
  position: relative;
}

.facts::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 107, 26, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.03) 0%, transparent 50%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--primary);
  text-shadow: var(--radiation-glow);
}

.section-subtitle {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.fact-card {
  background: var(--dark-secondary);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 107, 26, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.fact-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ff6b1a, #ffd700);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.fact-card:hover::before {
  transform: scaleX(1);
}

.fact-card:hover {
  transform: translateY(-5px) !important;
  border-color: rgba(255, 107, 26, 0.3);
  box-shadow: 0 10px 30px rgba(255, 107, 26, 0.15);
}

.fact-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.fact-period {
  display: inline-block;
  padding: 0.3rem 1rem;
  background: rgba(255, 107, 26, 0.1);
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--primary);
  margin-bottom: 1rem;
}

.fact-title {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: var(--text);
}

.fact-description {
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.fact-details-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.fact-details-btn:hover {
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .facts-grid {
    grid-template-columns: 1fr;
  }
}
</style>