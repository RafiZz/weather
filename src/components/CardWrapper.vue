<template functional>
  <div
    class="card-wrapper"
    :class="data.staticClass"
    :style="data.staticStyle"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'CardWrapper'
}
</script>

<style lang="scss">
.card-wrapper {
  padding: 24px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(10, 10, 10, 0.25);
}
</style>
