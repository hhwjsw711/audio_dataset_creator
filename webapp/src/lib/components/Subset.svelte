<script lang="ts">
  import { sentencesStore, showAlertStore } from "$lib/stores/store";
  import {
    SentenceStatus,
    SubDataSet,
    type Dataset,
    type Sentence,
    type SentenceResponse,
  } from "../types/model";
  import Alert from "./Alert.svelte";

  import ConfirmationBox from "./ConfirmationBox.svelte";

  let BACKEND = import.meta.env.VITE_BACKEND || "";
  export let onSubDatasetSelected: (subDataset: SubDataSet) => void;
  export let dataset!: Dataset;
  let subDataset!: SubDataSet;
  let subDataSetEntries = Object.entries(SubDataSet);
  let colors = ["text-blue-600", "text-green-600", "text-red-600"];

  const subDataSetLabels: Record<string, string> = {
    train: "训练集",
    test: "测试集",
    validation: "验证集"
  };

  let showConfirmationBox = false;
  let subDataSetToDelete: SubDataSet | null = null;

  let counts = {
    [SubDataSet.TRAIN]: 0,
    [SubDataSet.TEST]: 0,
    [SubDataSet.VALIDATION]: 0,
  };
  function setCurrentSubset(_subDataset: SubDataSet) {
    subDataset = _subDataset;
    onSubDatasetSelected(subDataset);
  }

  $: if (dataset !== undefined) {
    for (const [key, value] of subDataSetEntries) {
      getSubDatasetCount(value).then((sentenceResponse: SentenceResponse) => {
        counts[value] = sentenceResponse.count ?? 0;
      });
    }
  }

  function getSubDatasetCount(subDataSet: SubDataSet) {
    return fetch(
      `${BACKEND}/get_sentences/${SentenceStatus.ALL}/1/1/${dataset.id}/${subDataSet}`
    ).then((response) => response.json());
  }

  sentencesStore.subscribe((sentenceResponse) => {
    if (!sentenceResponse) {
      return;
    }

    let part: SubDataSet = sentenceResponse.subDataSet;
    counts[part] = sentenceResponse?.count ?? 0;
    counts = {
      ...counts,
    };
  });

  function rejectRemoveRecording() {
    showConfirmationBox = false;
    subDataSetToDelete = null;
  }

  function deleteSubDataset(sub_dataset: SubDataSet) {
    const formData = new FormData();
    formData.append("dataset", dataset.id.toString());
    formData.append("sub_dataset", sub_dataset);

    fetch(`${BACKEND}/delete_sub_dataset`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          sentencesStore.set({
            count: 0,
            sentence: [],
            subDataSet: sub_dataset,
          });
          counts[sub_dataset] = 0;
          showAlertStore.set({ msg: "子数据集已删除。", success: true });
        } else {
          showAlertStore.set({
            msg: "删除子数据集失败。",
            success: true,
          });
        }
      });
  }

  function deletionConfirmed() {
    showConfirmationBox = false;
    if (subDataSetToDelete === null) {
      return;
    }
    deleteSubDataset(subDataSetToDelete);
    subDataSetToDelete = null;
  }
</script>

<ConfirmationBox
  show={showConfirmationBox}
  onConfirmed={deletionConfirmed}
  onRejected={rejectRemoveRecording}
></ConfirmationBox>

<div class="space-y-4">
  {#each subDataSetEntries as [key, value], index}
    <div
      class:bg-blue-50={subDataset === value}
      class="flex items-center w-full px-4 space-x-4 border rounded-lg cursor-pointer peer-checked:bg-blue-100"
    >
      <button
        on:click={() => setCurrentSubset(value)}
        class="flex items-center w-full space-x-4 h-12"
      >
        <!-- Icon -->
        <div class={colors[index]}>
          <svg class="w-6 h-6">
            <use href="icons.svg#icon-{value}"></use>
          </svg>
        </div>
        <!-- Text -->
        <div class="flex-grow justify-start flex capitalize">{subDataSetLabels[value] || value}</div>
        <!-- Badge -->
        <div
          class="bg-gray-200 text-gray-800 text-sm font-semibold rounded-full px-3 py-1"
        >
          {counts[value]}
        </div>
      </button>
      <button
        on:click={() => {
          subDataSetToDelete = value;
          showConfirmationBox = true;
        }}
        aria-label="删除此子数据集"
        class="pr-2"
        title="删除此子数据集"
      >
        <svg class=" w-5 h-5 text-red-700">
          <use href="icons.svg#icon-trash"></use>
        </svg>
      </button>
    </div>
  {/each}
</div>
