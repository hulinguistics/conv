<template>
  <div v-if="authors[0]">
    <p class="HLAuthor">
      Author<span v-if="authors[1] !== undefined">s</span>:
      <span v-for="(author, index) in authors" :key="author.name">
        <span v-if="index !== 0">, </span>
        <a v-if="author.url" :href="author.url">{{ author.name }}</a>
        <span v-else>{{ author.name }}</span>
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useData } from 'vitepress';

const { frontmatter } = useData();

type AuthorEntry = string | { name?: string; url?: string };
const getAuthor = (value: Record<string, unknown>) => {
  const authorObject = (author: AuthorEntry) => ({
    name: typeof author === 'string' ? author : (author.name ?? ''),
    url: typeof author === 'string' ? undefined : author.url,
  });

  const author = value.author as AuthorEntry | AuthorEntry[] | undefined;
  if (!author || (Array.isArray(author) && !author.length)) {
    return [];
  } else if (Array.isArray(author)) {
    return author.map(authorObject);
  } else {
    return [authorObject(author)];
  }
};

const authors = ref(getAuthor(frontmatter.value));
watch(frontmatter, (c) => {
  authors.value = getAuthor(c);
});
</script>

<style lang="scss" scoped>
.HLAuthor {
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
</style>
