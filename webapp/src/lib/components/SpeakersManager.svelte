<script lang="ts">
  import type { Speaker } from "$lib/types/model";
  let BACKEND = import.meta.env.VITE_BACKEND || "";

  import { onMount } from "svelte";
  import ConfirmationBox from "./ConfirmationBox.svelte";
  import { speakersStore } from "$lib/stores/store";

  let newSpeaker: string = "";
  let newAge: string = "";
  let newGender: string = "";
  let newAccent: string = "";
  let showConfirmationBox = false;
  let selectedSpeaker: Speaker | null = null;
  let editingSpeaker: Speaker | null = null;
  let editName: string = "";
  let editAge: string = "";
  let editGender: string = "";
  let editAccent: string = "";


  onMount(() => {
    getSpeaker();
  });

  let speakers: Speaker[] = [];
  function getSpeaker() {
    fetch(`${BACKEND}/get_speakers`)
      .then((response) => response.json())
      .then((_speakers: Speaker[]) => {
        speakers = _speakers;
        speakersStore.set(speakers);
      });
  }

  function addSpeaker() {
    if (!newSpeaker) {
      return;
    }
    const formData = new FormData();
    formData.append("speaker", newSpeaker);
    if (newAge) formData.append("age", newAge);
    if (newGender) formData.append("gender", newGender);
    if (newAccent) formData.append("accent", newAccent);

    fetch(`${BACKEND}/add_speaker`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          newSpeaker = "";
          newAge = "";
          newGender = "";
          newAccent = "";
          getSpeaker();
        } else {
          alert("保存说话人失败。");
        }
      });
  }

  function deleteSpeaker(speaker: Speaker) {
    const formData = new FormData();
    formData.append("id", speaker.id.toString());

    fetch(`${BACKEND}/delete_speaker`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          selectedSpeaker = null;
          getSpeaker();
        } else {
          alert("删除说话人失败。");
        }
      });
  }

  function updateSpeaker() {
    if (!editingSpeaker) return;
    const formData = new FormData();
    formData.append("id", editingSpeaker.id.toString());
    formData.append("name", editName);
    if (editAge) formData.append("age", editAge);
    if (editGender) formData.append("gender", editGender);
    if (editAccent) formData.append("accent", editAccent);

    fetch(`${BACKEND}/update_speaker`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          editingSpeaker = null;
          getSpeaker();
        } else {
          alert("更新说话人失败。");
        }
      });
  }

  function startEdit(speaker: Speaker) {
    editingSpeaker = speaker;
    editName = speaker.name;
    editAge = speaker.age?.toString() || "";
    editGender = speaker.gender || "";
    editAccent = speaker.accent || "";
  }

  function cancelEdit() {
    editingSpeaker = null;
  }

  function deletionConfirmed() {
    showConfirmationBox = false;
    if (!selectedSpeaker) {
      return;
    }
    deleteSpeaker(selectedSpeaker);
  }
  function deletionRejected() {
    showConfirmationBox = false;
    selectedSpeaker = null;
  }
</script>

<ConfirmationBox
  show={showConfirmationBox}
  onConfirmed={deletionConfirmed}
  onRejected={deletionRejected}
></ConfirmationBox>

{#if editingSpeaker}
  <div class="max-w-md mx-auto p-4 border rounded-lg bg-gray-50 mb-4">
    <h3 class="text-lg font-medium mb-3">编辑说话人</h3>
    <div class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">名称</label>
        <input
          type="text"
          bind:value={editName}
          class="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">年龄</label>
        <input
          type="number"
          bind:value={editAge}
          class="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          placeholder="选填"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">性别</label>
        <select
          bind:value={editGender}
          class="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="">请选择</option>
          <option value="男">男</option>
          <option value="女">女</option>
          <option value="其他">其他</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">口音</label>
        <input
          type="text"
          bind:value={editAccent}
          class="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          placeholder="选填，如：北京话、粤语"
        />
      </div>
      <div class="flex space-x-2">
        <button
          on:click={updateSpeaker}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          保存
        </button>
        <button
          on:click={cancelEdit}
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          取消
        </button>
      </div>
    </div>
  </div>
{:else}
  <form class="max-w-sm mx-auto">
    <input
      type="text"
      bind:value={newSpeaker}
      on:keydown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          addSpeaker();
        }
      }}
      id="newSpaker"
      aria-describedby="helper-text-explanation"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="输入说话人名称后按回车..."
    />
  </form>
{/if}

<div class="space-y-4 px-4 py-4">
  {#each speakers as speaker}
    <div class="flex w-full px-4 space-x-4 border rounded-lg h-12 items-center hover:bg-gray-50">
      <svg class="w-6 h-6 text-gray-400">
        <use href="icons.svg#icon-speaker"></use>
      </svg>
      <div class="text-gray-700 capitalize flex-grow">
        <span class="font-medium">{speaker.name}</span>
        {#if speaker.age || speaker.gender || speaker.accent}
          <span class="text-gray-400 text-sm ml-2">
            {#if speaker.age}{speaker.age}岁{/if}
            {#if speaker.gender}· {speaker.gender}{/if}
            {#if speaker.accent}· {speaker.accent}{/if}
          </span>
        {/if}
      </div>
      <div class="flex space-x-2">
        <button
          class="text-blue-600 hover:text-blue-800"
          aria-labelledby="编辑说话人"
          title="编辑说话人"
          on:click={() => startEdit(speaker)}
        >
          <svg class="w-5 h-5">
            <use href="icons.svg#icon-edit"></use>
          </svg>
        </button>
        <button
          class="text-red-700 disabled:text-gray-400"
          disabled={speaker.id === 1}
          aria-labelledby="移除说话人"
          title="移除说话人"
          on:click={() => {
            selectedSpeaker = speaker;
            showConfirmationBox = true;
          }}
        >
          <svg class="w-6 h-6">
            <use href="icons.svg#icon-trash"></use>
          </svg>
        </button>
      </div>
    </div>
  {/each}
</div>
