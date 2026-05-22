<template>
  <div id="app" class="chernobyl-theme">
    <nav :class="['navbar', { scrolled: isScrolled }]">
      <div class="nav-content">
        <div class="logo">
          <span class="radiation-symbol">☢️</span>
          <span>Чернобыль</span>
        </div>
        <div class="nav-links">
          <router-link to="/" @click="scrollToTop">Главная</router-link>
          
          <a v-for="item in mainMenuItems" 
             :key="item.id" 
             :href="item.href"
             @click.prevent="navigateAndScroll(item.id)">
            {{ item.label }}
          </a>
          
          <router-link to="/media">Медиа</router-link>
        </div>
        
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <div :class="['mobile-nav', { active: mobileMenuOpen }]">
        <router-link to="/" @click="closeMobileMenu">Главная</router-link>
        <a v-for="item in mainMenuItems" 
           :key="item.id" 
           :href="item.href"
           @click.prevent="mobileNavigate(item.id)">
          {{ item.label }}
        </a>
        <router-link to="/media" @click="closeMobileMenu">Медиа</router-link>
      </div>
    </nav>
    
    <!-- ТОЛЬКО router-view, без прямых компонентов -->
    <router-view 
      :facts="facts" 
      :timeline="timeline"
      @open-modal="openModal">
    </router-view>

    <!-- Модальное окно -->
    <Teleport to="body">
      <div v-if="modal.isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button class="modal-close" @click="closeModal">✕</button>
          <div class="modal-icon">{{ modal.icon }}</div>
          <h2 class="modal-title">{{ modal.title }}</h2>
          <div class="modal-body">
            <p v-for="(text, index) in modal.content" :key="index" class="modal-text">
              {{ text }}
            </p>
          </div>
        </div>
      </div>
    </Teleport>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>В память о трагедии</h4>
          <p>Чернобыльская катастрофа - напоминание о цене ошибок и важности безопасности</p>
        </div>
        <div class="footer-section">
          <h4>Дата</h4>
          <p class="footer-date">26 апреля 1986 года</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { MenuItem, Fact, TimelineEvent, ModalData } from './types'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isScrolled = ref<boolean>(false)
const mobileMenuOpen = ref<boolean>(false)

const mainMenuItems: MenuItem[] = [
  { id: 'facts', label: 'Предпосылки', href: '/#facts' },
  { id: 'stats', label: 'Статистика', href: '/#stats' },
  { id: 'map', label: 'Карта', href: '/#map' },
  { id: 'timeline', label: 'Хронология', href: '/#timeline' },
  { id: 'consequences', label: 'Последствия', href: '/#consequences' }
]

const modal = ref<ModalData>({
  isOpen: false,
  title: '',
  content: [],
  icon: ''
})

const facts: Fact[] = [
  {
    id: 1,
    title: 'Конструктивные дефекты реактора РБМК-1000',
    period: '1960-1980',
    description: 'Реактор имел положительный паровой коэффициент реактивности',
    icon: '⚛️',
    details: [
      'На момент аварии на Чернобыльской АЭС паровой коэффициент реактивности был настолько положительным, что подавил остальные составляющие мощностного коэффициента, и сам мощностной коэффициент стал положительным.',
      'Когда мощность начала расти, выработалось больше пара, что в свою очередь привело к дальнейшему росту мощности. Дополнительное тепло от роста мощности повысило температуру в контуре охлаждения и образовало ещё больше пара.',
      'Больше пара — меньше охлаждения и меньше поглощения нейтронов — в результате мощность стремительно выросла примерно до 100-кратного значения номинальной.',
      'Замкнутый круг самоусиления. В безопасном реакторе при закипании воды мощность должна падать. В РБМК — падает поглощение нейтронов и мощность растёт.'
    ]
  },
  {
    id: 2,
    title: 'Концевой эффект («положительный эффект заглушения»)',
    period: '25-26 апреля',
    description: 'Аварийная защита в первые секунды разгоняет реактор',
    icon: '📋',
    details: [
      'К каждому концу поглощающей части каждого стержня присоединён графитовый вытеснитель. Размеры стержня и вытеснителей были таковы, что при полностью извлечённом стержне 4,5-метровый вытеснитель располагался по центру активной зоны реактора, с 1,25 м воды с каждой стороны.',
      'При поступлении сигнала на аварийное заглушение, когда стержень падает вниз, вода в нижней части канала замещается нижней частью графитового вытеснителя, что первоначально добавляет реактивность в нижнюю часть активной зоны.',
      'Иными словами, в первые секунды после нажатия кнопки аварийной защиты реактор не глушился, а кратковременно разгонялся. Именно этот „положительный эффект заглушения“ сыграл большую роль в ночь аварии 26 апреля 1986 года.',
      'Графитовый вытеснитель поглощает нейтроны примерно в 1000 раз хуже, чем вода, которую он вытесняет.'
    ]
  },
  {
    id: 3,
    title: 'Отсутствие защитной оболочки',
    period: '26 апреля',
    description: 'При взрыве 1000-тонную крышку сорвало, западная бетонная оболочка могла бы удержать большую часть выброса',
    icon: '🧨',
    details: [
      'Защитной оболочки в том смысле, который принят на Западе, не существует. Активная зона реактора размещена в полости, облицованной армированным бетоном, выполняющим функцию радиационной защиты. Активная зона опирается на тяжёлую стальную плиту; сверху её закрывает стальная крышка весом 1000 тонн.',
      'Отсутствие полноценного контейнмента основывалось на убеждённости разработчиков в принципиальной невозможности тяжёлой аварии с разрушением реактора.',
      'Ранние советские реакторы не были заключены в защитные оболочки — большие куполообразные сооружения, предназначенные для удержания радиоактивных утечек. Кохран заявил, что видел фотографии Чернобыльской станции и уверен, что реакторы не находятся внутри защитных зданий.',
      'При взрыве 1000-тонную крышку сорвало. Западная бетонная оболочка могла бы удержать большую часть выброса.'
    ]
  },
  {
    id: 4,
    title: 'Ксеноновое отравление',
    period: '25-26 апреля',
    description: 'Операторы боролись с ксеноновой ямой силой: вытаскивали стержни, чтобы компенсировать потерю реактивности',
    icon: '⚠️',
    details: [
      'Ксенон-135 обладает исключительно высоким сечением поглощения нейтронов — порядка 10 миллионов барн. Он образуется как прямой продукт деления урана, а также при распаде йода-135. При снижении мощности реактора ксенон перестаёт интенсивно выгорать, но продолжает накапливаться, всё сильнее подавляя цепную реакцию — это явление называется ксеноновым отравлением, или „ксеноновой ямой“.',
      'Именно оно не позволило операторам в ночь аварии поднять мощность реактора до требуемого уровня.',
      '25 апреля, 14:00 — диспетчер энергосети Киева запретил дальнейшее снижение мощности. За девять часов вынужденного простоя в активной зоне накопилось критическое количество ксенона.',
      '26 апреля, 00:28 — мощность стремительно провалилась почти до нуля — около 30 МВт тепловых. Реактор попал в глубокую ксеноновую яму.'
    ]
  },
  {
    id: 5,
    title: 'Авария 1982 года на 1-м блоке',
    period: '1982 год',
    description: 'Системные нарушения и конструктивные недостатки не были устранены, к катастрофе 1986 года пришли с теми же проблемами',
    icon: '💥',
    details: [
      '9 сентября 1982 года проводился пробный пуск реактора 1-го энергоблока. При подъёме мощности до 20 процентов произошёл разрыв одного из 1640 технологических каналов. Произошло разрушение тепловыделяющей сборки и аварийный разрыв технологического канала № 62-44, была деформирована графитовая кладка активной зоны.',
      'Официально установленной причиной стало несоблюдение технологии изготовления технологических каналов — то есть производственный брак, о котором документы КГБ предупреждали ещё с 1978 года.',
      'Простой энергоблока составил три месяца, материальный ущерб — 33 миллиона рублей. В ходе расследования было выявлено 20 грубейших нарушений технологического регламента по эксплуатации станции, а также серьёзные недоработки в самом регламенте.',
      'Через два года, в секретном отчёте КГБ от 1 октября 1984 года, эта авария описывалась уже как "одна из самых серьёзных в истории атомной энергетики".'
    ]
  },
  {
    id: 6,
    title: 'Нарушение оперативного запаса реактивности',
    period: '26 апреля',
    description: 'За 30 секунд до взрыва реактор почти полностью лишился стержней управления, это прямое нарушение регламента',
    icon: '🔋',
    details: [
      'Количество введённых стержней определяет оперативный запас реактивности (ОЗР) — меру способности реактора к управлению.',
      'Операторы на Чернобыльской АЭС, по всей видимости, полагали, что критерии безопасности будут соблюдены, пока придерживаться нижнего предела ОЗР в 30 стержней — вне зависимости от реальной конфигурации активной зоны.',
      '26 апреля, 01:00 — Мощность реактора выросла до 200 МВт и стабилизировалась. Хотя операторы, возможно, и не знали об этом, требуемый оперативный запас реактивности (ОЗР) в 15 стержней был нарушен.',
      '26 апреля, 01:22:30 — Расчёты, выполненные после аварии, показали, что ОЗР в этот момент был эквивалентен восьми управляющим стержням. Правила эксплуатации требовали, чтобы в активную зону реактора постоянно было введено не менее 15 стержней-поглотителей в пересчёте на ОЗР.'
    ]
  }
]

const timeline: TimelineEvent[] = [
  {
    year: '25.04 01:06',
    title: 'Начало остановки реактора',
    description: 'Начало плановой остановки реактора. Началось постепенное снижение уровня мощности.',
    icon: '🔽'
  },
  {
    year: '25.04 03:47',
    title: 'Приостановка снижения',
    description: 'Снижение мощности реактора приостановлено на уровне 1600 МВт (тепловых).',
    icon: '⏸️'
  },
  {
    year: '25.04 14:00',
    title: 'Отключение САОР',
    description: 'Система аварийного охлаждения активной зоны (САОР) была отключена (часть процедуры испытаний), чтобы предотвратить ее вмешательство в ход испытаний в дальнейшем. Тот факт, что САОР была отключена, не способствовал аварии; однако, если бы она была доступна, это могло бы немного уменьшить последствия. Мощность предполагалось снижать и дальше, однако диспетчер электросети в Киеве попросил оператора реактора продолжать подавать электроэнергию для обеспечения спроса. Следовательно, уровень мощности реактора поддерживался на уровне 1600 МВт(т), и эксперимент был отложен. Без этой задержки испытание было бы проведено во время дневной смены.',
    icon: '🔧'
  },
  {
    year: '25.04 23:10',
    title: 'Возобновление снижения',
    description: 'Возобновление снижения мощности реактора.',
    icon: '🔽'
  },
  {
    year: '26.04 00:05',
    title: 'Снижение до 720 МВт',
    description: 'Уровень мощности снижен до 720 МВт(т) и продолжал снижаться.',
    icon: '📉'
  },
  {
    year: '26.04 00:28',
    title: 'Критическое падение мощности',
    description: 'При уровне мощности около 500 МВт(т) управление было переведено с локального на автоматическую систему регулирования. Оператор мог не подать сигнал «удержание мощности на требуемом уровне», либо система регулирования не отреагировала на этот сигнал. Это привело к неожиданному падению мощности, которая быстро снизилась до 30 МВт(т).',
    icon: '⚠️'
  },
  {
    year: '26.04 00:43',
    title: 'Сигнал на отключение',
    description: 'Сигнал на отключение турбогенератора заблокирован в соответствии с эксплуатационными и испытательными процедурами.',
    icon: '🚨'
  },
  {
    year: '26.04 01:00',
    title: 'Стабилизация на 200 МВт',
    description: 'Мощность реактора выросла до 200 МВт(т) и стабилизировалась. Хотя операторы, возможно, и не знали об этом, требуемый оперативный запас реактивности (ОЗР) в 15 стержней был нарушен. Было принято решение провести испытания выбега турбогенератора на уровне мощности около 200 МВт.',
    icon: '⚡'
  },
  {
    year: '26.04 01:03–01:07',
    title: 'Подключение насосов',
    description: 'Резервный главный циркуляционный насос (ГЦН) был подключен к левому контуру охлаждения, чтобы увеличить поток воды через активную зону (часть процедуры испытаний). Дополнительный охлаждающий насос был подключен к правому контуру охлаждения (часть процедуры испытаний). Работа дополнительных насосов быстрее отводила тепло от активной зоны, что привело к снижению реактивности, что потребовало дальнейшего извлечения стержней-поглотителей для предотвращения падения уровня мощности. Насосы создали чрезмерный поток, превысив допустимые пределы. Увеличенный поток через активную зону привел к проблемам с уровнем в барабане-сепараторе.',
    icon: '🔌'
  },
  {
    year: '26.04 01:19',
    title: 'Отключение защиты',
    description: 'Уровень в барабане-сепараторе все еще находился около аварийной отметки. Для компенсации оператор увеличил подачу питательной воды. Это подняло уровень в барабане, но еще больше снизило реактивность системы. Автоматические регулирующие стержни поднялись до верхней концевой плиты для компенсации, но для поддержания баланса реактивности потребовалось дальнейшее извлечение ручных стержней. Давление в системе начало падать, и для его стабилизации был закрыт перепускной клапан паровой турбины. Поскольку у операторов возникли проблемы с регулированием давления и уровня, примерно в это время они отключили системы автоматической защиты по барабану-сепаратору.',
    icon: '🚫'
  },
  {
    year: '26.04 01:22:30',
    title: 'ОЗР = 8 стержней',
    description: 'Расчеты, выполненные после аварии, показали, что ОЗР в этот момент был эквивалентен восьми управляющим стержням. Правила эксплуатации требовали, чтобы в активную зону реактора постоянно было введено не менее 15 стержней-поглотителей в пересчете на ОЗР.',
    icon: '📊'
  },
  {
    year: '26.04 01:23:04',
    title: 'Начало испытания',
    description: 'Клапаны подачи пара на турбину закрыты для начала выбега турбины. Это было фактическим началом испытания. Согласно Приложению I к INSAG-7, в течение примерно следующих 30 секунд выбега четырех питательных насосов «параметры блока контролировались, оставались в пределах, ожидаемых для данных условий эксплуатации, и не требовали какого-либо вмешательства со стороны персонала».',
    icon: '▶️'
  },
  {
    year: '26.04 01:23:40',
    title: 'Нажатие АЗ-5',
    description: 'Оператором была нажата кнопка аварийной защиты (АЗ-5). Управляющие стержни начали входить в активную зону, увеличивая реактивность в нижней части активной зоны.',
    icon: '🔴'
  },
  {
    year: '26.04 01:23:43',
    title: 'Мощность > 530 МВт',
    description: 'Срабатывание сигналов системы аварийной защиты по скорости нарастания мощности; мощность превысила 530 МВт.',
    icon: '📈'
  },
  {
    year: '26.04 01:23:46–47',
    title: 'Отказ насосов',
    description: 'Отключение первой пары главных циркуляционных насосов (ГЦН), находящихся в режиме «выбега», за которым сразу же последовало отключение второй пары. Резкое снижение расхода через ГЦН, не участвовавшие в испытаниях на выбег, и недостоверные показания ГЦН, участвовавших в испытаниях; резкое повышение давления в барабанах-сепараторах; резкое повышение уровня воды в барабанах-сепараторах.',
    icon: '💢'
  },
  {
    year: '26.04 01:23:48',
    title: 'Сброс пара',
    description: 'Восстановление расхода через ГЦН, не участвовавшие в испытаниях на выбег, до значений, близких к первоначальным; восстановление расхода до уровня на 15% ниже первоначального для ГЦН левой стороны, работавших в режиме выбега; восстановление расхода до уровня на 10% ниже первоначального для одного из других ГЦН, участвовавших в испытаниях, и недостоверные показания для другого; дальнейшее повышение давления в барабанах-сепараторах и уровня воды в них; срабатывание быстродействующих систем сброса пара в конденсаторы.',
    icon: '💨'
  },
  {
    year: '26.04 01:23:49',
    title: 'Разрыв канала',
    description: 'Сигнал аварийной защиты «Повышение давления в реакторном пространстве (разрыв топливного канала)»; сигнал «Нет напряжения — 48 В» (нет питания сервоприводов механизмов исполнительных органов СУЗ); сигналы «Отказ исполнительных механизмов автоматических регуляторов мощности № 1 и 2».',
    icon: '💥'
  },
  {
    year: '26.04 01:24',
    title: 'Взрыв',
    description: 'Из записи в оперативном журнале главного инженера по управлению реактором: «01:24: Сильные толчки; стержни СУЗ остановились, не дойдя до нижних концевых выключателей; выключатель питания муфт сцепления отключен».',
    icon: '☢️'
  },
  {
    year: '27 апреля',
    title: 'Эвакуация Припяти',
    description: 'Эвакуировано 49 000 жителей. Объявлено о временной эвакуации на 3 дня',
    icon: '🚌'
  },
  {
    year: 'Май–Ноябрь 1986',
    title: 'Строительство саркофага',
    description: 'В рекордные сроки построен объект «Укрытие» для изоляции разрушенного реактора',
    icon: '🏗️'
  }
]

const navigateAndScroll = async (sectionId: string) => {
  if (route.path !== '/') {
    await router.push({ path: '/', hash: `#${sectionId}` })
  }
  setTimeout(() => {
    scrollTo(sectionId)
  }, 100)
  mobileMenuOpen.value = false
}

const mobileNavigate = (sectionId: string) => {
  navigateAndScroll(sectionId)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  mobileMenuOpen.value = false
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleScroll = (): void => {
  isScrolled.value = window.scrollY > 50
}

const scrollTo = (sectionId: string): void => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const toggleMobileMenu = (): void => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const openModal = (data: { title: string; content: string[]; icon: string }): void => {
  modal.value = { isOpen: true, ...data }
  document.body.style.overflow = 'hidden'
}

const closeModal = (): void => {
  modal.value.isOpen = false
  document.body.style.overflow = ''
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // Если пришли по прямой ссылке с хешем
  if (route.hash) {
    setTimeout(() => {
      scrollTo(route.hash.replace('#', ''))
    }, 300)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #ff6b1a;
  --primary-dark: #cc5500;
  --secondary: #ffd700;
  --accent: #4a4a4a;
  --dark: #0a0a0a;
  --dark-secondary: #1a1a1a;
  --text: #e0e0e0;
  --text-muted: #808080;
  --danger: #ff4444;
  --bg-gradient: linear-gradient(135deg, #1a1a1a 0%, #2d1f0e 100%);
  --radiation-glow: 0 0 20px rgba(255, 107, 26, 0.5);
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--dark);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}

.chernobyl-theme {
  background: 
    radial-gradient(ellipse at 50% 0%, rgba(255, 107, 26, 0.1) 0%, transparent 50%),
    var(--bg-gradient);
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  background: rgba(10, 10, 10, 0.9);
  border-bottom: 1px solid rgba(255, 107, 26, 0.1);
}

.navbar.scrolled {
  background: rgba(10, 10, 10, 0.95);
  box-shadow: var(--radiation-glow);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.radiation-symbol {
  font-size: 1.8rem;
  animation: pulse 2s ease-in-out infinite;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width 0.3s ease;
  box-shadow: var(--radiation-glow);
}

.nav-links a:hover {
  color: var(--primary);
  text-shadow: var(--radiation-glow);
}

.nav-links a:hover::after {
  width: 100%;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.mobile-menu-btn span {
  width: 25px;
  height: 2px;
  background: var(--text);
  transition: all 0.3s ease;
}

.mobile-nav {
  display: none;
  flex-direction: column;
  background: rgba(10, 10, 10, 0.95);
  padding: 1rem 2rem;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 107, 26, 0.1);
}

.mobile-nav.active {
  display: flex;
}

.mobile-nav a {
  color: var(--text);
  text-decoration: none;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.mobile-nav a:hover {
  color: var(--primary);
}

.footer {
  background: var(--dark-secondary);
  border-top: 1px solid rgba(255, 107, 26, 0.1);
  padding: 3rem 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.footer-section h4 {
  color: var(--primary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-section p {
  color: var(--text-muted);
  line-height: 1.6;
}

.footer-date {
  color: var(--primary) !important;
  font-size: 1.2rem !important;
  font-weight: 600;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--dark-secondary);
  border: 1px solid rgba(255, 107, 26, 0.3);
  border-radius: 20px;
  padding: 3rem;
  max-width: 1000px;
  width: 100%;
  position: relative;
  box-shadow: var(--radiation-glow);
  animation: slideUp 0.3s ease;
  max-height: 1000vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: rgba(255, 107, 26, 0.1);
  color: var(--primary);
}

.modal-icon {
  font-size: 4rem;
  text-align: center;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

.modal-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary);
  text-shadow: var(--radiation-glow);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-text {
  color: var(--text);
  line-height: 1.8;
  padding-left: 1.5rem;
  border-left: 3px solid var(--primary);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .modal-content {
    padding: 2rem;
    margin: 1rem;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
}
</style>