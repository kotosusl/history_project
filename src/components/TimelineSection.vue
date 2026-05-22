<template>
  <section id="timeline" class="timeline">
    <div class="container">
      <h2 class="section-title">Хронология событий</h2>
      <div class="timeline-container">
        <div class="timeline-line"></div>
        <div class="timeline-events">
          <div class="timeline-event" 
               v-for="(event, index) in events" 
               :key="event.year"
               :class="{ 'left': index % 2 === 0, 'right': index % 2 !== 0 }"
               ref="eventRefs">
            <div class="event-content">
              <div class="event-year">{{ event.year }}</div>
              <div class="event-icon">{{ event.icon }}</div>
              <h3 class="event-title">{{ event.title }}</h3>
              <p class="event-description">{{ event.description }}</p>
            </div>
            <div class="event-dot"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TimelineEvent } from '../types'

interface Props {
  events: TimelineEvent[]
}

defineProps<Props>()

const eventRefs = ref<HTMLElement[]>([])

onMounted(() => {
  const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement
        target.style.opacity = '1'
        target.style.transform = 'translateX(0)'
      }
    })
  }, { threshold: 0.2 })
  
  eventRefs.value.forEach(event => {
    if (event) {
      const isLeft = event.classList.contains('left')
      event.style.opacity = '0'
      event.style.transform = isLeft ? 'translateX(-50px)' : 'translateX(50px)'
      event.style.transition = 'all 0.6s ease'
      observer.observe(event)
    }
  })
})
</script>

<style scoped>
.timeline {
  padding: 5rem 2rem;
  background: var(--dark-secondary);
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 4rem;
  color: var(--primary);
  text-shadow: var(--radiation-glow);
}

.timeline-container {
  position: relative;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, transparent, var(--primary), var(--primary), transparent);
  transform: translateX(-50%);
}

.timeline-events {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  position: relative;
}

.timeline-event {
  display: flex;
  align-items: center;
  position: relative;
  opacity: 0;
  transition: all 0.6s ease;
}

.timeline-event.left {
  flex-direction: row;
  padding-right: calc(50% + 3rem);
  text-align: right;
}

.timeline-event.left .event-description {
  text-align: justify;
}

.timeline-event.right .event-description {
  text-align: justify;
}

.timeline-event.right {
  flex-direction: row-reverse;
  padding-left: calc(50% + 3rem);
}

.event-content {
  background: var(--dark);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 26, 0.1);
  flex: 1;
  transition: all 0.3s ease;
}

.event-content:hover {
  border-color: rgba(255, 107, 26, 0.3);
  box-shadow: 0 5px 20px rgba(255, 107, 26, 0.1);
}

.event-year {
  color: var(--primary);
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-family: 'Courier New', monospace;
}

.event-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.event-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text);
}

.event-description {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

.event-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 20px;
  height: 20px;
  background: var(--primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  border: 4px solid var(--dark-secondary);
  box-shadow: var(--radiation-glow);
  z-index: 1;
}

@media (max-width: 768px) {
  .timeline-line {
    left: 2rem;
  }
  
  .timeline-event.left,
  .timeline-event.right {
    flex-direction: row !important;
    padding-left: calc(2rem + 3rem) !important;
    padding-right: 0 !important;
    text-align: left !important;
  }
  
  .event-dot {
    left: 2rem;
  }
  
  .timeline-event {
    opacity: 0;
    transform: translateX(30px) !important;
    transition: all 0.6s ease;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>