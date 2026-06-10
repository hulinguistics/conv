<template>
  <div v-if="page.frontmatter.docbefore !== false" class="HLDocBefore">
    <HLTitle :title="page.frontmatter.title" />
    <HLPageInfo :tags="page.frontmatter.tags"></HLPageInfo>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import HLTitle from '../ui/HLTitle.vue';
import HLPageInfo from '../ui/HLPageInfo.vue';

const { page } = useData();
</script>

<style lang="scss" scoped>
.HLDocBefore {
  margin-bottom: 24px;
}
</style>
