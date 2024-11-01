<template>
  <a :href="withBase(`/tags?tag=${encodeURIComponent(name)}`)">
    <span class="HLTag">{{ name }}</span>
  </a>
</template>

<script lang="ts">
import { withBase } from 'vitepress';

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return { withBase };
  },
};
</script>

<style lang="scss" scoped>
.HLTag {
  display: flex;
  gap: 0.1em;
  color: var(--vp-c-text-2);
  transition: color 0.25s;

  &::before {
    content: '#';
  }

  &:hover {
    color: var(--vp-c-brand);
  }
}
</style>
