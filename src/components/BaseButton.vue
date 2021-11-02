<template>
  <button
    class="btn"
    v-on="listeners"
    :disabled="disabled"
  >
    <slot></slot>

    <slot name="loader" v-if="loading">
      ...
    </slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
        click: this.onClick
      }
    }
  },
  methods: {
    onClick (e) {
      if (this.disabled) {
        return
      }
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss">
.btn {
  padding: 0;
  font-size: 16px;
  font-style: normal;
  font-weight: bold;
  line-height: 24px;
  color: map-get($colors, button-primary);
  cursor: pointer;
  background: none;
  border: none;

  &:disabled {
    color: map-get($colors, button-disabled);
    cursor: not-allowed;
  }
}
</style>
