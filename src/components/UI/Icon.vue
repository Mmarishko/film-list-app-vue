<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: '',
  },
})

const iconName = computed(() => `#icon-${props.name}`)
const svgClass = computed(() => {
  if (props.className) {
    return 'svg-icon ' + props.className
  } else {
    return 'svg-icon'
  }
})
</script>

<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
