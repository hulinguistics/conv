import { getPosts } from './getPosts';
import fs from 'fs-extra';

interface Category {
  name: string;
  display: string;
  collapsed?: boolean;
}

// サイドバーの生成
export async function sidebar(parent: string, categoryListPath: string) {
  // 記事の親ディレクトリから md ファイルの一覧を取得
  const posts = await getPosts(parent);

  // src/.vitepress/categories/* からセクションのリストを作成
  const categories: Category[] = JSON.parse(await fs.readFile(categoryListPath, 'utf-8')).filter((category: Category) =>
    // そのセクションに属す記事が無いものを除外
    posts.some((post) => post.frontMatter.category === category.name),
  );

  return categories.map((category) => ({
    text: category.display,
    collapsed: category.collapsed,
    items: posts
      .filter((post) => post.frontMatter.category === category.name)
      .map((post) => ({
        text: post.frontMatter.title as string,
        link: post.path.replace('src', '').replace('index.md', ''),
      }))
      .sort((a, b) =>
        a.link.replace('.md', '') > b.link.replace('.md', '') ? 1 : a.link.replace('.md', '') < b.link.replace('.md', '') ? -1 : 0,
      ),
  }));
}
