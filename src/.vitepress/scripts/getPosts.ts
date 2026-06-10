import { glob, readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { getGitLastUpdated } from './git.js';

// parent 下の拡張子 ext を持つファイルのパスと中身を取得
export async function getFiles(parent: string, ext: string[]) {
  const paths = await Array.fromAsync(
    glob(
      ext.map((e) => '**/*.' + e),
      {
        exclude: (f) => f.includes('node_modules') || f === 'README.md',
      },
    ),
  );
  return await Promise.all(
    paths
      .filter((p) => p.startsWith(parent))
      .map(async (p) => {
        const content = await readFile(p, 'utf-8');
        return { path: p, content };
      }),
  );
}

// parent 下の記事の取得
export const getPosts = async (parent: string) =>
  await Promise.all(
    (await getFiles(parent, ['md'])).map(async (file) => {
      const { content, data } = matter(file.content);
      return {
        path: file.path.replace('src', ''),
        frontMatter: data,
        content: content,
        lastUpdated: await getGitLastUpdated(file.path),
      };
    }),
  );
