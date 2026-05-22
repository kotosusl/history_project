<template>
  <main>
    <HeroSection />
    <FactsSection :facts="facts" @open-modal="$emit('open-modal', $event)" />
    <StatsSection />
    <MapSection />
    <TimelineSection :events="timeline" />
    <ConsequencesSection @open-modal="$emit('open-modal', $event)" />
  </main>
</template>

<script setup lang="ts">
import type { Fact, TimelineEvent } from '../types'
import HeroSection from '../components/HeroSection.vue'
import FactsSection from '../components/FactsSection.vue'
import StatsSection from '../components/StatsSection.vue'
import MapSection from '../components/MapSection.vue'
import TimelineSection from '../components/TimelineSection.vue'
import ConsequencesSection from '../components/ConsequencesSection.vue'

defineProps<{
  facts: Fact[]
  timeline: TimelineEvent[]
}>()

defineEmits<{
  (e: 'open-modal', data: { title: string; content: string[]; icon: string }): void
}>()
</script>