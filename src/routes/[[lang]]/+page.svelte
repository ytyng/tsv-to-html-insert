<script lang="ts">
  import {onMount} from 'svelte';
  import {convertTsvToInsertSQL, testTsvData, nativeSqlValues} from '$lib/sql';

  export let data

  $: sourceTsv = testTsvData;
  $: tableName = 'your_table_name';
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

  function _(v1: string, v2: string) {
    return data.lang === 'ja' ? v1 : v2;
  }

  onMount(() => {
    if (window.localStorage.getItem('helpVisible') === '0') {
      helpVisible = false;
    }
  });
</script>

<div class="bg-slate-800 text-white flex items-center">
  <h1 class="text-2xl p-2 font-bold grow">
    <i class="bi bi-database-fill-up"></i> Convert TSV to Insert SQL
  </h1>
  <div class="p-2">

    <span class="mx-1">
    <i class="bi bi-translate text-xl"></i>
      {#if data.lang === 'ja'}
      <a href="../" class="mx-1" rel="external">
        EN
      </a>
        <span class="text-gray-500">|</span>
      <span class="text-gray-500">
        JA
      </span>
    {:else}
      <span class="text-gray-500">
        EN
      </span>
        <span class="text-gray-500">|</span>
      <a href="ja/" class="mx-1" rel="external">
        JA
      </a>
    {/if}
    </span>

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
        {_('これは、TSV 形式のテキストを Insert の SQL 文に変換するツールです。',
          'This is a tool to convert TSV text to Insert SQL.')}
        <br>
        {_('Google スプレッドシートやエクセルで作ったデータを DB に登録する際に便利です。',
          'It is useful when registering data created in Google Spreadsheets or Excel in a DB.')}
      </p>

      <img src="/images/tutorial-01.png" alt="tutorial-01" class="my-3 max-w-full">

      <p class="my-3">
        {_('Google スプレッドシートやエクセルで作ったデータを範囲選択し、コピーすると TSV 形式でコピーされるので、内容を下部のテキストエリアにペーストし、 Convert to Insert SQL ボタンを押すと SQL 文が生成されます。',
          'Select and copy the data created in Google Spreadsheets or Excel, and paste it into the text area at the bottom. When you press the Convert to Insert SQL button, an SQL statement is generated.')}
      </p>
      <p class="my-3">
        {_('処理はブラウザで行われるため、データは送信しません。', 'The processing is done in the browser, so the data is not sent.')}
      </p>
      <p class="my-3">
        {_('このツールを用いて発生した損害について、作者は一切の責任を負いません。同意できる方のみご利用ください。',
          'The author is not responsible for any damage caused by using this tool. Please use it only if you agree.')}
      </p>
      <div class="text-center my-3">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          on:click={hideHelp}
        >
          <i class="bi bi-check-lg"></i> {_('説明を消す', 'Dismiss help.')}
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
      {_('エクセルや Google スプレッドシートで作った内容をコピペしてください。',
        'Please copy and paste the contents created in Excel or Google Sheets.')}<br>
      {_('1行目はカラム名を入れてください。', 'Enter the column names in the first row.')}<br>
      {_('エクセルや Google スプレッドシートから表データをコピペすると、区切り文字はタブ文字になるので TSV 形式でペーストできます。',
        'When you copy and paste table data from Excel or Google Sheets, the delimiter will be a tab character, so you can paste it in TSV format.')}
    </div>
    <div class="text-sm text-gray-600 mt-1">
      {_('数字とこれらのワード以外はシングルクオートされます', 'Numbers and these words will not be single-quoted')}:
      {[...nativeSqlValues].join(', ')}
    </div>
  </div>
  <div class="my-3 flex items-center">
    <div class="whitespace-nowrap me-3">Table name</div>
    <input type="text" class="w-full py-1 px-2" bind:value={tableName}>
  </div>

  <div class="my-5 text-center">
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      on:click={() => {
        insertSql = convertTsvToInsertSQL(sourceTsv, tableName);
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
          {_('コピーしました', 'Copied')}
        {:else}
          <i class="bi bi-clipboard"></i>
          {_('コピーする', 'Copy')}
        {/if}
      </button>
    </div>
  {/if}

</div>
