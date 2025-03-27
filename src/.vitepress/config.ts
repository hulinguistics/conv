import { sidebar } from './scripts/sidebar';
import { getPosts } from './scripts/getPosts';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItMergeCells from 'markdown-it-merge-cells';
import markdownItKatex from 'markdown-it-katex';

export default (async () => {
  return {
    lang: 'ja',
    title: '文字変換器 by Huling',
    description:
      '主にラテン文字 (ローマ字) と別の文字を相互に変換するウェブアプリです。教会スラヴ語キリル文字やコプト文字、ゴート文字など、様々な文字に対応しています。',
    base: '/conv/',

    // 最終更新の表示
    lastUpdated: true,

    // 拡張子 .html を隠す
    cleanUrls: true,

    // head 内の値とか
    head: [
      [
        'link',
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/conv/apple-touch-icon.png',
        },
      ],
      [
        'link',
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/conv/favicon-32x32.png',
        },
      ],
      [
        'link',
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/conv/favicon-16x16.png',
        },
      ],
      ['link', { rel: 'manifest', href: '/conv/site.webmanifest' }],
      ['link', { rel: 'mask-icon', href: '/conv/safari-pinned-tab.svg', color: '#679fd1' }],
      ['meta', { name: 'msapplication-TileColor', content: '#679fd1' }],
      ['meta', { name: 'theme-color', content: '#ffffff' }],
    ],

    // markdown 関連の設定
    markdown: {
      config: (md) => {
        // markdown-it プラグイン
        md.use(markdownItFootnote);
        md.use(markdownItMergeCells);
        md.use(markdownItKatex);
      },
    },

    // テーマ設定
    themeConfig: {
      // ページ上部の nav
      nav: [
        { text: '文字変換器について', link: '/' },
        { text: 'タグ一覧', link: '/tags' },
        { text: '北大言語学サークル Huling', link: 'https://huling.org' },
      ],

      // ページ左側の sidebar
      sidebar: {
        '/': await sidebar('src/', 'src/.vitepress/categories/tools.json'),
      },

      // github 上編集ページに飛ぶリンク
      editLink: {
        pattern: 'https://github.com/hulinguistics/conv/edit/main/src/:path',
        text: 'Edit this page on GitHub',
      },

      // 記事一覧
      posts: await getPosts('src/'),

      // フッター
      footer: {
        copyright: `Copyright © 2022-${new Date().getFullYear()} <a href="https://twitter.com/HU_Linguistic" target="_blank" rel="noopener">Huling</a>`,
      },
    },
  };
})();
