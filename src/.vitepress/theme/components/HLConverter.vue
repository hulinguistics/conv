<template>
  <div class="HLConverter">
    <div class="convbox">
      <label>
        <header>{{ status.loading ? 'Now loading...' : status.error ? 'ERROR' : list.title.left }}</header>
        <textarea
          v-model="textarea.left.value"
          cols="20"
          rows="10"
          leftta
          :readonly="!!status.loading || !!status.error"
          @focus="textarea.left.isFocus = true"
          @blur="textarea.left.isFocus = false"
        ></textarea>
      </label>
      <label>
        <header>{{ status.loading ? 'Now loading...' : status.error ? 'ERROR' : list.title.right }}</header>
        <textarea
          v-model="textarea.right.value"
          cols="20"
          rows="10"
          rightta
          :readonly="!!status.loading || !!status.error"
          @focus="textarea.right.isFocus = true"
          @blur="textarea.right.isFocus = false"
        ></textarea>
      </label>
    </div>
    <details class="details custom-block">
      <summary>{{ status.loading ? 'Now loading...' : status.error ? 'ERROR' : '優先順' }}</summary>
      <table v-if="!status.loading && !status.error">
        <thead>
          <tr>
            <th style="text-align: center">優先順</th>
            <th style="text-align: center">{{ list.title.left }}</th>
            <th style="text-align: center">{{ list.title.right }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(column, index) in list.set" :key="index">
            <td style="text-align: center">{{ index + 1 }}</td>
            <td style="text-align: center">
              <code leftta>{{ column[0] }}</code>
            </td>
            <td style="text-align: center">
              <code rightta>{{ column[1] }}</code>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="status.error" class="language-txt">
        <pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">{{ status.error }}</span></span></code></pre>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import papa from 'papaparse';

const props = withDefaults(
  defineProps<{
    src?: string | null;
    fontLeft?: string;
    fontRight?: string;
    dirLeft?: string;
    dirRight?: string;
    normalize?: boolean;
  }>(),
  {
    src: null,
    fontLeft: 'Noto Sans Mono',
    fontRight: 'Noto Sans Mono',
    dirLeft: 'ltr',
    dirRight: 'ltr',
    normalize: false,
  },
);

// 変換表の初期化
interface ListData {
  title: { left: string; right: string };
  set: string[][];
}
const status = ref({ loading: true, error: '' });
const list = ref<ListData>();

(async () => {
  await fetch(props.src)
    .then((response) => response.text())
    .then((text) => {
      const data = papa.parse<string[]>(text.trim(), {
        quoteChar: '\\',
        delimiter: '\t',
      }).data;
      list.value = {
        title: { left: data[0][0], right: data[0][1] },
        set: data.slice(1),
      };
    })
    .catch((error) => {
      console.log(error);
      status.value.error = error;
    });
  status.value.loading = false;
})();

// 文字変換関数
const converter = (input: string, set: [string, string][]) => {
  let output = input;
  while (
    set.some((value) => {
      const prev = output;
      const isReg = /\/.+\//.test(value[0]);
      const key = isReg ? value[0].replace(/\/(.+)\//, '$1') : value[0];
      if (key) {
        output = isReg ? output.replace(new RegExp(key, 'gu'), value[1]) : output.replaceAll(key, value[1]);
        return output !== prev;
      }
      return false;
    })
  );
  return output;
};

const convert = (input: string, set: [string, string][]) => {
  const result = converter(props.normalize ? input.normalize('NFD') : input, set);
  return props.normalize ? result.normalize('NFC') : result;
};

// テキストエリアの中身を更新
const textarea = ref({
  left: { value: '', isFocus: false },
  right: { value: '', isFocus: false },
});

watch(
  textarea,
  () => {
    if (!list.value) return;
    if (textarea.value.left.isFocus)
      textarea.value.right.value = convert(
        textarea.value.left.value,
        list.value.set.map((v) => [...v] as [string, string]),
      );
    if (textarea.value.right.isFocus)
      textarea.value.left.value = convert(
        textarea.value.right.value,
        list.value.set.map((v: string[]) => [...v].reverse() as [string, string]),
      );
  },
  { deep: true },
);
</script>

<style lang="scss" scoped>
.HLConverter {
  margin: 16px 0;

  .convbox {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    label {
      header {
        display: inline-block;
        width: 100%;
        font-size: 1.1em;
        font-weight: 600;
        margin: 0 0 16px;
        text-align: center;
      }

      textarea {
        width: 100%;
        height: 200px;
        min-height: 200px;
        padding: 15px;
        font-size: 1em;
        line-height: 1.6;
        background-color: var(--vp-c-bg-alt);
        border: 1px solid transparent;
        border-radius: 8px;
        border-color: var(--vp-custom-block-details-border);
      }
    }
  }

  [leftta] {
    font-family: v-bind('props.fontLeft'), monospace;
    direction: v-bind('props.dirLeft');
  }

  [rightta] {
    font-family: v-bind('props.fontRight'), monospace;
    direction: v-bind('props.dirRight');
  }
}
</style>
