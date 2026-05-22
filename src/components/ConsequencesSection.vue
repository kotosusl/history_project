<template>
  <section id="consequences" class="consequences">
    <div class="container">
      <h2 class="section-title">Последствия</h2>
      <div class="consequences-grid">
        <div class="consequence-card" 
             v-for="item in consequences" 
             :key="item.title"
             ref="cardsRef"
             @click="openModal(item)">
          <div class="card-header">
            <span class="card-icon">{{ item.icon }}</span>
            <span class="card-number">{{ item.number }}</span>
          </div>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-description">{{ item.description }}</p>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-item" v-for="stat in stats" :key="stat.label" ref="statsRef">
          <span class="stat-icon">{{ stat.icon }}</span>
          <span class="stat-value">{{ stat.value.toLocaleString() }}+</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Stat } from '../types'

interface Consequence {
  title: string
  description: string
  icon: string
  number: string
  details: string[]
}

const emit = defineEmits<{
  (e: 'open-modal', data: { title: string; content: string[]; icon: string }): void
}>()

const cardsRef = ref<HTMLElement[]>([])
const statsRef = ref<HTMLElement[]>([])

const consequences: Consequence[] = [
  {
    title: 'Радиактивное загрязнение 21 страны',
    description: 'Облако накрыло Европу, Азию и Северную Америку',
    icon: '🌍',
    number: '01',
    details: [
      '29 апреля 1986 года повышенный радиационный фон был зафиксирован в Польше, Германии, Австрии и Румынии.',
      '30 апреля — в Швейцарии и Северной Италии.',
      '1–2 мая — во Франции, Бельгии, Нидерландах, Великобритании, Северной Греции и Японии.',
      '3 мая — в Израиле, Кувейте и Турции.',
      '4 мая — в Китае.',
      '5–6 мая — в Индии, США и Канаде.',
      'Чернобыль перестал быть локальной аварией и стал глобальной катастрофой. Радиация не признаёт границ.'
    ]
  },
  {
    title: 'Лучевая болезнь у ликвидаторов и пожарных',
    description: 'Десятки человек в тяжёлом состоянии, прогнозируемая смертность',
    icon: '🏥',
    number: '02',
    details: [
      'В результате аварии 204 человека получили дозу облучения, из них восемнадцать находятся в тяжёлом состоянии.',
      'Лучевая болезнь — это не болезнь, это смерть. При дозе 400 бэр (летальность 50%) мучения начинаются через десять дней. Тяжёлые времена для украинцев ещё впереди.',
      'Сотни людей получили острые лучевые поражения. Многие из них умерли в ближайшие недели и месяцы.',
      
    ]
  },
  {
    title: 'Потеря домов 115000 жителей',
    description: '30-километровая зона отчуждения на десятилетия',
    icon: '🏚️',
    number: '03',
    details: [
      'Эвакуировано более 350 000 человек',
      '2 мая было принято решение об отселении населения в радиусе 30 километров от станции. Завершили вывоз людей из этой зоны 6 мая.',
      'Люди навсегда покинули свои дома. Зона отчуждения остаётся необитаемой до сих пор.',
    ]
  },
  {
    title: 'Массовые антиядерные протесты в ЕвропеМиллионы людей вышли на улицы в ФРГ и других странах',
    description: 'Миллионы людей вышли на улицы в ФРГ и других странах',
    icon: '🗣️',
    number: '04',
    details: [
      'В один день в мае 1986 года 400 000 человек вышли на демонстрацию в Бонне, 400 000 — в Гамбурге, 250 000 — в Штутгарте и 100 000 — в Западном Берлине. ',
      'После Чернобыля партия "Зелёных" потребовала немедленного закрытия всех ядерных объектов.',
      'Чернобыль породил мощнейшую волну антиядерных движений, изменив политику целых стран.',
    ]
  },
  {
    title: 'Отказ от строительства АЭС в Польше и Австрии',
    description: 'Страны пересмотрели свои атомные программы',
    icon: '🚫',
    number: '05',
    details: [
      'Строительство польской атомной электростанции "Жарновец" — первой в стране — было отменено под давлением антиядерных протестов в конце 1980-х — начале 1990-х годов.',
      'Авария укрепила уже существовавшие в Австрии антиядерные настроения — страна отказалась от ядерной энергетики ещё в 1978 году по итогам референдума. Чернобыль придал этой позиции дополнительное обоснование.',
      'Чернобыль остановил развитие атомной энергетики в нескольких европейских странах.',
    ]
  },
  {
    title: 'Долгосрочные загрязнения продуктов питания',
    description: 'Цезий-137 остаётся в грибах, дичи и оленине десятилетиями',
    icon: '🍄',
    number: '06',
    details: [
      'В 1986 году первоначальный норвежский норматив содержания бекерелей в оленине был установлен на уровне 600 Бк/кг. В 1987 году для оленины он был повышен до 6000 Бк/кг. В 2016 году наивысший показатель составил 2100 Бк/кг — выше общеевропейского предела в 600 Бк/кг.',
      'В ряде регионов Польши дичь, грибы и рыба из озёр по-прежнему превышают установленные нормы содержания цезия-137.',
      'Радиоактивное загрязнение сохраняется десятилетиями. Период полураспада Cs-137 — около 30 лет.',
    ]
  }
]

const stats: Stat[] = [
  { value: 600000, label: 'Ликвидаторов', icon: '👷' },
  { value: 350000, label: 'Эвакуированных', icon: '🚌' },
  { value: 200000, label: 'км² загрязнено', icon: '🗺️' },
  { value: 30, label: 'км зона отчуждения', icon: '🚫' }
]

const openModal = (item: Consequence) => {
  emit('open-modal', {
    title: item.title + ' последствия',
    content: item.details,
    icon: item.icon
  })
}

onMounted(() => {
  const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement
        target.style.opacity = '1'
        target.style.transform = 'translateY(0)'
      }
    })
  }, { threshold: 0.1 })
  
  cardsRef.value.forEach(card => {
    if (card) {
      card.style.opacity = '0'
      card.style.transform = 'translateY(30px)'
      card.style.transition = 'all 0.6s ease'
      observer.observe(card)
    }
  })
  
  statsRef.value.forEach(stat => {
    if (stat) {
      stat.style.opacity = '0'
      stat.style.transform = 'translateY(30px)'
      stat.style.transition = 'all 0.6s ease'
      observer.observe(stat)
    }
  })
})
</script>

<style scoped>
.consequences {
  padding: 5rem 2rem;
  background: var(--dark);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--primary);
  text-shadow: var(--radiation-glow);
}

.consequences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.consequence-card {
  background: var(--dark-secondary);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 107, 26, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.consequence-card:hover {
  border-color: rgba(255, 107, 26, 0.3);
  box-shadow: 0 10px 30px rgba(255, 107, 26, 0.15);
  transform: translateY(-5px) !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-icon {
  font-size: 2.5rem;
}

.card-number {
  font-size: 2rem;
  font-weight: 800;
  color: rgba(255, 107, 26, 0.2);
  font-family: 'Courier New', monospace;
}

.card-title {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: var(--text);
}

.card-description {
  color: var(--text-muted);
  line-height: 1.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 107, 26, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 107, 26, 0.1);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(255, 107, 26, 0.1);
  border-color: rgba(255, 107, 26, 0.3);
  transform: translateY(-5px) !important;
}

.stat-icon {
  display: block;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 0.3rem;
  text-shadow: var(--radiation-glow);
}

.stat-label {
  display: block;
  color: var(--text-muted);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .consequences-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>