<template>
  <div class="docFooterBefore">
    <div class="contributor">
      <HLAuthor />
    </div>
  </div>
</template>

<script setup lang="ts">
import HLAuthor from '../ui/HLAuthor.vue';
</script>

<style lang="scss" scoped>
.docFooterBefore {
  margin-top: 64px;

  @media (min-width: 640px) {
    text-align: right;
  }
}
</style>
