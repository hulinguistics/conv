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

<script lang="ts">
import { ref, watch } from 'vue';
import { useData } from 'vitepress';

export default {
  setup() {
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
        // author が複数人のとき
        return author.map(authorObject);
      } else {
        // author が一人のとき
        return [authorObject(author)];
      }
    };

    // frontmatterの更新でauthorsも更新
    const authors = ref(getAuthor(frontmatter.value));
    watch(frontmatter, (c) => {
      authors.value = getAuthor(c);
    });

    return {
      frontmatter,
      authors,
    };
  },
};
</script>

<style lang="scss" scoped>
.HLAuthor {
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);

  @media (min-width: 640px) {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
