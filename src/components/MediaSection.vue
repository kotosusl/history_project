<template>
  <section class="media photos-page" id="media">
    <div class="container">
      <h1 class="page-title">📸 Фотогалерея</h1>
      <p class="page-subtitle">Документальные свидетельства трагедии</p>
      
      <!-- Секция фотографий -->
      <div class="section-block">
        <h2 class="section-heading">
          <span class="section-icon">📸</span>
          Фотографии
        </h2>
        <div class="photos-grid">
          <div 
            class="photo-card" 
            v-for="(image, index) in images" 
            :key="index" 
            @click="openModal(index)"
          >
            <div class="photo-container">
  <!-- PDF индикатор -->
  <span v-if="image.type === 'pdf'" class="pdf-icon-overlay">PDF</span>
  
  <img 
    v-if="image.src" 
    :src="image.src" 
    :alt="image.title" 
    class="photo-image"
    loading="lazy"
  />
  <div v-else class="photo-placeholder" :class="{ 'pdf-placeholder': image.type === 'pdf' }">
    <span class="photo-emoji">{{ image.emoji }}</span>
  </div>
</div>
            <div class="photo-overlay">
              <h3>{{ image.title }}</h3>
              <p>{{ image.description }}</p>
              <span class="photo-date">📅 {{ image.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Секция газет -->
      <div class="section-block">
        <h2 class="section-heading">
          <span class="section-icon">📰</span>
          Газетные вырезки
        </h2>
        <div class="photos-grid">
          <div 
            class="photo-card" 
            v-for="(newspaper, index) in newspapers" 
            :key="'news-' + index" 
            @click="openNewspaperModal(index)"
          >
            <div class="photo-container">
  <span v-if="newspaper.type === 'pdf'" class="pdf-icon-overlay">PDF</span>
  
<!-- PDF превью -->
  <div v-if="newspaper.type === 'pdf' && newspaper.pdfUrl" class="pdf-thumb-wrapper">
    <embed 
      :src="newspaper.pdfUrl + '#view=FitH&toolbar=0&navpanes=0'"
      class="pdf-thumb-embed"
      sandbox="allow-same-origin"
    ></embed>
    <div class="pdf-click-blocker"></div>
  </div>
  
  <!-- Обычное изображение -->
  <img 
    v-else-if="newspaper.src && newspaper.type !== 'pdf'" 
    :src="newspaper.src" 
    :alt="newspaper.title" 
    class="photo-image"
    loading="lazy"
  />

  <div v-else class="photo-placeholder" :class="{ 'pdf-placeholder': newspaper.type === 'pdf' }">
    <span class="photo-emoji">{{ newspaper.emoji }}</span>
  </div>
</div>
            <div class="photo-overlay">
              <h3>{{ newspaper.title }}</h3>
              <p>{{ newspaper.description }}</p>
              <span class="photo-date">📅 {{ newspaper.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Секция документов КГБ -->
<div class="section-block">
  <h2 class="section-heading">
    <span class="section-icon">🔒</span>
    Засекреченные документы КГБ
  </h2>
  <div class="photos-grid">
    <div 
      class="photo-card" 
      v-for="(doc, index) in kgbDocuments" 
      :key="'kgb-' + index" 
      @click="openKgbModal(index)"
    >
      <div class="photo-container">
        <span v-if="doc.type === 'pdf'" class="pdf-icon-overlay">PDF</span>
        
        <!-- PDF превью -->
        <div v-if="doc.type === 'pdf' && doc.pdfUrl" class="pdf-thumb-wrapper">
          <embed 
            :src="doc.pdfUrl + '#view=FitH&toolbar=0&navpanes=0'"
            class="pdf-thumb-embed"
            sandbox="allow-same-origin"
          ></embed>
          <div class="pdf-click-blocker"></div>
        </div>
        
        <!-- Обычное изображение -->
        <img 
          v-else-if="doc.src && doc.type !== 'pdf'" 
          :src="doc.src" 
          :alt="doc.title" 
          class="photo-image"
          loading="lazy"
        />
        
        <!-- Плейсхолдер -->
        <div v-else class="photo-placeholder" :class="{ 'pdf-placeholder': doc.type === 'pdf' }">
          <span class="photo-emoji">{{ doc.emoji || '🔒' }}</span>
        </div>
      </div>
      <div class="photo-overlay">
        <h3>{{ doc.title }}</h3>
        <p>{{ doc.description }}</p>
        <span class="photo-date">📅 {{ doc.date }}</span>
      </div>
    </div>
  </div>
</div>

<Teleport to="body">
  <div v-if="kgbModalOpen" class="modal-overlay" @click.self="closeKgbModal">
    <div class="modal-container" :class="{ 'pdf-container': kgbIsPdfView }">
      <button class="modal-close-btn" @click="closeKgbModal">✕</button>
      
      <div v-if="!kgbIsPdfView" class="modal-counter">
        {{ kgbIndex + 1 }} / {{ kgbDocuments.filter(d => d.type !== 'pdf').length }}
      </div>

      <!-- PDF просмотр -->
      <div v-if="kgbIsPdfView" class="pdf-viewer-wrapper">
        <iframe 
          :src="kgbCurrentPdfUrl" 
          class="pdf-viewer"
          frameborder="0"
        ></iframe>
      </div>

      <!-- Обычное изображение -->
      <div v-else class="modal-image-wrapper">
        <img 
          v-if="currentKgbDoc?.src" 
          :src="currentKgbDoc.src" 
          :alt="currentKgbDoc.title" 
          class="modal-image"
        />
        <div v-else class="modal-placeholder">
          <span class="modal-emoji">{{ currentKgbDoc?.emoji }}</span>
        </div>
      </div>

      <div class="modal-info">
        <h2>{{ currentKgbDoc?.title }}</h2>
        <p>{{ currentKgbDoc?.description }}</p>
        <span class="modal-date">📅 {{ currentKgbDoc?.date }}</span>
      
      </div>

      <div v-if="!kgbIsPdfView" class="modal-nav">
        <button class="nav-btn" @click="prevKgb" :disabled="kgbIndex === 0">← Назад</button>
        <div class="nav-dots">
          <span 
            v-for="(item, index) in kgbDocuments.filter(d => d.type !== 'pdf')" 
            :key="index"
            class="nav-dot" 
            :class="{ active: index === kgbIndex }"
            @click="goToKgb(index)"
          ></span>
        </div>
        <button class="nav-btn" @click="nextKgb" :disabled="kgbIndex === kgbDocuments.filter(d => d.type !== 'pdf').length - 1">Вперёд →</button>
      </div>
    </div>
  </div>
</Teleport>

    <!-- Модальное окно для фото -->
    <Teleport to="body">
      <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container" :class="{ 'pdf-container': isPdfView }">
      <button class="modal-close-btn" @click="closeModal">✕</button>
      
      <!-- Счётчик (только для фото) -->
      <div v-if="!isPdfView" class="modal-counter">
        {{ currentIndex + 1 }} / {{ activeImages.length }}
      </div>

      <!-- PDF просмотр -->
      <div v-if="isPdfView" class="pdf-viewer-wrapper">
        <iframe 
          :src="currentPdfUrl" 
          class="pdf-viewer"
          frameborder="0"
        ></iframe>
      </div>

      <!-- Обычное изображение -->
      <div v-else class="modal-image-wrapper">
        <img 
          v-if="currentImage?.src" 
          :src="currentImage.src" 
          :alt="currentImage.title" 
          class="modal-image"
        />
        <div v-else class="modal-placeholder">
          <span class="modal-emoji">{{ currentImage?.emoji }}</span>
        </div>
      </div>

      <!-- Информация -->
      <div class="modal-info">
        <h2>{{ currentImage?.title }}</h2>
        <p>{{ currentImage?.description }}</p>
        <span class="modal-date">📅 {{ currentImage?.date }}</span>
        
      </div>

      <!-- Навигация (только для фото) -->
      <div v-if="!isPdfView && activeImages.length > 1" class="modal-nav">
        <button class="nav-btn" @click="prevImage" :disabled="currentIndex === 0">← Назад</button>
        <div class="nav-dots">
          <span 
            v-for="(_, index) in activeImages" 
            :key="index"
            class="nav-dot" 
            :class="{ active: index === currentIndex }"
            @click="goToImage(index)"
          ></span>
        </div>
        <button class="nav-btn" @click="nextImage" :disabled="currentIndex === activeImages.length - 1">Вперёд →</button>
      </div>
    </div>
  </div>
    </Teleport>

    <!-- Модальное окно для газет -->
    <Teleport to="body">
      <div v-if="newspaperModalOpen" class="modal-overlay" @click.self="closeNewspaperModal">
    <div class="modal-container" :class="{ 'pdf-container': newspaperIsPdfView }">
      <button class="modal-close-btn" @click="closeNewspaperModal">✕</button>
      
      <!-- Счётчик (только для фото) -->
      <div v-if="!newspaperIsPdfView" class="modal-counter">
        {{ newspaperIndex + 1 }} / {{ newspapers.filter(n => n.type !== 'pdf').length }}
      </div>

      <!-- PDF просмотр -->
      <div v-if="newspaperIsPdfView" class="pdf-viewer-wrapper">
        <iframe 
          :src="newspaperCurrentPdfUrl" 
          class="pdf-viewer"
          frameborder="0"
        ></iframe>
      </div>

      <!-- Обычное изображение -->
      <div v-else class="modal-image-wrapper">
        <img 
          v-if="currentNewspaper?.src" 
          :src="currentNewspaper.src" 
          :alt="currentNewspaper.title" 
          class="modal-image"
        />
        <div v-else class="modal-placeholder">
          <span class="modal-emoji">{{ currentNewspaper?.emoji }}</span>
        </div>
      </div>

      <div class="modal-info">
        <h2>{{ currentNewspaper?.title }}</h2>
        <p>{{ currentNewspaper?.description }}</p>

        <p v-if="currentNewspaper?.details" class="modal-details">{{ currentNewspaper.details }}</p>

        <span class="modal-date">📅 {{ currentNewspaper?.date }}</span>
        
      </div>

      <!-- Навигация (только для фото) -->
      <div v-if="!newspaperIsPdfView" class="modal-nav">
        <button class="nav-btn" @click="prevNewspaper" :disabled="newspaperIndex === 0">← Назад</button>
        <div class="nav-dots">
          <span 
            v-for="(item, index) in newspapers.filter(n => n.type !== 'pdf')" 
            :key="index"
            class="nav-dot" 
            :class="{ active: index === newspaperIndex }"
            @click="goToNewspaper(index)"
          ></span>
        </div>
        <button class="nav-btn" @click="nextNewspaper" :disabled="newspaperIndex === newspapers.filter(n => n.type !== 'pdf').length - 1">Вперёд →</button>
      </div>
    </div>
  </div>
    </Teleport>

    <!-- Модальное окно для видео -->
    <Teleport to="body">
      <div v-if="videoModalOpen" class="modal-overlay" @click.self="closeVideoModal">
        <div class="modal-container video-modal-container">
          <button class="modal-close-btn" @click="closeVideoModal">✕</button>
          <div class="video-player-wrapper">
            <div class="video-placeholder-big">
              <span class="video-modal-emoji">{{ currentVideo?.emoji }}</span>
              <span class="play-large">▶</span>
            </div>
          </div>
          <div class="modal-info">
            <h2>{{ currentVideo?.title }}</h2>
            <p>{{ currentVideo?.description }}</p>
            <span class="modal-date">⏱ {{ currentVideo?.duration }}</span>
          </div>
        </div>
      </div>
    </Teleport>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

import photo1 from "../assets/photo/4-ый энергоблок после аварии.png"
import photo2 from "../assets/photo/Дезактивационные работы.png"
import photo3 from "../assets/photo/Дезактивационные_работы_на_рабочей_площадке_ЧАЭС.png"
import photo4 from "../assets/photo/Дезактивация транспорта.png"
import photo5 from "../assets/photo/Измерение_уровня_радиации_в_зоне_аварии_ЧАЭС.png"
import photo6 from "../assets/photo/Кладбище зараженной техники.png"
import photo7 from "../assets/photo/На подъезде к ЧАЭС.png"
import photo8 from "../assets/photo/Облет_Припяти_в_день_эвакуации_27_апреля.png"
import photo9 from "../assets/photo/Около_решеток_4_энергоблока_во_время_ликвидационных_работ.png"
import photo10 from "../assets/photo/Поврежденный_ротор_турбогенератора_1_го_энергоблока_после_аварии.png"
import photo11 from "../assets/photo/Подготовка_к_первомайскому_параду_1986_на_Хрещатике,_30_04_1986.png"
import photo12 from "../assets/photo/Разбросанные_на_обочине_леса_Черниговская_обл_радиоактивные_строительные.png"
import photo13 from "../assets/photo/Разрушеннный 4-ый энргоблок.png"
import photo14 from "../assets/photo/Строители_оставляют_памятные_надписи_на_металлоконструкциях_объекта.png"
import photo15 from "../assets/photo/Строительство 4-го энергоблока.png"
import photo16 from "../assets/photo/Строительство_объекта__Укрытие_.png"
import photo17 from "../assets/photo/Строительство_объекта__Укрытие__.png"
import photo18 from "../assets/photo/Фото_ликвидаторов_аварии_на_ЧАЭС_Из_архива_А_В_Морева.png"
import photo19 from "../assets/photo/Центральный зал реактора.png"
import photo20 from "../assets/photo/Центральный_зал_4_го_энергоблока,1983_год.png"
import photo21 from "../assets/photo/Шестая_больница_в_Москве,_принимающая_пожарников,_первыми_гасившими.png"
import photo22 from "../assets/photo/вертолет_принимавший_участие_в_ликвидации.png"
import photo23 from "../assets/photo/город Припять до аварии на ЧАЭС.png"
import photo24 from "../assets/photo/облет ЧАЭС 27 апреля 1986.png"

import img1 from "../assets/docs/aus.jpeg"
import img2 from "../assets/docs/GW_1986_nr_101-1.webp"
import img3 from "../assets/docs/canada2.jpeg"
import img4 from "../assets/docs/der-again.jpeg"
import img5 from "../assets/docs/der-spiegel.jpg"
import img6 from "../assets/docs/polska.webp"
import img7 from "../assets/docs/svenska.jpg"
import img8 from "../assets/docs/usa.jpeg"
import img9 from "../assets/docs/usa2.jpeg"
import pdf1 from "../assets/docs/Atomeromu_1986-1633651495__pages9-12.pdf"
import pdf2 from "../assets/docs/118823_1986_Przeglad_Poznanski.pdf"
import pdf3 from "../assets/docs/BacsKiskunMegyeiNepujsag_1986_05__pages13-18.pdf"
import pdf4 from "../assets/docs/DunantuliNaplo_1986_05__pages49-56.pdf"
import pdf5 from "../assets/docs/Edmonton_Journal_1986_04_29_1.pdf"
import pdf6 from "../assets/docs/SNP2532889X-19860429-0-0-0-0.pdf"
import pdf7 from "../assets/docs/SNP2532889X-19860430-0-0-0-1.pdf"
import pdf8 from "../assets/docs/SNP2532889X-19860502-0-0-0-2.pdf"
import pdf9 from "../assets/docs/SNP2532889X-19860505-0-0-0-0.pdf"
import pdf10 from "../assets/docs/SNP26120215-19860428-0-0-0-0.pdf"
import pdf11 from "../assets/docs/SNP26120215-19860430-0-0-0-1.pdf"
import pdf12 from "../assets/docs/SNP26120215-19860502-0-0-0-2.pdf"
import pdf13 from "../assets/docs/The_Age_1986_04_30_Page_1.pdf"
import pdf14 from "../assets/docs/The_Guardian_1986_04_30_7.pdf"
import pdf15 from "../assets/docs/Tsernobyl HS 01051986a.pdf"
import pdf16 from "../assets/docs/ussr01.05.pdf"
import pdf17 from "../assets/docs/ussr02.05.pdf"

import kgbPdf1 from "../assets/kgb_docs/1.pdf"
import kgbPdf2 from "../assets/kgb_docs/2.pdf"
import kgbPdf3 from "../assets/kgb_docs/3.pdf"
import kgbPdf4 from "../assets/kgb_docs/Выписка_из_протокола_№_8_заседания_Политбюро_ЦК_КПСС_от_28_апреля.pdf"
import kgbPdf5 from "../assets/kgb_docs/Доведение_Оперативного_штаба_УВД_в_Киевской_области_о_проведении.pdf"
import kgbPdf6 from "../assets/kgb_docs/Доведение_о_пребывании_в_Киеве_корреспондента_Стивена_Страссера.pdf"
import kgbPdf7 from "../assets/kgb_docs/Доведение_про_отношение_населения_к_аварии_на_ЧАЭС.pdf"
import kgbPdf8 from "../assets/kgb_docs/Записка_о_радиационной_обстановке_на_ЧАЭС_и_в_Припяти.pdf"
import kgbPdf9 from "../assets/kgb_docs/Информация_директора_Чернобыльской_АЭС_Виктора_Брюханова_про_аварию.pdf"
import kgbPdf10 from "../assets/kgb_docs/Информация_о_нарушениях_в_строительстве_ЧАЭС.pdf"
import kgbPdf11 from "../assets/kgb_docs/О_реакции_иностранных_государств_на_сообщение_об_аварии_на_Чернобыльской.pdf"
import kgbPdf12 from "../assets/kgb_docs/О_реакции_иностранных_дипломатов_и_корреспондентов_на_сообщение.pdf"
import kgbPdf13 from "../assets/kgb_docs/Перечень_сведений,_подлежащих_засекречиванию_по_вопрорсам,_связанным.pdf"
import kgbPdf14 from "../assets/kgb_docs/Постановление_ЦК_КПСС_о_дополнительных_мерах,_связанных_с_ликвидацией.pdf"
import kgbPdf15 from "../assets/kgb_docs/Протокол_№_3_заседания_Оперативной_группы_Политбюро_ЦК_КПСС_по.pdf"
import kgbPdf16 from "../assets/kgb_docs/Рекомендации_и_некотрые_сведения_в_условиях_зоны_повышенной_радиации.pdf"
import kgbPdf17 from "../assets/kgb_docs/Служебно_оперативные_переговоры_на_ЧАЭС_в_ночь_аврии.pdf"
import kgbPdf18 from "../assets/kgb_docs/Справка_о_радиационной_обстановке_на_3_и_4_энергоблоках_27_04_1986.pdf"
import kgbPdf19 from "../assets/kgb_docs/УКГБ_УССР;_Справка_об_обстановке_среди_иностранных_учащихся.pdf"
import kgbPdf20 from "../assets/kgb_docs/Устное_послание_президента_США_Р_Рейгана.pdf"
import kgbPdf21 from "../assets/kgb_docs/график_измерения_радиации_в_Киеве_30_04_1986_02_05_1986.pdf"
import kgbPdf22 from "../assets/kgb_docs/справка_об_информации_из_мест_эвакуации.pdf"

interface GalleryImage {
  src?: string
  emoji?: string
  title: string
  description: string
  date: string
  category?: string
  type?: 'image' | 'pdf'
  pdfUrl?: string
  details?: string
}

interface VideoItem {
  title: string
  description: string
  duration: string
  emoji: string
}

// Состояния модальных окон
const modalOpen = ref(false)
const newspaperModalOpen = ref(false)
const videoModalOpen = ref(false)

const currentIndex = ref(0)
const newspaperIndex = ref(0)
const currentVideo = ref<VideoItem | null>(null)

const activeImages = ref<GalleryImage[]>([])
const isPdfView = ref(false)
const currentPdfUrl = ref("")

const newspaperIsPdfView = ref(false)
const newspaperCurrentPdfUrl = ref("")



// ... добавьте остальные

// Состояния для КГБ
const kgbModalOpen = ref(false)
const kgbIndex = ref(0)
const kgbIsPdfView = ref(false)
const kgbCurrentPdfUrl = ref("")

// Данные документов КГБ
const kgbDocuments: GalleryImage[] = [
  {
    title: 'Информационное сообщение КГБ УССР',
    description: 'О количестве иностранцев из капиталистических и развивающихся стран в УССР, оуновских боевках в Англии, последствиях аварии на АЭС',
    date: '14 сентября 1982',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf1
  },
  {
    title: 'Докладная записка начальнику УКГБ УССР по Киеву и Киевской области Бандуристому М.З.',
    description: 'Об аварийной ситуации на 3 и 4 энергоблоках Чернобыльской АЭС',
    date: '1 марта 1984',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf2
  },
  {
    title: 'Докладная записка начальнику Припятского ГО УКГБ УССР Николаеву Ю.В.',
    description: 'О недостаточной надежности применяемых на Чернобыльской АЭС реакторов',
    date: '14 августа 1984',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf3
  },
  {
    title: 'Выписка из протокола №8 заседания Политбюро ЦК КПСС',
    description: 'Первое обсуждение аварии в Политбюро',
    date: '28 апреля 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf4
  },
  {
    title: 'Доведение о пребывании в Киеве корреспондента Стивена Страссера',
    description: 'Слежка за иностранным корреспондентом в Киеве',
    date: '28 апреля 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf5
  },
  {
    title: 'Доведение Оперативного штаба УВД в Киевской области о проведении',
    description: 'Инструкции штаба милиции по эвакуации',
    date: '4 июня 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf6
  },
  {
    title: 'Доведение про отношение населения к аварии на ЧАЭС',
    description: 'Настроения населения после катастрофы',
    date: '12 мая 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf7
  },
  {
    title: 'Записка о радиационной обстановке на ЧАЭС и в Припяти',
    description: 'Радиационная обстановка на станции и в городе',
    date: '3 июля 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf8
  },
  {
    title: 'Информация директора Чернобыльской АЭС Виктора Брюханова про аварию',
    description: 'Доклад Брюханова о взрыве на станции',
    date: '26 апреля 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf9
  },
  {
    title: 'Информация_о_нарушениях_в_строительстве_ЧАЭС',
    description: 'Нарушения при строительстве Чернобыльской АЭС',
    date: '19 декабря 1978',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf10
  },
  {
    title: 'О реакции иностранных государств на сообщение об аварии на Чернобыльской',
    description: 'Как иностранные государства отреагировали на аварию',
    date: '30 апреля 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf11
  },
  {
    title: 'О реакции иностранных дипломатов и корреспондентов на сообщение',
    description: 'Реакция дипломатов и журналистов на аварию',
    date: '30 апреля 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf12
  },
  {
    title: 'Перечень сведений подлежащих засекречиванию по вопросам связанным',
    description: 'Список секретных сведений о катастрофе',
    date: '8 июля 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf13
  },
  {
    title: 'Постановление ЦК КПСС о дополнительных мерах связанных с ликвидацией',
    description: 'Новые меры партии по ликвидации последствий',
    date: '29 апреля 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf14
  },
  {
    title: 'Протокол №3 заседания Оперативной группы Политбюро ЦК КПСС',
    description: 'Заседание оперативной группы Политбюро по Чернобылю',
    date: '1 мая 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf15
  },
  {
    title: 'Рекомендации и некоторые сведения в условиях зоны повышенной радиации',
    description: 'Инструкции для работы в зоне радиации',
    date: '1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf16
  },
  {
    title: 'Служебно оперативные переговоры на ЧАЭС в ночь аварии',
    description: 'Переговоры персонала станции в ночь взрыва',
    date: '26 апреля 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf17
  },
  {
    title: 'Справка о радиационной обстановке на 3 и 4 энергоблоках',
    description: 'Радиация на третьем и четвёртом блоках',
    date: '27 апреля 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf18
  },
  {
    title: 'УКГБ УССР; Справка об обстановке среди иностранных учащихся',
    description: 'Ситуация среди иностранных студентов в СССР',
    date: '30 апреля 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf19
  },
  {
    title: 'Устное послание президента США Р.Рейгана',
    description: 'Послание Рейгана советскому руководству',
    date: '29 апреля 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf20
  },
  {
    title: 'График измерения радиации в Киеве',
    description: 'Уровень радиации в Киеве',
    date: '30 апреля – 2 мая 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf21
  },
  {
    title: 'Справка об информации из мест эвакуации',
    description: 'Сводка данных из пунктов эвакуации',
    date: '8 мая 1986',
    emoji: '🔒',
    type: 'pdf',
    pdfUrl: kgbPdf22
  },

]

// Вычисляемое свойство
const currentKgbDoc = computed(() => {
  return kgbDocuments[kgbIndex.value] || null
})

// Функции для КГБ
const openKgbModal = (index: number) => {
  const item = kgbDocuments[index]
  
  if (item.type === 'pdf' && item.pdfUrl) {
    kgbIsPdfView.value = true
    kgbCurrentPdfUrl.value = item.pdfUrl
    kgbIndex.value = index
  } else {
    kgbIsPdfView.value = false
    kgbCurrentPdfUrl.value = ''
    kgbIndex.value = index
  }
  
  kgbModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeKgbModal = () => {
  kgbModalOpen.value = false
  document.body.style.overflow = ''
  kgbIsPdfView.value = false
}

const nextKgb = () => {
  const photoDocs = kgbDocuments.filter(d => d.type !== 'pdf')
  if (kgbIndex.value < photoDocs.length - 1) {
    kgbIndex.value++
  }
}

const prevKgb = () => {
  if (kgbIndex.value > 0) {
    kgbIndex.value--
  }
}

const goToKgb = (index: number) => {
  kgbIndex.value = index
}

// Фотографии
const images: GalleryImage[] = [
  {
    src: photo1,
    title: '4-ый энергоблок после аварии',
    description: 'Чернобыльская АЭС имени В.И. Ленина за несколько лет до катастрофы',
    date: '1983 год',
    category: '1',
    type: 'image'
  },
  {
    src: photo2,
    title: 'Дезактивационные работы',
    description: 'Обеззараживание территории от радиоактивной пыли',
    date: 'май–июнь 1986',
    category: 'Ликвидация',
    type: 'image'
  },
  {
    src: photo3,
    title: 'Дезактивационные работы на рабочей площадке ЧАЭС',
    description: 'Ликвидаторы смывают радиацию с площадки',
    date: '1986',
    category: 'Ликвидация',
    type: 'image'
  },
  {
    src: photo4,
    title: 'Дезактивация транспорта',
    description: 'Машины проходят спецобработку на постах',
    date: '1986',
    category: 'Ликвидация',
    type: 'image'
  },
  {
    src: photo5,
    title: 'Измерение уровня радиации в зоне аварии',
    description: 'Замер радиации вблизи разрушенного блока',
    date: 'Апрель–май 1986',
    category: 'Авария',
    type: 'image'
  },
  {
    src: photo6,
    title: 'Кладбище зараженной техники',
    description: 'Брошенная техника с опасным уровнем радиации',
    date: '1986',
    category: 'Ликвидация',
    type: 'image'
  },
  {
    src: photo7,
    title: 'На подъезде к ЧАЭС',
    description: 'Транспорт на подъезде к станции',
    date: '1986',
    category: 'После аварии',
    type: 'image'
  },
  {
    src: photo8,
    title: 'Облет Припяти в день эвакуации',
    description: 'Аэрофотосъёмка Припяти',
    date: '27 апреля 1986',
    category: 'Авария',
    type: 'image'
  },
  {
    src: photo10,
    title: 'Поврежденный ротор турбогенератора 1-го энергоблока после аварии',
    description: 'Искореженный ротор турбогенератора первого блока',
    date: '1986',
    category: 'После аварии',
    type: 'image'
  },
  {
    src: photo9,
    title: 'Около решеток 4-го энергоблока во время ликвидационных работ',
    description: 'Ликвидаторы у вентиляционных решёток блока',
    date: '1986',
    category: 'Ликвидация',
    type: 'image'
  },
  {
    src: photo11,
    title: 'Подготовка к первомайскому параду 1986 на Хрещатике',
    description: 'Киев готовится к параду 1 мая 1986',
    date: '30 апреля 1986',
    category: 'После аварии',
    type: 'image'
  },
  {
    src: photo12,
    title: 'Разбросанные на обочине леса (Черниговская область) радиоактивные обломки',
    description: 'Радиоактивные обломки вдоль лесной дороги',
    date: '1986',
    category: 'Ликвидация',
    type: 'image'
  },
  {
    src: photo13,
    title: 'Разрушенный 4-ый энергоблок',
    description: 'Четвёртый блок после взрыва',
    date: '1986',
    category: 'Авария',
    type: 'image'
  },
  {
    src: photo14,
    title: 'Строители оставляют памятные надписи на металлоконструкциях (Черниговская область)',
    description: 'Надписи строителей на загрязнённых конструкциях',
    date: '1986',
    category: 'После аварии',
    type: 'image'
  },
  {
    src: photo15,
    title: 'Строительство 4-го энергоблока',
    description: 'Строительство четвёртого блока до ввода',
    date: 'до 1983 года',
    category: 'До аварии',
    type: 'image'
  },
  {
    src: photo16,
    title: 'Строительство объекта Укрытие',
    description: 'Возведение саркофага над четвёртым блоком',
    date: 'июнь–ноябрь 1986',
    category: 'Ликвидация',
    type: 'image'
  },
  {
    src: photo17,
    title: 'Строительство объекта Укрытие 2',
    description: 'Монтаж конструкций саркофага',
    date: 'июнь–ноябрь 1986',
    category: 'Ликвидация',
    type: 'image'
  },
  {
    src: photo18,
    title: 'Фото ликвидаторов аварии на ЧАЭС из архива А.В. Морева',
    description: 'Ликвидаторы в защитных костюмах и респираторах',
    date: '1986',
    category: 'Ликвидация',
    type: 'image'
  },
  {
    src: photo19,
    title: 'Центральный зал реактора',
    description: 'Центральный зал реактора РБМК-1000',
    date: '1986',
    category: 'До аварии',
    type: 'image'
  },
  {
    src: photo20,
    title: 'Центральный зал 4-го энергоблока',
    description: 'Центральный зал четвёртого блока',
    date: '1983',
    category: 'До аварии',
    type: 'image'
  },
  {
    src: photo21,
    title: 'Шестая больница в Москве принимающая пожарников первыми гасившими',
    description: 'Шестая больница Москвы: пожарные на лечении',
    date: 'апрель–май 1986',
    category: 'После аварии',
    type: 'image'
  },
  {
    src: photo22,
    title: 'Вертолёт, принимавший участие в ликвидации последствий',
    description: 'Вертолёт сбрасывает смесь над реактором',
    date: 'апрель–май 1986',
    category: 'Ликвидация',
    type: 'image'
  },
  {
    src: photo23,
    title: 'Город Припять до аварии на ЧАЭС',
    description: 'Припять — город-спутник Чернобыльской АЭС',
    date: 'До 26 апреля 1986',
    category: 'До аварии',
    type: 'image'
  },
  {
    src: photo24,
    title: 'Облет ЧАЭС',
    description: 'Аэрофотосъёмка станции 27 апреля 1986',
    date: '27 апреля 1986',
    category: 'Авария',
    type: 'image'
  },
  // PDF документы
  
]

// Обновите openModal
const openModal = (index: number) => {
  const item = images[index]
  
  if (item.type === 'pdf' && item.pdfUrl) {
    // PDF - показываем в модальном окне
    isPdfView.value = true
    currentPdfUrl.value = item.pdfUrl
    activeImages.value = [item]  // один элемент
    currentIndex.value = 0
  } else {
    // Обычное фото
    isPdfView.value = false
    currentPdfUrl.value = ''
    activeImages.value = images.filter(img => img.type !== 'pdf')
    const photoIndex = activeImages.value.findIndex(img => img.title === item.title)
    currentIndex.value = photoIndex >= 0 ? photoIndex : 0
  }
  
  modalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  modalOpen.value = false
  document.body.style.overflow = ''
  isPdfView.value = false
  currentPdfUrl.value = ''
}

// Газетные вырезки (с поддержкой PDF)
const newspapers: GalleryImage[] = [
  {
    src: img1,
    title: 'Катастрофа на Чернобыльской АЭС: эвакуация 30-километровой зоны',
    description: 'Советы просят помощи у Запада после ядерной аварии',
    date: '29 апреля 1986',
    emoji: '📰',
    type: 'image',
    details: `Советские официальные лица объявили аварию на Чернобыльской АЭС «катастрофой» и очистили зону в радиусе 30 км. Эвакуированы десятки тысяч людей. Неподтверждённые сообщения о многих смертях, но официальные данные говорят только о двух погибших.
СССР обратился к Западу за помощью в тушении пожара на станции. Советское посольство в Стокгольме связалось с шведскими ядерными инспекторами; советский дипломат также появился в центре МИД ФРГ в Бонне.
Полный масштаб аварии пока неясен. Ожидается, что советское правительство опубликует заявление. Один реактор в Чернобыле повреждён, но степень разрушений неизвестна.
Шведский чиновник сообщил, что другие реакторы в СССР были эвакуированы (вероятно, персонал) из-за близости к станции.
Западногерманский центр заявил: по данным российских властей, пожар начался примерно за 10 часов до аварии, причина — возгорание в комнате управления реактором.
Радиоактивное облако прошло более 1000 км. В Дании и Норвегии также проводилась эвакуация. Михаил Горбачёв призвал к международным усилиям.
Скандинавские показатели радиоактивности сегодня снизились.
МАГАТЭ в Вене уведомлено об аварии, но деталей не получило.
BBC: почти наверняка реактор выгорит. Бывший советник Nuclear Safety Commission of Canada заявил, что авария на Три-Майл-Айленде выглядит на этом фоне как «тестовый запуск».
Глава аппарата Белого дома Дональд Риган предупредил Рейгана о ядерной угрозе.
Бывший глава ядерного наблюдателя ООН выразил обеспокоенность чрезвычайной ситуацией в Чернобыле (130 км).
BBC сообщает о первых данных высокой радиации близ деревни Кыштым под Челябинском — авария может затронуть миллионы людей.
Представитель датской ядерной лаборатории в Рисё: высокие уровни энергии выброшенного радиоактивного материала похожи на те, что наблюдаются при производстве ядерного топлива.
Британские эксперты называют аварию тревожной. Питер Тейлор (группа политической экологии): выброс цезия-137 вызовет долгосрочный серьёзный ущерб здоровью.
Спекуляции о масштабной эвакуации из Чернобыля, но услуги ограничены только для перемещённых лиц.`
  },
  {
    src: img2,
    title: 'Радиоактивное облако над Польшей и первомайский марш',
    description: 'Польша сообщает о повышении йода после аварии в Чернобыле',
    date: '30 апреля – 1 мая 1986',
    emoji: '📰',
    type: 'image',
    details: `«Встретимся в первомайском марше». Лозунг: «Пролетарии всех стран, соединяйтесь!» 
    «Сообщение правительственной комиссии по оценке уровня ядерного излучения и профилактическим мероприятиям»
    В связи с аварией на Чернобыльской АЭС к северу от Киева над территорией северо-восточных воеводств Польши перемещается на большой высоте радиоактивное облако. На всей территории страны проводятся систематические измерения, в том числе подземные. Измерения ведутся Центральной лабораторией радиационной защиты, химическими войсками, Институтом метеорологии и водного хозяйства, санитарно-эпидемиологическими станциями. Используются современные технические средства, включая авиацию и сеть наземных пунктов.
На основании измерений, произведённых 23 числа текущего месяца (bm.) в 15:00, установлено, что произошло лишь повышение концентрации активного йода в воздухе.`
  },
  {
    src: img3,
    title: 'Чернобиль: трагедия, которую ощутил весь мир',
    description: 'Канадские эксперты сравнивают CANDU и РБМК. Горбачев просит помощи.',
    date: 'май 1986',
    emoji: '📰',
    type: 'image',
    details: `Ian Wilson, Торонто: «Может ли это случиться у нас? В непосредственной опасности ли мы?» Новости об аварии на Чернобыльской АЭС на Украине попали на первые полосы канадских газет. Представители ядерной промышленности заявили: «Это не может случиться у нас». Критики отметили, что русские тоже называли аварию «немыслимой». Сходство: оба реактора используют оксид урана и сплав ниобий-цирконий. Различия: CANDU использует тяжелую воду как замедлитель, чернобыльский реактор — графит. У CANDU есть защитная оболочка (4 фута железобетона), у Чернобыля такой оболочки не было. CANDU имеет систему конденсации радиоактивного пара. Самое важное различие — зависимость каждого реактора от своей системы охлаждения.

James Ferrabee, Торонто: Михаил Горбачев в 27-минутной телевизионной речи сказал: «Благодаря эффективным мерам худшее позади. Конец, конечно, ещё не наступил». Он признал, что больше людей погибло, и почти 300 пострадавших (позже пересмотрено до 200 дополнительных смертей).

Tom Wicker, Нью-Йорк: Запад может тихо радоваться положению советского правительства после Чернобыля. Москва вынуждена к беспрецедентной открытости. Горбачев призвал к «международному режиму» контроля за реакторами. Возобновил мораторий на ядерные испытания (США за тот же период провели 11 испытаний). Реакция Вашингтона была в основном критической: задержка с сообщением об аварии «доказывает», что Москве нельзя доверять.

Канадская ядерная промышленность приветствовала участие Канады в международном обзоре. Канада — активный член МАГАТЭ с 1967 года. Советский Союз лишь недавно допустил инспекции МАГАТЭ, но блоки в Чернобыле не проверялись.

Malcolm W. Browne: О переносном гамма-спектрометре в Стокгольме. Прибор установлен на деревянном штативе, смотрит в землю. Шведские детективы используют его, чтобы выяснить, что произошло на Чернобыльской АЭС. Радиоактивные осадки опасны: гамма-частицы можно вдохнуть или проглотить, они вызывают лучевую болезнь, рак. В Швеции, за сотни миль, приходится полагаться на осадки. В Стокгольме загрязнение незначительно, но в 160 км к северу — обширное "горячее пятно", где временно запрещен выпас скота. 25 станций мониторинга по всей Швеции используют ионизационные камеры.`
  },
  {
    src: img4,
    title: 'Чернобыль в Германии?',
    description: 'Обложка (журнал с надписью «Angst» — страх) и фрагмент статьи',
    date: 'май 1986',
    emoji: '📰',
    type: 'image'
  },
  {
    src: img5,
    title: 'Супер-ГАУ в Советском Союзе',
    description: 'Убийственный атом',
    date: '5 мая 1986',
    emoji: '📰',
    type: 'image',
    details: ''
  },
  {
    src: img7,
    title: 'Радиоактивные осадки в Швеции после Чернобыля',
    description: 'Шведская охота под вопросом из-за радиации после аварии',
    date: 'конец апреля 1986',
    emoji: '📰',
    type: 'image',
    details: `Нет паники. Охота на лося, вероятно, может вестись в обычных масштабах, но сомнения вызывают августовская охота на раков (речных раков?), по крайней мере, в тех частях страны, которые пострадали от радиоактивных осадков сильнее всего. Svensk Jakt представляет здесь — и в следующих номерах — текущую ситуацию месяц за месяцем.

Утром в понедельник 28 апреля власти получили сигнал тревоги. У двух техников на АЭС Форсмарк обнаружили повышенную радиоактивность на одежде и обуви. Посетители и весь персонал, который не требовался для работы и обеспечения безопасности, были эвакуированы, пока искали источник. Но никаких выбросов на месте обнаружить не удалось, реакторы работали как обычно. Кроме того, вскоре поступили сигналы из исследовательской станции в Студсвике.

Радиоактивность должна была исходить откуда-то ещё.

После того как Шведский метеорологический и гидрологический институт (SMHI) установил, что ветер в выходные был юго-восточным, подозрения пали на Советский Союз. Советские власти сообщили, что на украинской АЭС в Чернобыле (130 км от Форсмарка и шведского побережья) взорвался реактор. Авария произошла уже в субботу, то есть за два дня до того, как Швеция и остальной мир что-либо узнали.

То, что внимание — не только у нас, но и за рубежом — сосредоточилось именно на северном Уппланде, было случайностью, но, как оказалось, оправданной. В результате несчастливого сочетания ветров и дождей Естрикланд и северный Уппланд стали районом, пострадавшим сильнее всего во всей Европе.`
  },
  {
    src: img8,
    title: 'Советский Союз признал ущерб от ядерной аварии',
    description: 'Авария в Чернобыле хуже, чем на Три-Майл-Айленде',
    date: '29 апреля 1986',
    emoji: '📰',
    type: 'image',
    details: `Ларс Эрик де Гер (Швеция): «Это должна быть относительно крупная авария, раз мы получили такие высокие уровни радиации издалека».

Эдвард Джераджян (пресс-секретарь Белого дома): «Должно быть очень серьёзно, если Советы об этом говорят».

Биргитта Даль (глава энергетики Швеции): «Они должны были немедленно предупредить нас. Мы должны требовать более высоких стандартов безопасности в СССР».

Фрэнк Грэм (вице-президент Atomic Industrial Forum): «Мы недостаточно знаем, чтобы сказать».

Эд Зебровски (главный ядерный ученый): «Если радиоактивность составляет целых 700 миллионов кюри, я бы не хотел находиться в пределах 10 миль от повреждённой станции».

Ричард Реба (медицинский центр Университета Джорджа Вашингтона): «Радиационное поражение не станет основным фактором» для советских граждан, кроме тех, кто находится очень близко к аварии.

Заметка Кена Олсена (Associated Press, Москва):
Представитель МИД предупредил, что поездка в Киев может быть опасной из-за аварии на Чернобыльской АЭС. Шведский эксперт сообщил, что советские чиновники обращались за советом по тушению пожара на АЭС. Подтверждённых данных о погибших или пострадавших нет, хотя эксперты в США говорят о расплавлении топлива и жертвах. Tass впервые сообщило об аварии вчера в четырёх предложениях. Аномально высокий уровень радиации зафиксирован в Швеции, Дании и Финляндии (более 750 миль к северо-западу).

Заметка Гая Дарста (Associated Press, Вашингтон):
Учёные и чиновники США приходят к выводу, что авария в СССР — полноценное расплавление топлива и гораздо серьёзнее, чем на Три-Майл-Айленде (ТМА). Чернобыль — примерно в 100 милях к северу от Киева. При аварии на ТМА в 1979 году никто не погиб. Венгерское радио сообщило о пострадавших. ТМА считается худшей коммерческой ядерной аварией в США, но там было очень мало выбросов.

«Угроза здоровью США от осадков минимальна. Советские чиновники признали катастрофический ущерб для СССР».`
  },
  {
    src: img9,
    title: 'Конструкция реактора могла усилить опасность аварии',
    description: 'Графитовый реактор РБМК не имел защитной оболочки, как на Западе',
    date: '29–30 апреля 1986',
    emoji: '📰',
    type: 'image',
    details: `СССР придавал высокий приоритет развитию атомной энергетики. На конец 1985 года мощность гражданских АЭС составляла 28 000 МВт, выработка — 170 млрд кВт·ч (11% от общей). СССР занимал 3-е место после США и Франции.

Запасы ископаемого топлива в густонаселенных западных районах сокращались. Горбачев в феврале 1986 года обещал увеличить выработку АЭС в 2,5 раза к 1990 году.

Чернобыльская АЭС:

Одна из крупнейших и старейших в СССР. Проектная мощность — 6000 МВт к 1990 году. На конец 1985 года работали 4 реактора по 1000 МВт каждый (1/7 всей ядерной мощности СССР). Пятый должны были запустить в 1986 году.

Строительство началось летом 1972 года. Первый реактор — 1977, второй — 1978, третий — 1981, четвертый — 1983.

Станция снабжала электроэнергией Восточную Европу (около 20 млрд кВт·ч в год). Крупная часть мощности уходила в Венгрию.

Конструкция реактора:

СССР использовал два типа: водо-водяные и графитовые (графит как замедлитель). Чернобыльский — водо-охлаждаемый, графито-замедленный (РБМК).

США используют воду для замедления (Light Water Reactor).

Графитовый реактор — «российская конструкция, построенная по российским стандартам».

Графит обладает высокой теплоёмкостью, но графит и уран могут гореть при перегреве.

Ранние советские реакторы не имели защитных оболочек (контайнментов). Кочран видел фотографии Чернобыля и уверен, что реакторы не внутри защитных оболочек.

В США все реакторы имеют такие оболочки (толстый бетон).

Представитель Atomic Industrial Forum Скотт Питерс: «Советы не начали устанавливать защитные оболочки до 1979 года, а два чернобыльских реактора были запущены до 1979 года. Без оболочки выбросу радиоактивности ничто не мешает».

Некоторые эксперты считают, что СССР отказывается от графитовых реакторов. Дон Уинстон: у СССР 28 графитовых реакторов, но новых будет немного.

Регулирование и инспекции:

Создан отдельный Госкомитет по безопасности в атомной энергетике.

В 1985 году СССР подписал соглашение об инспекциях МАГАТЭ, но реактор в Чернобыле не проверялся. Представитель МАГАТЭ Ханс-Фридрих Мейер: инспекторам разрешили доступ только на одну АЭС и один исследовательский реактор, не похожие на чернобыльский.`
  },
  {
    title: 'Пакшская АЭС получила звание «Отличное предприятие» второй раз',
    description: 'Венгерская АЭС в Пакше отчитывается о безопасности после Чернобыля',
    date: 'Май 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf1, 
    details: `Стр. 1:
9 мая 1986 года на торжественной церемонии предприятие Пакшской АЭС (PAV) во второй раз получило звание «Отличное предприятие». Присутствовали партийные и государственные деятели.
Выступление генерального директора József Pónya:

Предприятию 10 лет (основано 1 января 1976 г.), численность — 3500 человек.

Первый блок подключён 28 декабря 1982 г.

За 3 года выработано 12,72 млрд кВт·ч.

В 1985 году выработка — 6,48 млрд кВт·ч (блок №1 — 3,19; блок №2 — 3,29).

Коэффициент готовности — 95% (с учётом простоев — 86%).

После катастрофы в Чернобыле: безопасность — важнейший приоритет. Выражены соболезнования советским коллегам.

В 1986 году предстоит запуск 3-го блока и монтаж 4-го.

Стр. 2:
Статья о развитии города Пакш при участии местного сообщества и совета.

Стр. 3:
Статья «Атомная электростанция и охрана окружающей среды»:

АЭС не потребляет кислород, не производит оксиды углерода, серы и азота, не выбрасывает золу.

Радиоактивные выбросы сводятся к минимуму.

Многократные системы безопасности и фильтры.

23 станции контроля окружающей среды (в том числе в радиусе 1,5 км).

Фактические дозы облучения населения от выбросов Пакшской АЭС пренебрежимо малы (менее 1% от естественного фона).

Примечание редакции: эта система работала во время и после чернобыльской аварии, результаты измерений использовались для оценки обстановки в стране.`
  },
  {
    title: 'Первомайская демонстрация «Солидарности» в Познани',
    description: 'Акции протеста, аресты, отказ от строительства АЭС',
    date: 'Май 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf2,
    details: `О 1 мая в Познани:
После мессы в приходском костёле (около 200 человек) на улочках Старого города собралась большая группа демонстрантов. Скандировали солидарностские лозунги, а также: «Руки прочь от Афганистана!» и «Не хотим атомных электростанций». На Старом Рынке демонстрантов приветствовали аплодисментами прохожие познаньцы, часть из них быстро присоединилась к шествию. Демонстрацию также аплодировала экскурсия японцев, усердно снимавшая это событие. Поскольку улица Падеревского была закрыта кордоном ZOMO, марш двинулся по улицам Вроцлавской и Пульвейской. Жители домов бросали демонстрантам цветы. На Пульвейской к акции приступил ZOMO. Началось избиение палками, задержано около десятка человек. В то же время в недалёком парке к избиению подключились сотрудники в штатском, используя очень короткие складные дубинки. Здесь также задержано по крайней мере несколько человек. Попытка отбить одного из демонстрантов с помощью камней и металлического контейнера не удалась. Некоторую радость познаньцам доставило появление водомёта, который перед этим… сломался. Общее число демонстрантов оценивается примерно в 1500 человек, задержано около 20. Большинство отпущено до истечения 48 часов. Из сообщений из других городов следует, что — неожиданно — независимая первомайская демонстрация в Познани была крупнейшей в Польше.

О новых арестах и приговорах:
В марте арестована Малгожата Йохимяк (студентка медицинской академии в Познани). 13 апреля арестован Войцех Скибиньский (врач в больнице PKF в Пущикове), 16 апреля — Яцек Фогт (ученик торговой школы).
Также в апреле вынесены приговоры политзаключённым:
Шимон Лукасевич (студент УАМ) — 2 года лишения свободы условно на 5 лет (ст. 262а УК).
Анджей Кадке (студент УАМ) — 2 года (ст. 252а и 176 УК).
Ярослав Воевудзкий (Гожув-Велькопольски, член WIF) — 2,5 года за отказ от присяги в армии.
Кшитоф Соболевский (член WIF) — 7 мая в Познани приговорён к 3 годам лишения свободы за отказ от присяги.

Партийное обязательство:
28 января заместитель министра внутренних дел Пшияз (Przyjaź?) заявил перед сеймом, что «указание I секретаря провести X съезд в "очищенном ландшафте" является директивой, определяющей основную цель министерства на ближайшее время». В частности, МВД намерено: 1) ликвидировать ещё действующие подпольные структуры; 2) продолжать с большей активностью ограничивать нелегальную полиграфическо-издательскую деятельность; 3) более эффективно ограничивать, используя различные правовые меры, политическую деятельность экстремальной части клира. (Цитата за TM 163).
Авторы комментария посвящают это обязательство всем «нелегальным»… аресты в Познани за последние два месяца доказывают не только таланты министерства, но и (к сожалению) большую беспечность задержанных.`
  },
  {
    title: 'Первомайские торжества и сообщения о Чернобыле в Венгрии',
    description: 'Демонстрации, советские руководители в Чернобыле, замеры радиации в Венгрии',
    date: '4 мая 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf3, 
    details: `Стр. 1–3: Первомайские торжества в медье Бач-Кишкун (Кечкемет, Кишкунхалаш, Кишкунфеледьхаза, Тисакечке, Бая):

В Кечкемете в парке Катоны Йожефа прошёл торжественный митинг с участием партийных и государственных руководителей. Выступал др. Кёрёш Гаспар, генеральный секретарь Совета профсоюзов Венгрии. Говорилось о задачах VII пятилетки, необходимости интенсификации экономики, повышении качества и производительности труда. В конце митинга участники спели «Интернационал», затем состоялись культурные и спортивные мероприятия, народные гулянья с едой и напитками.

В Кишкунхалаше наградили социалистическую бригаду «Összetartás» (10 человек) почётным званием «Отличная бригада ВНР». Награду вручил Романь Пал, первый секретарь медьевого комитета партии. Бригадир Репаш Шандор рассказал о работе (уход за 1000 коров, отёлами, 133% выполнения плана).

В Кишкунфеледьхазе на майском пикнике в парке собралось 15–20 тысяч человек. Выступали местные коллективы, прошли футбольные матчи, вечером бал.

В Тисакечке прошла демонстрация 600 учащихся с гимнастическими упражнениями и цветными воздушными шарами.

В Бае состоялось шествие с участием студентов, рабочих, предприятий и кооперативов.

Стр. 2: Советские руководители в Чернобыле:

Высокопоставленные советские руководители (Николай Рыжков, Егор Лигачёв, Владимир Щербицкий, Борис Щербина и др.) посетили район Чернобыльской АЭС в пятницу (2 мая). Они ознакомились с мерами по ликвидации последствий аварии, нормализации обстановки и помощи местному населению. Посетили временно отселённых жителей, интересовались их жизнью, трудоустройством, работой школ и детских учреждений.

Борис Ельцин (член Политбюро ЦК КПСС, первый секретарь московского горкома партии) в интервью западногерманскому телевидению ARD заявил, что радиоактивность в районе аварии значительно снизилась. Реактор сразу отключили, цепная реакция остановлена. С вертолётов сбрасывают мешки с песком, свинцом и бором, создавая непроницаемый купол, препятствующий дальнейшему загрязнению воздуха. Реки остались свободными от ядерного загрязнения.

Стр. 2: Ситуация в Венгрии:

Венгерская техническая служба контроля продолжает измерение воздуха, воды, почвы, растительности и продуктов питания. Согласно последним данным, в районе Будапешта уровень радиоактивности воздуха снизился, в других местах существенных изменений нет. Уровень радиации везде далёк от вредного для здоровья предела.

Специалисты гражданской обороны в целях повышенной осторожности рекомендуют детям употреблять только проверенное молоко от молочной промышленности, а свежесобранные крупнолистные овощи (шпинат, салат, щавель и др.) перед употреблением или приготовлением несколько раз тщательно мыть в большом количестве воды.

Стр. 2: Еженедельная хроника событий (включая Чернобыль):

В четверг (1 мая) Советский Союз по дипломатическим каналам информировал затронутые страны об аварии на АЭС.`
  },
  {
    title: 'Пресс-конференция о Чернобыле: причины и последствия аварии',
    description: 'Советская комиссия сообщила о жертвах, эвакуации, уровне радиации',
    date: '7 мая 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf4,
    details: `Стр. 2 (основная статья: «Продолжается расследование. Информация о событиях на Чернобыльской АЭС»):

Во вторник в Москве прошла пресс-конференция членов советской правительственной комиссии по расследованию аварии, прибывших из зоны бедствия.

Председатель комиссии, заместитель председателя Совета министров Борис Щербина сообщил:

Специалисты ещё не завершили расследование, доклад комиссии не готов.

Наиболее вероятная причина — химический взрыв в четвёртом блоке, в результате которого в атмосферу попала большая доза радиации.

Из 30-километровой зоны эвакуировано население. Большинство временно размещены у семей в Киеве.

При аварии погибли два человека: один от ожогов, другой — упав с высоты при взрыве.

Около 200 человек получили лучевую болезнь, из них 18 в тяжёлом состоянии. С 28 апреля всех лечат в Москве. К лечению привлечены два американских специалиста: профессор Гейл (трансплантация костного мозга) и профессор Тарсаки (иммунолог).

Повреждённый энергоблок находится в заглушенном состоянии, цепная реакция прекращена автоматически. Три других реактора остановлены. На станции постоянно дежурят 150 человек. Первые два блока могут возобновить работу в любое время, третий требует тщательной техпроверки.

Благодаря принятым мерам радиационная обстановка в районе нормализуется. Вблизи станции уровень радиации снизился с 10–15 миллирентген в час до трети (от исходного).

В Украине, Белоруссии и Молдавии радиоактивное загрязнение не превышает норм, считающихся безопасными по стандартам МАГАТЭ и Минздрава СССР.

Заместитель главы Гидрометеослужбы Юрий Седунов:

Излучение из Чернобыля не представляет опасности для жителей отдалённых районов СССР и соседних стран. В Москве никаких изменений радиационного фона не обнаружено.

Председатель Государственного комитета по атомной энергетике Андроник Петросьянц:

Аварии на АЭС случались и в других странах (США, Великобритания). Это не означает остановки развития атомной энергетики. Строительство АЭС — необратимый мировой процесс, но обращаться с атомной энергией нужно крайне осторожно.

Первый заместитель министра иностранных дел Анатолий Ковалёв:

СССР благодарит иностранные правительства, общественные организации и частных лиц за соболезнования и предложения помощи.

Западные СМИ (особенно США) распространяют клевету и используют аварию для обострения международной напряжённости.

Конструкция реактора соответствовала международным нормам. Произошло стечение нескольких маловероятных событий, не исключена ответственность обслуживающего персонала.

Эвакуация проводилась по заранее подготовленным планам: у каждого дома или подъезда утром 27 апреля с 2 часов дня автобусы вывезли население. Организована медицинская помощь, сдача крови (из Киева и области). Пострадавшие получили денежные выплаты, бесплатную одежду и другую помощь.

До 1 мая повышенный уровень радиации был в Польше, после 2 мая — в Румынии, но кратковременно и уровень был невысоким.

Информацию о происшествии СССР предоставил зарубежным странам 28 апреля, в тот же день было опубликовано заявление.

В СССР всего 41 атомная электростанция или реакторный блок. Члены комиссии прибыли на место в течение нескольких часов после уведомления.

Стр. 2 (хроника событий за неделю, врезка):

Четверг (1 мая): СССР по дипломатическим каналам информирует затронутые страны об аварии на АЭС.`
  },
  {
    title: 'Жертвы вероятны после советской ядерной аварии',
    description: 'Радиация достигла Скандинавии, Канада вне опасности',
    date: '29 апреля 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf5,
    details: `В понедельник Советский Союз сообщил, что ядерная авария повредила атомный реактор на Чернобыльской АЭС на Украине.

Радиация распространилась над Финляндией, Данией и Швецией — более чем за 1200 км.

Официальный представитель Госдепартамента США заявил, что, вероятно, есть жертвы, поскольку радиация распространилась так далеко.

Официальное агентство ТАСС сообщило, что пострадавшим оказывается помощь, но не сказало, есть ли раненые или погибшие, когда произошла авария и точное расположение станции.

Однако подконтрольное правительству венгерское радио рано утром сообщило, что в аварии под Киевом есть пострадавшие. «Есть раненые… Раненые получают медицинскую помощь. Принимаются меры по ликвидации последствий аварии».

ТАСС назвал это первой ядерной аварией в Советском Союзе и сообщил о назначении правительственной комиссии, что указывает на серьёзность происшествия.

Ларс Эрик де Гер из Шведского оборонного исследовательского агентства: «Это должна быть относительно крупная авария, раз мы получили такие высокие уровни радиации издалека». Уровни радиации соответствуют зафиксированным после испытаний ядерного оружия в атмосфере в 1970-х годах. «Я не знаю ни одной предыдущей аварии на АЭС, которая привела бы к таким высоким уровням радиации в этом районе».

Врезка (Picture A3):

В Канаде не обнаружено радиоактивных осадков от аварии, заявил Эрнест Летурно, глава федерального Бюро радиации и медицинских устройств. Бюро проводит ежедневные замеры на метеостанциях по всей стране на всякий случай. «Было бы очень удивительно, если бы что-то появилось».

Будапештское радио отметило, что Чернобыль расположен в месте слияния двух рек — Припяти и Ужи, «где начинается Киевское водохранилище на Днепре». Других упоминаний о водоснабжении Киева (город с населением 2,4 млн) не было.

Финляндия сообщила о повышенной радиации в воскресенье вечером, но ни Финляндия, ни Швеция не заявили, что уровни опасны.

Украинцы-канадцы из Эдмонтона, имеющие родственников в СССР, вероятно, будут вынуждены полагаться на письма, чтобы узнать, в безопасности ли их близкие, сказал Яр Славутыч, профессор Альбертского университета на пенсии. Мать и сестра Славутыча живут примерно в 500 км к югу от Киева в маленькой деревне и не имеют телефона. Он отправит им письмо сегодня, но оно дойдёт за три недели. «Я определённо встревожен… Это ужасная вещь», — сказал Славутыч, который был в Чернобыле в 1941 году.`
  },
  {
    title: 'Востокногерманская газета о Чернобыле: информации нет',
    description: 'Никакой информации о чернобыльской аварии в доступных фрагментах файла нет',
    date: '29 апреля 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf6
  },
  {
    title: 'Государственные награды ГДР к 1 мая 1986 года',
    description: 'В газете нет упоминаний о чернобыльской аварии',
    date: '30 апреля 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf7
  },
  {
    title: 'Первомайская демонстрация в Берлине и поддержка СССР',
    description: 'Никакой информации о чернобыльской аварии нет',
    date: '2 мая 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf8
  },
  {
    title: 'Съезд ГКП и возложение венков к дому Тельмана',
    description: 'Газета ГДР не упоминает Чернобыль, только политику ГКП',
    date: '3 мая 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf9
  },
  {
    title: 'Субботник в СССР и арест контрас в Никарагуа',
    description: 'В газете нет сообщений о чернобыльской аварии',
    date: '28 апреля 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf10
  },
  {
    title: 'Первомайская демонстрация в Берлине и награждения в ГДР',
    description: 'Подготовка к выборам, выполнение планов, нет упоминаний Чернобыля',
    date: '30 апреля 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf11
  },
  {
    title: 'Первомайские демонстрации и награждения в ГДР',
    description: 'В газете ГДР нет упоминаний о Чернобыле',
    date: '2 мая 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf12
  },
  {
    title: 'Катастрофа: Советы просят помощи. Эвакуация вокруг АЭС.',
    description: 'Радиационная утечка, эвакуация, запрос помощи у Запада',
    date: '30 апреля 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf13,
    details: `Советские официальные лица объявили аварию на Чернобыльской АЭС на Украине «зоной бедствия» и очистили территорию в радиусе 30 км. Десятки тысяч людей эвакуированы, есть неподтверждённые сообщения о многих жертвах.

Советский Союз попросил Запад о помощи в тушении пожара на станции.

Сообщается, что советский представитель на месте заявил о «чрезвычайном положении».

Полный масштаб аварии пока не известен. Советские власти связались с британскими и французскими властями во время аварии, но сообщили, что авария была вызвана пожаром.

Западногерманский центр заявил, что «очень обеспокоен» сообщением советского дипломата о том, что загорелся резервуар с ядерным топливом.

Советский Союз сначала отрицал наличие выбросов, но позже заявил, что пожар был вызван аварией после того, как уровень радиации поднялся до опасного.

МАГАТЭ сообщило, что авария была вызвана пожаром, и что пожар произошёл из-за резервуара с ядерным топливом, который загорелся.

Британский эксперт описал аварию как тревожную: период полураспада цезия-137 — более 30 лет, его присутствие приведёт к сильному загрязнению атмосферы. Сообщается о 137 миллионах кюри радиоактивного материала.

Высказываются предположения, что пожар был вызван аварией на Чернобыльской АЭС, но причина не известна. Рассматриваются несколько возможностей: пожар в реакторном зале, в машинном зале, в комнате управления.`
  },
  {
    title: 'Чернобыльская авария в британской газете',
    description: 'Обзор аварии от британцев',
    date: '30 апреля 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf14,
    details: `Швеция дала советы СССР: охлаждение, изоляция, контроль радиации. Официальное заявление СССР о чернобыльской аварии: Два погибших, повреждён четвёртый блок, эвакуация жителей. ФРГ критикует СССР и требует инспекций АЭС. Финляндия пересматривает планы покупки советских реакторов. Британские медсёстры хотят учиться действиям при ядерных катастрофах.
    Советский технический атташе в Стокгольме обратился в Шведскую инспекцию по ядерной энергетике за советом, как тушить пожар на чернобыльском реакторе.

Шведские официальные лица рекомендовали: 1) отключить другие реакторы поблизости; 2) приложить максимум усилий для охлаждения повреждённой активной зоны; 3) попытаться сдержать распространение радиоактивности.

По оценке шведов, произошло серьёзное расплавление активной зоны.

Уровень радиации в разных частях Швеции всё ещё в 100 раз выше нормы (особенно там, где был снег или дождь).
Авария произошла на четвёртом энергоблоке Чернобыльской АЭС (130 км севернее Киева). Работает правительственная комиссия во главе с Борисом Щербиной. Разрушена часть конструктивных элементов здания реактора, произошла определённая утечка радиоактивных веществ. Три других энергоблока остановлены и находятся в исправном состоянии («в оперативном резерве»). Два человека погибли. Приняты первоочередные меры по ликвидации последствий. Радиационная обстановка на станции и прилегающей территории стабилизирована. Жители посёлка АЭС и трёх близлежащих населённых пунктов эвакуированы. Состояние радиационной обстановки постоянно контролируется.

Советские дипломаты обратились за помощью в Западногерманский атомный форум (организацию ядерной промышленности), но правительство ФРГ подчеркнуло, что официального запроса от СССР не поступало.

Министр внутренних дел ФРГ Фридрих Циммерман раскритиковал СССР за непредупреждение других стран и потребовал сообщить все детали в МАГАТЭ.

Министр исследований и технологий Хайнц Ризенхубер призвал СССР согласиться на международные инспекции своих АЭС. По словам представителя, «это, очевидно, худшая ядерная авария в истории, и она всё ещё, кажется, не под контролем».

Все станции радиационного контроля в ФРГ приведены в особую готовность, но опасных уровней не зафиксировано.
`
  },
  {
    title: 'Финляндия эвакуирует своих граждан из Киева после аварии',
    description: 'Радиоактивное облако над Финляндией, эвакуация, советская помощь Запада',
    date: '1 мая 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf15,
    details: `Страница 1:

«Финнов эвакуируют из Киева. Разрешение на полёт ещё не подтверждено». Принято решение эвакуировать находящихся в Киеве финнов. Спецрейс должен забрать их в четверг днём. Разрешения на полёт и другие документы должны были быть готовы в Москве к вечеру среды, но подтверждения от финских властей ещё не получено. Решение об эвакуации принято утром в среду, до получения каких-либо сведений о возможном повреждении второго реактора. Неофициальная рабочая группа рекомендовала эвакуацию из соображений осторожности из-за отсутствия точных данных о рисках для здоровья в районе Киева. Также рекомендовано избегать ненужных поездок в южную часть СССР, Чехословакию, Польшу, Румынию и Венгрию. Всего в Киеве ещё находится более сотни финнов.

«По данным разведки в США: второй ядерный реактор также плавится». Официальные источники в США считают, что есть основания полагать, что второй реактор в Чернобыле расплавился или находится в процессе расплавления. Советское правительство опровергло предположения о тысячах погибших: официально сообщается о двух погибших, 197 госпитализированы, из них 49 уже выписаны домой. Уровень радиации в зоне аварии снижается. Советское телевидение показало кадры повреждённого блока, утверждая, что пожара на станции нет.

Страница 2:

«Ядерный пожар, возможно, потушен, но утечка радиации продолжается». По оценкам американских и шведских экспертов, пожар на Чернобыльской АЭС, похоже, потушен, но выбросы радиации продолжаются. В советском посольстве в Вашингтоне заявили, что цепная реакция остановлена, ситуация улучшается. По некоторым данным, СССР закрыл все реакторы графитового типа (РБМК). Это может вызвать энергетический дефицит. Финляндия продолжает получать электроэнергию из СССР по потребностям. Половина Европы принимает меры предосторожности: в Румынии и Польше детям давали йодид калия, Швеция, Норвегия и Дания ввели запрет на импорт продовольствия из СССР и четырёх других стран Восточной Европы.

«Чернобыль заражает Финляндию как ядерные испытания в 1960-х». Уровни радиации в Финляндии сопоставимы с началом 1960-х годов (атмосферные ядерные испытания). По данным Центра радиационной безопасности, ситуация аналогична той, что была после китайских испытаний. Показатели почти точно соответствуют уровню 1962–63 годов. Радиоактивное облако пришло в Финляндию в прошлые выходные узкой полосой. Дозы облучения финнов останутся лишь незначительно выше нормального фона. Финляндия не вводит ограничений на импорт продовольствия из Восточной Европы, но усилит контроль. Вернувшиеся из Киева финны обследованы, у некоторых обнаружены уровни радиации выше допустимых пределов.

Страница 3:

«Киевская газета предупреждала». В газете, выходящей в Киеве, около месяца назад появилась статья, предупреждавшая, что плохие стройматериалы, коррупция, бюрократия и фрустрация серьёзно угрожают безопасности Чернобыльской АЭС. Автор — Любовь Ковалевска, по оценкам эмигрантов, занимавшая как минимум руководящую должность среднего звена на станции. Статья опубликована 27 марта в украинском литературном журнале. Ковалевска указала местом жительства Припять (город рядом со станцией, 25 000 жителей эвакуированы после аварии). Она писала о трудностях при строительстве пятого реактора, но утверждала, что те же ошибки допускались ещё при строительстве первого реактора в 1978 году. Советские власти любой ценой хотели построить из Чернобыля крупнейшую в мире АЭС, отведя на строительство всего год. Строительные материалы были плохого качества, бетона не хватало (из заказанных 45 500 кубометров недопоставлено 3 200, и полученный бетон был низкого качества). Даже в готовых конструкциях есть недостатки, они не надёжны и не безопасны.

Страница 4:

«Кто возместит последствия радиации?» — письмо читателя (Jyrki Tuure, врач). Критика ядерной энергетики. Автор проводит параллель между пассивным курением и пассивным облучением: невинные граждане вынуждены получать радиацию. Властям следует срочно определить юридическую ответственность за частичное причинение смерти или за лечение детей, заболевших лейкемией. Человеческое горе и страдания ничем не возместить. Иронично предлагает выделить для курящих отдельные помещения, чтобы некурящие, которые могут неделями находиться в укрытиях, не подвергались пассивному курению.

Страница 5:

«Швеция отозвала обвинения в медлительности Финляндии». Финляндия и Швеция, судя по всему, уладили «информационный кризис»: шведы думали, что финны утаили информацию о повышении радиации. Министр энергетики Швеции Биргитта Даль якобы критиковала медлительность финнов. Представитель Даля заявил, что финны не медлили, а результаты автоматической системы измерений начали анализировать только в понедельник. Министр внутренних дел Финляндии Каиса Раутиайнен заявила, что Финляндии не за что извиняться. Северные эксперты по радиации встретились в Стокгольме. Финны представили международный доклад о ситуации. В Финляндии и Швеции измерены примерно одинаковые уровни радиации в молоке, хотя пиковые значения в Швеции выше из-за того, что коров там успели выпустить на пастбища до аварии. Финнам рекомендовано пока не выпускать коров на пастбища. Даны рекомендации по дождевой воде, салату, шпинату, грибам.

Страница 6:

«Радиационные данные поступили в Финляндию и Швецию одновременно». Глава Центра радиационной безопасности Антти Вуоринен опровергает слухи о том, что финские власти знали о радиации уже в воскресенье (на следующий день после аварии). Первые показания повышенного уровня поступили утром в понедельник 28 апреля. Первый звонок Вуоринену поступил из Швеции: глава шведской инспекции по ядерным реакторам сообщил в 13:45, что на АЭС Форсмарк подозревают утечку. Вуоринен приказал проверить финские АЭС, и чуть позже 14:00 смог сообщить в Швецию, что утечек нет.

Страница 7:

«Тысячи людей всё ещё тушат горящий реактор. Сотни людей бегут из Киева». В то время как тысячи людей работают над изоляцией аварийного реактора и прекращением выбросов, сотни женщин и детей покидают Киев. Премьер-министр Украинской ССР Александр Ляшко сообщил западным журналистам, что температура реактора сейчас 300 градусов и горение «практически полностью прекращено». Эвакуация происходила в два этапа: 27 апреля эвакуирована 10-километровая зона, 4 мая завершено опустошение 30-километровой зоны. ТАСС сообщил об очередях на вокзалах и в авиакассах Киева (женщины и дети стремятся уехать). Западногерманские учёные не исключают, что повреждённая активная зона прожгла бетонную конструкцию реактора и ушла в почву, что угрожает загрязнением грунтовых вод.

Страница 8:

«Шквал сотен звонков о последствиях радиации». Helsingin Sanomat впервые публикует ответы на вопросы читателей о влиянии радиации на жизнь в Финляндии. За три часа поступило несколько сотен звонков, в основном о чистоте садовых продуктов, воде и дожде.

Страница 9:

«Министр окружающей среды Матти Ахде винит чиновников в задержке информации». Ахде заявил, что в первые дни после аварии вся информация застревала у чиновников. Он сам узнал об аварии в понедельник вечером из новостей, а доклад получил только во вторник на заседании правительства. На вопрос, почему не позвонил подчинённым в Центр радиационной безопасности, ответил, что было поздно (10 вечера) и информация не была тревожной. Позже, когда ситуация стала напряжённой, Ахде находился на конференции в Женеве (куда ему звонили ежедневно). На вопрос, не следовало ли вернуться в Финляндию, ответил, что в этом не было необходимости. Считает, что критичность его позиции в отношении ядерной энергии не уменьшилась, но в дискуссиях о закрытии существующих АЭС следует соблюдать сдержанность.

Страница 10:

«Советский реактор всё ещё горит. Москва просила помощи у Запада». Официально сообщается о двух погибших. По мнению западных экспертов, это самая серьёзная авария на АЭС в мире, активная зона расплавилась. СССР обратился за помощью и советом по тушению графитового пожара к Швеции и Западной Германии. США уже предложили помощь по собственной инициативе. Дипломатам и журналистам в Москве запрещено ездить на Украину.

«Возвращающихся из Киева финнов обследуют. Уровни радиации упали во всех северных странах». Центр радиационной безопасности брал пробы воздуха каждый час. Уровни упали до менее 5% от максимумов понедельника. В Финляндии уровень радиации ниже, чем в Стокгольме. Сильнее всего загрязнение сейчас в Восточной Европе. По данным Метеорологического института, новых выбросов в сторону Финляндии не ожидается (ветер слабый, направление с запада на восток). Прибыла туристическая группа из 25 человек, которые были в Киеве во время аварии. Гид сообщил им о «взрывной аварии» в воскресенье утром, заверив, что опасности нет. Трём членам группы будут проведены измерения.

Страница 11:

«Ядерная авария в СССР. ТАСС сообщил о пострадавших. Облако загрязнения распространилось на Север». ТАСС впервые сообщил о возможной ядерной аварии. Пострадали люди, создана правительственная комиссия. Чернобыльская АЭС (4 реактора по 1000 МВт, запущена в 1977 году, три новых планируются) представляет собой другой тип реактора, чем Ловииса. Цитата: «Подобные аварии случались и в других странах, например, в США в Гаррисбурге». Ранее советские власти давали понять, что инциденты на АЭС не представляют большой опасности для населения. Финский Центр радиационной безопасности считает «очевидным», что радиоактивные осадки над Финляндией и другими скандинавскими странами — из СССР. В Финляндии в понедельник зафиксированы 5–6-кратные уровни радиации от нормы. Первые замеры — в воскресенье вечером в Каяани, затем в Тампере, Олкилуото, Турку. В Хельсинки — примерно в 5 раз выше нормы. Обычно уровень падает через пару дней, но в Каяани уже сутки держатся высокие показатели, что говорит о постоянном поступлении новой радиации. Измерения также в Швеции, Норвегии, Дании. Шведы эвакуировали АЭС Форсмарк, предположив утечку там. Подчёркивается, что опасности для людей нет, уровни составляют лишь несколько тысячных от тех, которые требуют предупреждения.`
  },
  {
    title: 'Известия 1.05',
    description: 'Праздник первомая, нет упоминаний об аварии',
    date: '1 мая 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf16
  },
  {
    title: 'Известия 2.05',
    description: 'Нет упоминаний о Чернобыльской катастрофе',
    date: '2 мая 1986',
    emoji: '📰',
    type: 'pdf',
    pdfUrl: pdf17
  }
]

// Видео
const videos: VideoItem[] = [
  {
    title: 'Чернобыль: хроника катастрофы',
    description: 'Документальный фильм о событиях 26 апреля 1986 года',
    duration: '52:14',
    emoji: '🎥'
  },
  {
    title: 'Битва за Чернобыль',
    description: 'Рассказ очевидцев о первых днях после аварии',
    duration: '1:34:22',
    emoji: '📹'
  },
  {
    title: 'Зона отчуждения сегодня',
    description: 'Современные съёмки Чернобыльской зоны',
    duration: '28:45',
    emoji: '🎬'
  },
  {
    title: 'Ликвидаторы: герои Чернобыля',
    description: 'Интервью с участниками ликвидации последствий',
    duration: '45:10',
    emoji: '🎞️'
  }
]

// Вычисляемые свойства
const currentImage = computed(() => {
  return activeImages.value[currentIndex.value] || null
})

const currentNewspaper = computed(() => {
  return newspapers[newspaperIndex.value] || null
})



const nextImage = () => {
  if (currentIndex.value < activeImages.value.length - 1) {
    currentIndex.value++
  }
}

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const goToImage = (index: number) => {
  currentIndex.value = index
}

// Функции для газет
const openNewspaperModal = (index: number) => {
  const item = newspapers[index]
  
  if (item.type === 'pdf' && item.pdfUrl) {
    newspaperIsPdfView.value = true
    newspaperCurrentPdfUrl.value = item.pdfUrl
    newspaperIndex.value = index
  } else {
    newspaperIsPdfView.value = false
    newspaperCurrentPdfUrl.value = ''
    newspaperIndex.value = index
  }
  
  newspaperModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeNewspaperModal = () => {
  newspaperModalOpen.value = false
  document.body.style.overflow = ''
  newspaperIsPdfView.value = false
}

const nextNewspaper = () => {
  const photoNewspapers = newspapers.filter(n => n.type !== 'pdf')
  if (newspaperIndex.value < photoNewspapers.length - 1) {
    newspaperIndex.value++
  }
}

const prevNewspaper = () => {
  if (newspaperIndex.value > 0) {
    newspaperIndex.value--
  }
}

const goToNewspaper = (index: number) => {
  newspaperIndex.value = index
}

// Функции для видео
const openVideoModal = (video: VideoItem) => {
  currentVideo.value = video
  videoModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeVideoModal = () => {
  videoModalOpen.value = false
  document.body.style.overflow = ''
}

// Навигация с клавиатуры
const handleKeydown = (e: KeyboardEvent) => {
  if (modalOpen.value) {
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'Escape') closeModal()
  }
  if (newspaperModalOpen.value) {
    if (e.key === 'ArrowRight') nextNewspaper()
    if (e.key === 'ArrowLeft') prevNewspaper()
    if (e.key === 'Escape') closeNewspaperModal()
  }
  if (videoModalOpen.value) {
    if (e.key === 'Escape') closeVideoModal()
  }
if (kgbModalOpen.value) {
    if (!kgbIsPdfView.value) {
      if (e.key === 'ArrowRight') nextKgb()
      if (e.key === 'ArrowLeft') prevKgb()
    }
    if (e.key === 'Escape') closeKgbModal()
  }
}



onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.pdf-thumb-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #fff;
}

.pdf-thumb-embed {
  width: 300%;
  height: 300%;
  transform: scale(0.333);
  transform-origin: top left;
  border: none;
}

.pdf-click-blocker {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}


.pdf-placeholder {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(139, 0, 0, 0.3)) !important;
  flex-direction: column;
  gap: 0.5rem;
}

.pdf-icon-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  z-index: 2;
}

/* PDF контейнер */
.modal-container.pdf-container {
  max-width: 1000px;
  height: 90vh;
}

.pdf-viewer-wrapper {
  width: 100%;
  height: 65vh;
  background: #111;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  border: none;
}

/* Кнопка скачать PDF */
.download-pdf-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.8rem;
  padding: 0.6rem 1.5rem;
  background: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.download-pdf-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--radiation-glow);
}

/* PDF плейсхолдер в сетке */
.pdf-placeholder {
  background: linear-gradient(135deg, rgba(255, 68, 68, 0.2), rgba(139, 0, 0, 0.2)) !important;
  flex-direction: column;
  gap: 0.5rem;
}

.pdf-icon-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  z-index: 2;
}




.photos-page {
  padding: 6rem 2rem 3rem;
  min-height: 100vh;
  background: radial-gradient(circle at 20% 80%, rgba(100, 27, 26, 0.5) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(100, 55, 0, 0.5) 0%, transparent 50%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  text-align: center;
  color: var(--primary);
  text-shadow: var(--radiation-glow);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

/* Секции */
.section-block {
  margin-bottom: 4rem;
}

.section-heading {
  font-size: 1.6rem;
  color: var(--text);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.section-icon {
  font-size: 1.8rem;
}

/* Сетка фото и газет */
.photos-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.photo-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255, 107, 26, 0.1);
  transition: all 0.3s ease;
  aspect-ratio: 1/1;
  max-height: 220px;
}

.photo-card:hover {
  border-color: rgba(255, 107, 26, 0.3);
  box-shadow: 0 10px 30px rgba(255, 107, 26, 0.2);
  transform: translateY(-5px);
}

.photo-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111;
  overflow: hidden;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.photo-card:hover .photo-image {
  transform: scale(1.1);
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 107, 26, 0.2), rgba(255, 215, 0, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-emoji {
  font-size: 3rem;
  transition: transform 0.3s ease;
}

.photo-card:hover .photo-emoji {
  transform: scale(1.2);
}

/* Всплывающая подпись */
.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.5) 60%, transparent);
  padding: 1.5rem 1rem 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.photo-card:hover .photo-overlay {
  transform: translateY(0);
}

.photo-overlay h3 {
  color: #fff;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.photo-overlay p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  line-height: 1.3;
  margin-bottom: 0.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.photo-overlay .photo-date {
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 600;
}

/* Сетка видео */
.video-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.video-card {
  background: var(--dark-secondary);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 107, 26, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-card:hover {
  border-color: rgba(255, 107, 26, 0.3);
  box-shadow: 0 10px 30px rgba(255, 107, 26, 0.15);
  transform: translateY(-5px);
}

.video-thumbnail {
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, rgba(255, 107, 26, 0.2), rgba(255, 215, 0, 0.1));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.play-icon {
  width: 50px;
  height: 50px;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.video-card:hover .play-icon {
  transform: scale(1.2);
}

.video-emoji {
  font-size: 1.5rem;
}

.video-info {
  padding: 1rem;
}

.video-info h4 {
  color: var(--text);
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.video-info p {
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 600;
}

/* Модальное окно */
.modal-details {
  color: var(--text-muted);
  line-height: 1.8;
  font-size: 0.95rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 107, 26, 0.2);
  white-space: pre-line;  /* сохраняет переносы строк */
  max-height: 300px;
  overflow-y: auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-container {
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--dark-secondary);
  border-radius: 20px;
  border: 1px solid rgba(255, 107, 26, 0.2);
  position: relative;
}

.video-modal-container {
  max-width: 800px;
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close-btn:hover {
  background: var(--primary);
}

.modal-counter {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.modal-image-wrapper {
  width: 100%;
  min-height: 300px;
  max-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  border-radius: 20px 20px 0 0;
  padding: 2rem;
}

.modal-image {
  max-width: 100%;
  max-height: 450px;
  object-fit: contain;
}

.modal-placeholder {
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, rgba(255, 107, 26, 0.2), rgba(255, 215, 0, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-emoji {
  font-size: 8rem;
}

.video-player-wrapper {
  width: 100%;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
}

.video-placeholder-big {
  width: 100%;
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, rgba(255, 107, 26, 0.2), rgba(255, 215, 0, 0.1));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.video-modal-emoji {
  font-size: 4rem;
}

.play-large {
  width: 80px;
  height: 80px;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  animation: pulse 2s ease-in-out infinite;
}

.modal-info {
  padding: 2rem;
}

.modal-info h2 {
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: 0.8rem;
}

.modal-info p {
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 1rem;
}

.modal-date {
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 600;
}

.modal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem 1.5rem;
}

.nav-btn {
  padding: 0.7rem 1.5rem;
  background: rgba(255, 107, 26, 0.1);
  border: 1px solid rgba(255, 107, 26, 0.3);
  color: var(--primary);
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 107, 26, 0.2);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-dots {
  display: flex;
  gap: 0.5rem;
}

.nav-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 107, 26, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-dot.active {
  background: var(--primary);
  box-shadow: var(--radiation-glow);
  width: 10px;
  height: 10px;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .photos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .modal-image-wrapper {
    min-height: 200px;
    max-height: 300px;
    padding: 1rem;
  }
  
  .modal-nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .photos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .video-grid {
    grid-template-columns: 1fr;
  }
}
</style>