<template>
  <div>
    <div v-for="post in posts" :key="post.frontMatter.title">
      <a :href="withBase(post.path.replace('.md', ''))">
        <h3>{{ post.frontMatter.title }}</h3>
      </a>
      <HLPageInfo :tags="post.frontMatter.tags" :tag-click="tagClick" :timestamp="post.lastUpdated"></HLPageInfo>
    </div>
    <div v-if="paginate && pageList.length > 1" class="paginate">
      <a v-if="pageNum > 1" :href="`?${tag ? `tag=${encodeURIComponent(tag)}&` : ''}p=${pageNum - 1}`" @click="setPageNum(pageNum - 1)"
        >&lt;</a
      >
      <div v-for="p in pageList" :key="p">
        <a v-if="p !== pageNum" :href="`?${tag ? `tag=${encodeURIComponent(tag)}&` : ''}p=${p}`" @click="setPageNum(p)">{{ p }}</a>
        <span v-if="p === pageNum">{{ p }}</span>
      </div>
      <a
        v-if="pageNum < pageList.length"
        :href="`?${tag ? `tag=${encodeURIComponent(tag)}&` : ''}p=${pageNum + 1}`"
        @click="setPageNum(pageNum + 1)"
        >&gt;</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useData, withBase } from 'vitepress';
import HLPageInfo from './HLPageInfo.vue';

const props = withDefaults(
  defineProps<{
    tag?: string;
    tagClick?: () => void;
    paginate?: number;
    parent?: string;
  }>(),
  {
    tag: undefined,
    tagClick: () => {},
    paginate: undefined,
    parent: '/',
  },
);

const { theme } = useData();

interface Post {
  path: string;
  frontMatter: Record<string, unknown>;
  lastUpdated: number;
}

// 該当する投稿全て
const postsAll: Post[] = theme.value.posts
  // parent で親ディレクトリ絞り込み，index.mdを除外
  .filter((post: Post) => post.path.startsWith(props.parent) && !post.path.startsWith(props.parent + 'index'))
  // tag が指定されているときは tag で絞り込み
  .filter((post: Post) => (props.tag ? (post.frontMatter?.tags as string[] | undefined)?.includes(props.tag) : true))
  // 最終更新日時順に並び換え
  .sort((a: Post, b: Post) => b.lastUpdated - a.lastUpdated);

// クエリパラメータからページ番号を取得
const qparams = new URLSearchParams(location.href.split('?')[1]);
const getPageNum = () => parseInt(qparams.get('p') || '1', 10);
const pageNum = ref(getPageNum());

// paginate とページ番号で投稿を切り取り
const slicePosts = (paginate: number | undefined, pageNum: number) => {
  if (paginate !== undefined) {
    return postsAll.slice((pageNum - 1) * paginate).slice(0, paginate);
  } else {
    return postsAll;
  }
};
const posts = ref(slicePosts(props.paginate, pageNum.value));

// ページ番号リストの生成
const getPageList = (paginate: number | undefined) => {
  if (paginate !== undefined) {
    const pageLength = Math.ceil(postsAll.length / paginate);
    return [...Array(pageLength)].map((_, i) => i + 1);
  } else {
    return [1];
  }
};
const pageList = ref(getPageList(props.paginate));

const setPageNum = (pp: number) => {
  pageNum.value = pp;
  posts.value = slicePosts(props.paginate, pageNum.value);
  pageList.value = getPageList(props.paginate);
};
</script>

<style lang="scss" scoped>
.paginate {
  display: flex;
  margin-top: 40px;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
