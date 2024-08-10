<script lang="ts">
  import {onMount} from 'svelte';
  import {convertTsvToInsertSQL, testTsvData, nativeSqlValues} from '$lib/sql';

  $: sourceTsv = testTsvData;
  $: insertSql = '';
  $: copied = false;
  $: helpVisible = true;

  function copySqlToClipboard() {
    navigator.clipboard.writeText(insertSql);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 5000);
  }

  function hideHelp() {
    helpVisible = false;
    window.localStorage.setItem('helpVisible', '0');
  }

  function showHelp() {
    helpVisible = true;
    window.localStorage.setItem('helpVisible', '1');
  }

  onMount(() => {
    if (window.localStorage.getItem('helpVisible') === '0') {
      helpVisible = false;
    }
  });
</script>

<div class="bg-slate-800 text-white flex items-center">
  <h1 class="text-2xl p-2 font-bold grow">Convert TSV to Insert SQL</h1>
  <div class="p-2">
    <a href="https://github.com/ytyng/tsv-to-insert-sql" target="_blank" class="mx-1">
      <i class="bi bi-github text-xl"></i>
    </a>
    {#if !helpVisible}
      <button class="mx-1" on:click={showHelp}>
        <i class="bi bi-question-circle text-xl"></i>
      </button>
    {/if}

  </div>
</div>

{#if helpVisible}
  <div class="bg-gray-50 py-1">
    <div class="max-w-screen-xl px-3 mx-auto">
      <p class="my-3">
        これは、TSV 形式のテキストを Insert の SQL 文に変換するツールです。<br>
        Google スプレッドシートやエクセルで作ったデータを DB に登録する際に便利です。
      </p>

      <img src="/images/tutorial-01.png" alt="tutorial-01" class="my-3 max-w-full">

      <p class="my-3">
        Google スプレッドシートやエクセルで作ったデータを範囲選択し、コピーすると TSV 形式でコピーされるので、
        内容を下部のテキストエリアにペーストし、 Convert to Insert SQL ボタンを押すと SQL 文が生成されます。
      </p>
      <p class="my-3">
        処理はブラウザで行われるため、データは送信しません。
      </p>
      <p class="my-3">
        このツールを用いて発生した損害について、作者は一切の責任を負いません。同意できる方のみご利用ください。
      </p>
      <div class="text-center my-3">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          on:click={hideHelp}
        >
          <i class="bi bi-check-lg"></i> 説明を消す
        </button>
      </div>
    </div>
  </div>
{/if}
<div class="max-w-screen-xl px-3 mx-auto">
  <div class="my-5">
    <div class="flex">
      <div class="text-gray-700 text-sm font-bold mb-1 grow">
        TSV
      </div>
      <div>
        <button
          class="text-gray-700 text-sm mb-1 hover:text-red-900"
          on:click={() => {
            sourceTsv = '';
          }}
        >
          <i class="bi bi-x-lg"></i> Clear
        </button>
      </div>
    </div>
    <textarea class="bg-white w-full h-96 p-3 font-mono" bind:value={sourceTsv}></textarea>
    <div class="text-sm text-gray-600 mt-1">
      エクセルや Google スプレッドシートで作った内容をコピペしてください。<br>
      1行目はカラム名を入れてください。<br>
      エクセルや Google スプレッドシートから表データをコピペすると、区切り文字はタブ文字になるので TSV 形式でペーストできます。
    </div>
    <div class="text-sm text-gray-600 mt-1">
      数字とこれらのワード以外はシングルクオートされます: {[...nativeSqlValues].join(', ')}
    </div>
  </div>
  <div class="my-5 text-center">
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      on:click={() => {
        insertSql = convertTsvToInsertSQL(sourceTsv);
      }}
    >
      <i class="bi bi-arrow-down"></i>
      Convert to Insert SQL
    </button>
  </div>
  {#if insertSql}
    <pre class="bg-white w-full my-5 p-3 whitespace-pre-wrap">{insertSql}</pre>
    <div class="my-5 text-center">
      <button
        class="{copied? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700' } text-white font-bold py-2 px-4 rounded"
        on:click={copySqlToClipboard}
      >
        {#if copied}
          <i class="bi bi-check"></i>
          コピーしました
        {:else}
          <i class="bi bi-clipboard"></i>
          コピーする
        {/if}
      </button>
    </div>
  {/if}

</div>
