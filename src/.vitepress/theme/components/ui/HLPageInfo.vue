<template>
  <div class="HLPageInfo">
    <time v-if="timestamp" :datetime="new Date(timestamp).toISOString()">
      {{ datetime }}
    </time>
    <HLTag v-for="ptag in tags" :key="ptag" :name="ptag" @click="tagClick(ptag)" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import HLTag from './HLTag.vue';

const props = withDefaults(
  defineProps<{
    tags?: string[];
    tagClick?: () => void;
    timestamp?: number;
  }>(),
  {
    tags: undefined,
    tagClick: () => {},
    timestamp: undefined,
  },
);

const datetime = ref('');
// onMounted で window を使う（SSR対策）
onMounted(() => {
  watch(
    () => props.timestamp,
    (ts) => {
      datetime.value = ts ? new Date(ts).toLocaleString(window.navigator.language) : '';
    },
    { immediate: true },
  );
});
</script>

<style lang="scss" scoped>
.HLPageInfo {
  margin-top: 10px;
  display: flex;
  gap: 5px 10px;
  flex-wrap: wrap;
}
</style>
