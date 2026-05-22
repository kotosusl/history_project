<template>
  <section id="map" class="map-section">
    <div class="container">
      <h2 class="section-title">Карта радиоактивного загрязнения</h2>
      <p class="section-subtitle">Распространение радионуклидов после аварии</p>

      <!-- Интерактивная карта -->
      <div class="map-container" ref="mapContainerRef">
        <div class="map-wrapper">
          <!-- Схематическая карта -->
          <div class="schematic-map">
            <div class="map-background">
            <img :src="mapImage" class="map-bg-image" alt="Карта загрязнений" />
              <div class="map-grid"></div>
              
              <!-- Зоны загрязнения -->
              <div class="zone zone-exclusion" 
                   :style="{ opacity: zoneOpacity.exclusion }">
                <div class="zone-label"></div>
              </div>
              <div class="zone zone-high" 
                   :style="{ opacity: zoneOpacity.high }">
                <div class="zone-label"></div>
              </div>
              <div class="zone zone-medium" 
                   :style="{ opacity: zoneOpacity.medium }">
                <div class="zone-label"></div>
              </div>
              <div class="zone zone-low" 
                   :style="{ opacity: zoneOpacity.low }">
                <div class="zone-label"></div>
              </div>

              <!-- Маркеры -->
              <div 
                v-for="marker in hotSpots" 
                :key="marker.id"
                class="map-marker"
                :style="{ left: marker.x + '%', top: marker.y + '%' }"
                @click="selectLocation(marker.id)">
                <div class="marker-dot" :class="{ pulse: marker.id === 'chernobyl' }"
                     :style="{ background: marker.color }"></div>
                <div class="marker-tooltip" :class="{ active: selectedLocation === marker.id }">
                  <strong>{{ marker.shortName }}</strong>
                  <span>{{ marker.level }}</span>
                </div>
              </div>

              <!-- Направление ветра -->
              <div class="wind-direction">
  <svg width="100%" height="100%" viewBox="0 0 350 300" preserveAspectRatio="xMaxYMax meet">
    <defs>
      <marker id="arrNW" markerWidth="12" markerHeight="8" refX="12" refY="4" orient="auto">
        <polygon points="0 0, 12 4, 0 8" fill="rgba(255, 180, 80, 0.7)"/>
      </marker>
      <marker id="arrW" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255, 200, 120, 0.5)"/>
      </marker>
      <marker id="arrSW" markerWidth="9" markerHeight="6" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 9 3, 0 6" fill="rgba(255, 220, 160, 0.35)"/>
      </marker>
      
      <!-- Градиенты -->
      <linearGradient id="gradNW" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" style="stop-color:rgba(255,180,80,0.7);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgba(255,180,80,0.1);stop-opacity:1" />
      </linearGradient>
      <linearGradient id="gradW" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" style="stop-color:rgba(255,200,120,0.6);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgba(255,200,120,0.06);stop-opacity:1" />
      </linearGradient>
      <linearGradient id="gradSW" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:rgba(255,220,160,0.45);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgba(255,220,160,0.05);stop-opacity:1" />
      </linearGradient>
    </defs>

    
    <!-- Северо-запад (дуга вверх-влево) -->
    <path d="M 180 160 Q 140 100, 70 50" 
          stroke="url(#gradNW)" 
          stroke-width="3.5" 
          stroke-linecap="round"
          fill="none" 
          marker-end="url(#arrNW)"
          class="wind-arrow arrow-nw"/>
    
    <!-- Запад (прямая влево) -->
    <path d="M 180 160 Q 130 160, 70 160" 
          stroke="url(#gradW)" 
          stroke-width="3" 
          stroke-linecap="round"
          fill="none" 
          marker-end="url(#arrW)"
          class="wind-arrow arrow-w"/>
    
    <!-- Юго-запад (дуга вниз-влево) -->
    <path d="M 180 160 Q 140 220, 70 270" 
          stroke="url(#gradSW)" 
          stroke-width="2.5" 
          stroke-linecap="round"
          fill="none" 
          marker-end="url(#arrSW)"
          class="wind-arrow arrow-sw"/>
    
   
    <!-- Пояснительная подпись -->
    <text x="270" y="130" fill="rgba(255,255,255,0.3)" font-size="13" text-anchor="middle" font-family="Inter, sans-serif">
      Направления ветра
    </text>
  </svg>
  
  </div>
            </div>
          </div>

          <!-- Легенда -->
          <div class="map-legend">
            <h4>Уровни загрязнения цезием-137</h4>
            <div class="legend-items">
              <div class="legend-item">
                <span class="legend-color" style="background: rgba(255, 0, 0, 0.4);"></span>
                <span>Зона отчуждения (&gt;1480 кБк/м²)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: rgba(255, 107, 26, 0.3);"></span>
                <span>Высокое (555-1480 кБк/м²)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: rgba(255, 170, 0, 0.3);"></span>
                <span>Среднее (185-555 кБк/м²)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: rgba(255, 215, 0, 0.2);"></span>
                <span>Низкое (37-185 кБк/м²)</span>
              </div>
            </div>
            <h4 style="margin-top: 1.5rem;">Горячие точки</h4>
            <div class="legend-items">
              <div class="legend-item" v-for="spot in hotSpotsLegend" :key="spot.label">
                <span class="legend-dot" :style="{ background: spot.color }"></span>
                <span class="legend-dot-label">{{ spot.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Информационная панель -->
        <div class="info-panel" :class="{ active: selectedLocation }">
          <div v-if="!selectedLocation || !selectedSpotData" class="info-placeholder">
            <span class="info-icon">👆</span>
            <p>Нажмите на маркер для получения подробной информации</p>
          </div>
          <div v-else class="info-content">
            <h3>{{ selectedSpotData.fullName }}</h3>
            <div class="info-badge" :style="{ background: selectedSpotData.color }">
              {{ selectedSpotData.category }}
            </div>
            <div class="info-stats">
              <div class="info-stat">
                <span class="stat-label">Изотоп</span>
                <span class="stat-value">{{ selectedSpotData.isotope }}</span>
              </div>
              <div class="info-stat">
                <span class="stat-label">Уровень</span>
                <span class="stat-value">{{ selectedSpotData.level }}</span>
              </div>
              <div class="info-stat">
                <span class="stat-label">Координаты</span>
                <span class="stat-value">{{ selectedSpotData.coordinates }}</span>
              </div>
              <div class="info-stat">
                <span class="stat-label">Период</span>
                <span class="stat-value">{{ selectedSpotData.period }}</span>
              </div>
            </div>
            <p class="info-description">{{ selectedSpotData.description }}</p>
            <div v-if="selectedSpotData.consequences" class="info-consequences">
              <h4>Последствия:</h4>
              <p>{{ selectedSpotData.consequences }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Карта Европы -->
      <div class="europe-map-section">
        <h3 class="subsection-title">
          <span class="icon">🌍</span>
          Распространение по Европе
        </h3>
        <div class="countries-grid">
          <div class="country-card" 
               v-for="country in countries" 
               :key="country.name"
               :style="{ '--contamination-color': country.color }"
               ref="countryCardsRef">
            <div class="country-header">
              <h4>{{ country.name }}</h4>
              <div class="contamination-bar">
                <div class="contamination-fill" 
                     :style="{ width: country.contamination + '%' }">
                </div>
              </div>
            </div>
            <div class="contamination-level">
              Загрязнение: {{ country.contamination }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import mapImage from '../assets/map.jpg'

interface LocationInfo {
  title: string
  stats: { label: string; value: string }[]
  description: string
}

interface CountryInfo {
  name: string
  contamination: number
  color: string
}

interface HotSpot {
  id: string
  fullName: string
  shortName: string
  x: number
  y: number
  color: string
  level: string
  isotope: string
  coordinates: string
  period: string
  category: string
  description: string
  consequences?: string
}

interface CountryInfo {
  name: string
  contamination: number
  color: string
  detail: string
}


const mapContainerRef = ref<HTMLElement | null>(null)
const countryCardsRef = ref<HTMLElement[]>([])

const selectedLocation = ref<string>('')

const zoneOpacity = ref({
  exclusion: 0,
  high: 0,
  medium: 0,
  low: 0
})


const hotSpots: HotSpot[] = [
  {
    id: 'chernobyl',
    fullName: 'Чернобыльская АЭС (30-км зона)',
    shortName: 'ЧАЭС',
    x: 77,
    y: 50,
    color: '#ff0000',
    level: 'до 15 мР/час (затем ↓ до трети)',
    isotope: 'Cs-137, I-131, Sr-90',
    coordinates: '51.3°N, 30.0°E',
    period: '26 апреля 1986',
    category: 'Эпицентр',
    description: 'Эпицентр аварии. Изначально уровень радиации достигал 15 миллирентген/час. По данным документов КГБ 1982 года, "горячие частицы" размером 10-20 микрон фиксировались в районе ещё до аварии 1986 года.',
    consequences: 'Создана 30-километровая зона отчуждения. Эвакуировано более 350 000 человек.'
  },
  {
    id: 'chistogalovka',
    fullName: 'Чистогаловка (Украина)',
    shortName: 'Чистогаловка',
    x: 76.5,
    y: 52,
    color: '#ff3300',
    level: '"Горячие частицы" 10-20 мкм',
    isotope: 'Cs-137, Pu-239',
    coordinates: '51.5°N, 29.5°E',
    period: '1982-1986',
    category: 'Предварительное загрязнение',
    description: 'Согласно рассекреченным документам КГБ, "горячие частицы" размером 10-20 микрон фиксировались в Чистогаловке ещё в 1982 году — за 4 года до катастрофы.',
    consequences: 'Свидетельство систематических проблем с безопасностью на ЧАЭС задолго до аварии.'
  },
  {
    id: 'sweden-uppland',
    fullName: 'Северный Уппланд / Гёстрикланд (Швеция)',
    shortName: 'Уппланд',
    x: 49,
    y: 32,
    color: '#ff4400',
    level: '100 ед/сек (норма: 4)',
    isotope: 'Cs-137, I-131',
    coordinates: '60.5°N, 17.0°E',
    period: '28 апреля 1986',
    category: 'Наивысшие выпадения в Европе',
    description: 'Самые высокие уровни выпадений за пределами СССР. На АЭС Форсмарк (в 4 км) датчики показали 100 единиц/сек вместо обычных 4, что привело к обнаружению аварии.',
    consequences: 'Уничтожено 80% оленей в 1986 году. Долгосрочное загрязнение пастбищ.'
  },
  {
    id: 'poland-masuria',
    fullName: 'Мазурские озёра (Польша)',
    shortName: 'Мазуры',
    x: 57,
    y: 49,
    color: '#ff5500',
    level: 'до 500× нормы',
    isotope: 'I-131, Cs-137',
    coordinates: '53.8°N, 21.5°E',
    period: '28 апреля 1986, утро',
    category: 'Критическое превышение',
    description: 'Утром 28 апреля радиоактивность воздуха превысила норму в 500 раз. Прогнозировалось 10 000 радиационно-индуцированных раковых заболеваний.',
    consequences: 'Долгосрочное превышение Cs-137 в грибах, дичи и рыбе. Запреты на сбор грибов действуют до сих пор.'
  },
  {
    id: 'germany-darmstadt',
    fullName: 'Дармштадт / Бавария (ФРГ)',
    shortName: 'Бавария',
    x: 40,
    y: 59,
    color: '#ff6600',
    level: 'I-131 до 400× нормы',
    isotope: 'I-131',
    coordinates: '49.9°N, 8.6°E',
    period: '29-30 апреля 1986',
    category: 'Пиковые значения',
    description: 'В Дармштадте уровень I-131 достигал 400-кратного превышения нормы. В Берлине — до 120× нормы. Власти рекомендовали детям не спать с открытыми окнами.',
    consequences: 'Массовые запреты на употребление свежих овощей и молока. Паника среди населения.'
  },
  {
    id: 'austria-alps',
    fullName: 'Австрийские Альпы',
    shortName: 'Альпы',
    x: 48,
    y: 68,
    color: '#ff7700',
    level: 'Концентрация осадками',
    isotope: 'Cs-137',
    coordinates: '47.0°N, 13.0°E',
    period: 'Май 1986',
    category: 'Осадки сконцентрировали',
    description: 'Обильные дожди и снег в Альпах сконцентрировали радиоактивные выпадения. Загрязнение носило "пятнистый" характер из-за рельефа.',
    consequences: 'Запрет листовых овощей, шпината, капусты, козьего и овечьего молока, лесных грибов на многие годы.'
  },
  {
    id: 'norway-central',
    fullName: 'Центральная Норвегия',
    shortName: 'Норвегия',
    x: 40,
    y: 26,
    color: '#ff8800',
    level: 'Cs в оленине до 6000 Бк/кг',
    isotope: 'Cs-137',
    coordinates: '62.5°N, 10.0°E',
    period: 'Май-Июнь 1986',
    category: 'Пищевая цепочка',
    description: 'Дожди и снег привели к накоплению цезия в лишайниках, которыми питаются олени. Норматив для оленины повышен до 6000 Бк/кг (обычные продукты — 600 Бк/кг).',
    consequences: 'Уничтожено огромное поголовье оленей. Традиционный уклад саамов подорван.'
  },
  {
    id: 'finland',
    fullName: 'Финляндия',
    shortName: 'Финляндия',
    x: 61,
    y: 23,
    color: '#ffaa00',
    level: '5-7× нормы',
    isotope: 'Cs-137, I-131',
    coordinates: '62.0°N, 26.0°E',
    period: '28 апреля 1986, утро',
    category: 'Умеренное загрязнение',
    description: 'Уровни загрязнения были ниже, чем в Швеции. Утром 28 апреля зафиксировано превышение нормы в 5-7 раз. Ситуацию сравнивали с выпадениями от ядерных испытаний 1960-63 годов.',
    consequences: 'Долгосрочный мониторинг. Ограничения на сбор грибов и ягод в наиболее пострадавших районах.'
  }
]

const countries: CountryInfo[] = [
  { name: 'Беларусь', contamination: 70, color: '#ff4444', detail: 'Наиболее пострадавшая' },
  { name: 'Украина', contamination: 55, color: '#ff6b1a', detail: 'Зона отчуждения' },
  { name: 'Швеция', contamination: 45, color: '#ff3300', detail: 'Наивысшие выпадения в ЕС' },
  { name: 'Польша', contamination: 40, color: '#ff5500', detail: '500× норма в воздухе' },
  { name: 'Германия', contamination: 35, color: '#ff6600', detail: 'I-131 до 400× нормы' },
  { name: 'Австрия', contamination: 30, color: '#ff7700', detail: 'Концентрация в Альпах' },
  { name: 'Норвегия', contamination: 28, color: '#ff8800', detail: 'Оленина до 6000 Бк/кг' },
  { name: 'Россия', contamination: 25, color: '#ff9900', detail: 'Брянская обл.' },
  { name: 'Финляндия', contamination: 20, color: '#ffaa00', detail: '5-7× нормы' },
  { name: 'Молдавия', contamination: 15, color: '#ffcc00', detail: 'По данным МАГАТЭ' }
]

const hotSpotsLegend = [
  { label: 'Эпицентр / зона отчуждения', color: '#ff0000' },
  { label: 'Критическое превышение (100-500×)', color: '#ff4400' },
  { label: 'Высокое загрязнение', color: '#ff6600' },
  { label: 'Умеренное / очаговое', color: '#ff8800' }
]

const selectedSpotData = computed(() => {
  return hotSpots.find(spot => spot.id === selectedLocation.value) || null
})

const selectLocation = (location: string) => {
  selectedLocation.value = selectedLocation.value === location ? '' : location
}

onMounted(() => {
  // Анимация зон на карте
  setTimeout(() => {
    zoneOpacity.value = {
      exclusion: 0.4,
      high: 0.3,
      medium: 0.2,
      low: 0.1
    }
  }, 500)

  // Наблюдатель для карточек стран
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          const target = entry.target as HTMLElement
          target.style.opacity = '1'
          target.style.transform = 'translateY(0)'
        }, index * 100)
      }
    })
  }, { threshold: 0.1 })
  
  countryCardsRef.value.forEach(card => {
    if (card) {
      card.style.opacity = '0'
      card.style.transform = 'translateY(30px)'
      card.style.transition = 'all 0.6s ease'
      observer.observe(card)
    }
  })
})
</script>

<style scoped>

.map-bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
  z-index: 1;
  filter: grayscale(50%) sepia(30%);
}

.map-section {
  padding: 5rem 2rem;
  background: var(--dark);
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
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
  margin-bottom: 4rem;
  font-size: 1.1rem;
}

.subsection-title {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  margin-top: 4rem;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon {
  font-size: 2rem;
}

/* Карта */
.map-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  margin-bottom: 2rem;
}

.map-wrapper {
  background: var(--dark-secondary);
  border-radius: 15px;
  border: 1px solid rgba(255, 107, 26, 0.1);
  overflow: hidden;
}

.schematic-map {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
}

.map-background {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a1a, #2d1f0e);
  position: relative;
  overflow: hidden;
}

.map-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 107, 26, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 107, 26, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
}

.zone {
  position: absolute;
  border-radius: 50%;
  transition: opacity 2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zone-label {
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.zone-exclusion {
  width: 60px;
  height: 60px;
  background: rgba(255, 0, 0, 0.6);
  left: 77%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.zone-high {
  width: 100px;
  height: 100px;
  background: rgba(255, 107, 26, 0.6);
  left: 75%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.zone-medium {
  width: 220px;
  height: 220px;
  background: rgba(255, 170, 0, 0.6);
  left: 69%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.zone-low {
  width: 400px;
  height: 400px;
  background: rgba(255, 215, 0, 0.5);
  left: 60%;
  top: 45%;
  transform: translate(-50%, -50%);
}

.map-marker {
  position: absolute;
  cursor: pointer;
  z-index: 10;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background: var(--primary);
  border-radius: 50%;
  border: 2px solid white;
  transition: transform 0.3s ease;
}

.map-marker:hover .marker-dot {
  transform: scale(1.5);
}

.marker-dot.pulse {
  animation: markerPulse 2s infinite;
}

.marker-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: var(--text);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  border: 1px solid rgba(255, 107, 26, 0.3);
}

.marker-tooltip strong {
  display: block;
  color: var(--primary);
}

.map-marker:hover .marker-tooltip,
.marker-tooltip.active {
  opacity: 1;
}

.wind-direction {
  position: absolute;
  bottom: 35%;
  right: 9%;
  width: clamp(200px, 30%, 350px);  /* Ограничение мин-предпочт-макс */
  height: clamp(200px, 30%, 300px);
  z-index: 3;
  pointer-events: none;
}

.wind-arrow {
  transition: opacity 0.5s ease;
}

.arrow-nw {
  animation: fadeArrow1 3s ease-in-out infinite;
}

.arrow-w {
  animation: fadeArrow2 3s ease-in-out infinite 0.7s;
}

.arrow-sw {
  animation: fadeArrow3 3s ease-in-out infinite 1.4s;
}

.source-pulse {
  animation: sourceGlow 2s ease-in-out infinite;
}

.wind-label {
  position: absolute;
  bottom: -5px;
  right: 0;
  text-align: right;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
}

@keyframes fadeArrow1 {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes fadeArrow2 {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
}

@keyframes fadeArrow3 {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.5; }
}

@keyframes sourceGlow {
  0%, 100% { 
    r: 12;
    opacity: 0.2;
  }
  50% { 
    r: 18;
    opacity: 0.05;
  }
}

@media (max-width: 768px) {
  .wind-direction {
    width: 220px;
    height: 220px;
    bottom: 5%;
    right: 2%;
  }
}
.map-legend {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 107, 26, 0.1);
}

.map-legend h4 {
  color: var(--text);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.legend-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Информационная панель */
.info-panel {
  background: var(--dark-secondary);
  border-radius: 15px;
  border: 1px solid rgba(255, 107, 26, 0.1);
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.info-panel.active {
  border-color: rgba(255, 107, 26, 0.3);
}

.info-placeholder {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem 0;
}

.info-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.info-content h3 {
  color: var(--primary);
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}

.info-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-stat {
  background: rgba(255, 107, 26, 0.05);
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
}

.stat-label {
  display: block;
  color: var(--text-muted);
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
}

.stat-value {
  display: block;
  color: var(--primary);
  font-weight: 700;
  font-size: 1.1rem;
}

.info-description {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.6;
}

/* Карта Европы */
.europe-map-section {
  margin-top: 4rem;
}

.countries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.country-card {
  background: var(--dark-secondary);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 26, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.country-card:hover {
  border-color: var(--contamination-color);
  box-shadow: 0 5px 20px rgba(255, 107, 26, 0.1);
  transform: translateY(-5px) !important;
}

.country-header h4 {
  color: var(--text);
  margin-bottom: 0.8rem;
  font-size: 1rem;
}

.contamination-bar {
  height: 6px;
  background: rgba(255, 107, 26, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.contamination-fill {
  height: 100%;
  background: var(--contamination-color);
  border-radius: 10px;
  transition: width 1.5s ease;
}

.contamination-level {
  color: var(--text-muted);
  font-size: 0.85rem;
}

@keyframes markerPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 107, 26, 0.7);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(255, 107, 26, 0);
  }
}

@keyframes windFlow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .subsection-title {
    font-size: 1.5rem;
  }
  
  .map-container {
    grid-template-columns: 1fr;
  }
  
  .info-panel {
    order: -1;
  }
  
  .legend-items {
    grid-template-columns: 1fr;
  }
  
  .countries-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .schematic-map {
    aspect-ratio: 1/1;
  }
}

@media (max-width: 480px) {
  .countries-grid {
    grid-template-columns: 1fr;
  }
  
  .info-stats {
    grid-template-columns: 1fr;
  }
}
</style>