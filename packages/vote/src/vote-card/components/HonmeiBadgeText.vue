<template>
  <svg width="160" height="36" viewBox="0 0 160 36" role="img" aria-label="本命票">
    <!-- SVG keeps browser text alignment when html2canvas rasterizes the badge. -->
    <text
      x="80"
      y="18"
      text-anchor="middle"
      dominant-baseline="central"
      fill="white"
      font-weight="900"
      :font-size="small ? 18 : 20"
      :letter-spacing="small ? 2.16 : 4"
      :dx="small ? 1.08 : 2"
      font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    >
      本命票
    </text>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ small?: boolean }>()
</script>
