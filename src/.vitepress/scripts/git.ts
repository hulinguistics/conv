import { spawn } from 'node:child_process';

const git = async (options: string[], outFunc: (output: string) => unknown) => {
  return new Promise((resolve, reject) => {
    const child = spawn('git', options);
    let output = '';
    child.stdout.on('data', (d: Buffer) => (output += String(d)));
    child.on('close', () => {
      resolve(outFunc(output));
    });
    child.on('error', reject);
  });
};

// file の最終 commit 日時を取得
export const getGitLastUpdated = async (file: string) => await git(['log', '-1', `--pretty="%ci"`, file], (output) => +new Date(output));
