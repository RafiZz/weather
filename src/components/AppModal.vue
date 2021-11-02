<template functional>
  <div class="app-modal">
    <slot name="modal-header"></slot>
    <slot></slot>
    <slot name="modal-footer"></slot>
  </div>
</template>

<script>
export default {
  name: 'AppModal'
}
</script>

<style lang="scss">
.app-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background: rgba(11, 11, 11, 0.5);
}
</style>
