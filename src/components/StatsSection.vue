<template>
  <section id="stats" class="stats">
    <div class="container">
      <h2 class="section-title">Статистика и графики</h2>
      <p class="section-subtitle">Количественные показатели катастрофы</p>

      <!-- Ключевые показатели -->
      <div class="key-metrics">
        <div class="metric-card" v-for="metric in keyMetrics" :key="metric.label">
          <div class="metric-icon">{{ metric.icon }}</div>
          <div class="metric-value">
            <span class="number">{{ metric.displayValue }}</span>
            <span class="unit">{{ metric.unit }}</span>
          </div>
          <div class="metric-label">{{ metric.label }}</div>
        </div>
      </div>

      <!-- Графики -->
      <div class="charts-grid">
        <!-- Столбчатая диаграмма -->
        <div class="chart-card">
          <h3 class="chart-title">📊 Выброс радионуклидов (ПБк)</h3>
          <div class="bar-chart">
            <div class="bar-item" v-for="item in radiationData" :key="item.label">
              <div class="bar-label">
                <span>{{ item.label }}</span>
                <span class="bar-value">{{ item.value }} ПБк</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: (item.value / 1760 * 100) + '%', background: item.color }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Круговая диаграмма -->
        <div class="chart-card">
          <h3 class="chart-title">☢️ Распределение доз облучения</h3>
          <div class="pie-chart-container">
            <div class="simple-pie">
              <div class="pie-segment" 
                   v-for="(item, index) in doseDistribution" 
                   :key="item.label"
                   :style="{ 
                     background: item.color,
                     transform: 'rotate(' + getSegmentRotation(index) + 'deg)',
                     clip: getSegmentClip(index)
                   }">
              </div>
              <div class="pie-center">Дозы</div>
            </div>
            <div class="pie-legend">
              <div class="legend-item" v-for="item in doseDistribution" :key="item.label">
                <span class="legend-color" :style="{ background: item.color }"></span>
                <span class="legend-label">{{ item.label }}</span>
                <span class="legend-value">{{ item.value }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Таблица сравнения -->
        <div class="chart-card full-width">
          <h3 class="chart-title">📋 Сравнение с другими авариями</h3>
          <div class="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Авария</th>
                  <th>Год</th>
                  <th>Уровень INES</th>
                  <th>Выброс</th>
                  <th>Зона отчуждения</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="accident in accidents" :key="accident.name">
                  <td class="accident-name">{{ accident.name }}</td>
                  <td>{{ accident.year }}</td>
                  <td>
                    <span :class="'ines-level ines-' + accident.inesLevel">
                      {{ accident.inesLevel }}
                    </span>
                  </td>
                  <td>{{ accident.release }}</td>
                  <td>{{ accident.zone }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Линейный график (упрощенный) -->
        <div class="chart-card full-width">
          <h3 class="chart-title">📈 Количество стран, обнаруживших радиацию, по дням после аварии</h3>
          <div class="simple-line-chart">
            <div class="chart-bars">
              <div class="chart-bar-item" v-for="item in thyroidData" :key=item.date>
                <div class="bar-value-label">{{ item.value }}</div>
                <div class="bar-container">
                  <div class="bar" :style="{ height: (item.value / 30 * 100) + '%' }"></div>
                </div>
                <div class="bar-year-label">{{ item.date }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const keyMetrics = [
  {
    icon: '☢️',
    displayValue: '5 300',
    unit: 'ПБк',
    label: 'Суммарный выброс'
  },
  {
    icon: '👥',
    displayValue: '600 000',
    unit: 'чел.',
    label: 'Ликвидаторов'
  },
  {
    icon: '🗺️',
    displayValue: '200 000',
    unit: 'км²',
    label: 'Загрязнено'
  },
  {
    icon: '💶',
    displayValue: '18',
    unit: 'млрд руб.',
    label: 'Прямые затраты'
  }
]

const radiationData = [
  { label: 'Йод-131', value: 1760, color: 'linear-gradient(90deg, #ff4444, #ff6666)' },
  { label: 'Цезий-137', value: 85, color: 'linear-gradient(90deg, #ffd700, #ffee55)' },
  { label: 'Цезий-134', value: 47, color: 'linear-gradient(90deg, #ffaa00, #ffcc44)' },
  { label: 'Стронций-90', value: 10, color: 'linear-gradient(90deg, #ff6b1a, #ff9944)' },
  { label: 'Плутоний-239', value: 0.03, color: 'linear-gradient(90deg, #cc0000, #ff3333)' }
]

const doseDistribution = [
  { label: 'Ликвидаторы 1986-1987', value: 45, color: '#ff4444' },
  { label: 'Ликвидаторы 1988-1991', value: 25, color: '#ff8800' },
  { label: 'Эвакуированные', value: 18, color: '#ffaa00' },
  { label: 'Население зон контроля', value: 12, color: '#ffd700' }
]

const thyroidData = [
  { date: "27 апреля", value: 1 },
  { date: "28 апреля", value: 4 },
  { date: "29 апреля", value: 7 },
  { date: "30 апреля", value: 9 },
  { date: "1-2 мая", value: 14 },
  { date: "3 мая", value: 17 },
  { date: "4 мая", value: 18 },
  { date: "5-6 мая", value: 21 }
]

const accidents = [
  { name: 'Чернобыль (СССР)', year: 1986, inesLevel: 7, release: '5300 ПБк', zone: '2600 км²' },
  { name: 'Фукусима (Япония)', year: 2011, inesLevel: 7, release: '900 ПБк', zone: '800 км²' },
  { name: 'Кыштым (СССР)', year: 1957, inesLevel: 6, release: '74 ПБк', zone: '300 км²' },
  { name: 'Три-Майл-Айленд', year: 1979, inesLevel: 5, release: '0.37 ПБк', zone: '—' },
  { name: 'Уиндскейл', year: 1957, inesLevel: 5, release: '1.8 ПБк', zone: '—' }
]

const getSegmentRotation = (index: number): number => {
  let rotation = 0
  for (let i = 0; i < index; i++) {
    rotation += doseDistribution[i].value * 3.6
  }
  return rotation
}

const getSegmentClip = (index: number): string => {
  const value = doseDistribution[index].value
  if (value > 50) return 'rect(auto, auto, auto, auto)'
  return 'rect(0, 150px, 150px, 75px)'
}
</script>

<style scoped>
.stats {
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

/* Ключевые показатели */
.key-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.metric-card {
  background: var(--dark);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 107, 26, 0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.metric-card:hover {
  border-color: rgba(255, 107, 26, 0.3);
  box-shadow: 0 10px 30px rgba(255, 107, 26, 0.15);
  transform: translateY(-5px);
}

.metric-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.metric-value {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
}

.number {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--primary);
  text-shadow: var(--radiation-glow);
  font-family: 'Courier New', monospace;
}

.unit {
  font-size: 1rem;
  color: var(--text-muted);
}

.metric-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
}

/* Графики */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.chart-card {
  background: var(--dark);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 107, 26, 0.1);
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-title {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  color: var(--text);
}

/* Bar chart */
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bar-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bar-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text);
}

.bar-value {
  color: var(--primary);
  font-weight: 600;
}

.bar-track {
  height: 20px;
  background: rgba(255, 107, 26, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 1.5s ease;
  min-width: 2px;
}

/* Simple Pie Chart */
.pie-chart-container {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.simple-pie {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(
    #ff4444 0deg 162deg,
    #ff8800 162deg 252deg,
    #ffaa00 252deg 316.8deg,
    #ffd700 316.8deg 360deg
  );
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pie-center {
  width: 80px;
  height: 80px;
  background: var(--dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-weight: 700;
  font-size: 0.9rem;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-label {
  color: var(--text);
  font-size: 0.85rem;
  flex: 1;
}

.legend-value {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
}

/* Simple Line Chart */
.simple-line-chart {
  padding: 1rem 0;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 250px;
  gap: 0.5rem;
}

.chart-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-value-label {
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.bar-container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar {
  width: 60%;
  background: linear-gradient(to top, #ff6b1a, #ffd700);
  border-radius: 5px 5px 0 0;
  transition: height 1.5s ease;
  min-height: 2px;
}

.bar-year-label {
  color: var(--text-muted);
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

/* Таблица */
.comparison-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  background: rgba(255, 107, 26, 0.1);
  color: var(--primary);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 2px solid rgba(255, 107, 26, 0.3);
}

tbody td {
  padding: 1rem;
  color: var(--text);
  border-bottom: 1px solid rgba(255, 107, 26, 0.1);
  font-size: 0.9rem;
}

tbody tr:hover {
  background: rgba(255, 107, 26, 0.05);
}

.accident-name {
  font-weight: 600;
}

.ines-level {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.8rem;
}

.ines-7 {
  background: rgba(255, 68, 68, 0.2);
  color: #ff4444;
}

.ines-6 {
  background: rgba(255, 136, 0, 0.2);
  color: #ff8800;
}

.ines-5 {
  background: rgba(255, 170, 0, 0.2);
  color: #ffaa00;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card.full-width {
    grid-column: 1;
  }
  
  .pie-chart-container {
    flex-direction: column;
    align-items: center;
  }
  
  .number {
    font-size: 2rem;
  }
  
  .chart-bars {
    height: 200px;
  }
}
</style>