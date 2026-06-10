<template>
  <div class="HLPageInfo">
    <time v-if="timestamp" :datetime="new Date(timestamp).toISOString()">
      {{ datetime }}
    </time>
    <HLTag v-for="ptag in tags" :key="ptag" :name="ptag" @click="tagClick(ptag)" />
  </div>
</template>

<script lang="ts">
import { ref, watch, onMounted } from 'vue';
import { PropType } from 'vue';
import HLTag from './HLTag.vue';

export default {
  components: {
    HLTag,
  },
  props: {
    tags: {
      type: Array as PropType<string[]>,
      default: undefined,
    },
    tagClick: {
      type: Function,
      default: () => {
        return;
      },
    },
    timestamp: {
      type: Number,
      default: undefined,
    },
  },
  setup(props) {
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
    return {
      datetime,
    };
  },
};
</script>

<style lang="scss" scoped>
.HLPageInfo {
  margin-top: 10px;
  display: flex;
  gap: 5px 10px;
  flex-wrap: wrap;
}
</style>
