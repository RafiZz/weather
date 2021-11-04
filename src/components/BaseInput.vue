<template>
  <div
    class="base-input"
  >
    <input
      type="text"
      class="base-input__input"
      :class="{
        'base-input__input_error': error
      }"
      v-bind="$attrs"
      :value="value"
      @input="onInput"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
    />
    <div v-if="error" class="base-input__error">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      required: true
    },
    error: {
      type: String,
      required: false
    }
  },
  methods: {
    onInput (event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>

<style lang="scss">
.base-input {
  &__input {
    width: 100%;
    padding: 0;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    color: map-get($colors, text-primary);
    background-color: transparent;
    background-image: none;
    border: none;
    border-bottom: 1px solid map-get($colors, text-primary);
    outline: none;
    box-shadow: none;

    &:placeholder {
      color: map-get($colors, button-disabled);
    }

    &:read-only {
      color: map-get($colors, button-disabled);
      cursor: not-allowed;
    }

    &_error {
      border-color: map-get($colors, text-error);
    }
  }

  &__error {
    font-size: 16px;
    font-style: normal;
    font-weight: normal;
    line-height: 24px;
    color: map-get($colors, text-error);
    text-align: left;
  }
}
</style>
