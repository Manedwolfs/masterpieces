<script lang="ts" setup>
type MasterpieceProps = {
  /**
   * The masterpiece index.
   */
  index: number;

  /**
   * The masterpiece image.
   */
  src: string;

  /**
   * Mastrerspiece array.
   */
  masterpiece: string[];
}

/**
 * Defines the props for the masterpiece component.
 */
const props = defineProps<MasterpieceProps>();

/**
 * Removes the masterpiece from the state when it fails to load.
 */
const onImageError = (index: number) => {
  if (props.masterpiece) props.masterpiece.splice(index, 1);
};
</script>

<template>
  <img :src="props.src" alt="Masterpiece Image" class="w-full h-auto" @error="onImageError(index)" />
</template>