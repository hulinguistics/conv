<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = withDefaults(
  defineProps<{
    repo: string;
    theme?: string;
    issueTerm?: string;
    label?: string;
  }>(),
  {
    theme: 'github-light',
    issueTerm: 'pathname',
    label: '',
  },
);

const container = ref<HTMLElement>();

onMounted(() => {
  const utterances = window.document.createElement('script');
  utterances.type = 'text/javascript';
  utterances.src = 'https://utteranc.es/client.js';
  utterances.async = true;
  utterances.setAttribute('repo', props.repo);
  utterances.setAttribute('label', props.label);
  utterances.setAttribute('issue-term', props.issueTerm);
  utterances.setAttribute('theme', props.theme);
  utterances.crossOrigin = 'anonymous';
  container.value!.append(utterances);
});
</script>
