<template>
  <div class="city-form">
    <div class="city-form__title">Choose a city</div>
    <div class="city-form__subtitle">
      Type city name
      <!-- To find city start typing and pick one from the suggestions -->
    </div>
    <BaseInput
      v-model.trim="$v.cityName.$model"
      placeholder="Search city"
      :error="cityNameError"
      @blur="$v.cityName.$touch"
      :autofocus="true"
    />
    <div class="city-form-actions">
      <BaseButton
        class="city-form__btn city-form__btn_clear"
        @click="onClear"
        :disabled="!cityName"
      >
        CLEAR
      </BaseButton>
      <BaseButton
        class="city-form__btn city-form__btn_cancel"
        @click="onCancel"
      >
        CANCEL
      </BaseButton>
      <BaseButton
        @click="onAdd"
        :disabled="!$v.cityName.$dirty || Boolean(cityNameError)"
      >
        ADD
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { required, helpers } from 'vuelidate/lib/validators'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'

const cityNameRegex = helpers.regex('regex', /^[a-zA-Z -']*$/)

export default {
  name: 'CityForm',
  components: {
    BaseInput,
    BaseButton
  },
  props: {
    error: {
      type: String
    },
    addedCities: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      cityName: ''
    }
  },
  validations: {
    cityName: {
      required,
      cityNameRegex,
      isUnique (value) {
        if (value === '') return true

        return !this.addedCities.some(cn => cn.toLowerCase() === value.toLowerCase())
      }
    }
  },
  computed: {
    cityNameError () {
      if (!this.$v.cityName.$error) {
        return ''
      }
      if (!this.$v.cityName.required) {
        return 'City name is required'
      }
      if (!this.$v.cityName.regex) {
        return 'City name can contain only English letters'
      }
      if (!this.$v.cityName.isUnique) {
        return 'This city already in added'
      }
      return 'Unknown error'
    }
  },
  methods: {
    onClear () {
      this.cityName = ''
    },
    onCancel () {
      this.$emit('cancel')
    },
    onAdd () {
      this.$emit('add', { name: this.cityName })
    }
  }
}
</script>

<style lang="scss">
.city-form {
  padding: 24px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(10, 10, 10, 0.25);

  @include breakpoint(xs) {
    min-width: calc(100% - 20px);
  }

  @include breakpoint(sm) {
    min-width: 451px;
  }

  @include breakpoint(md) {
    min-width: 551px;
  }

  @include breakpoint(xl) {
    min-width: 751px;
  }

  &__title {
    margin: 0 0 16px 0;
    font-size: 32px;
    font-style: normal;
    font-weight: bold;
    line-height: 38px;
    text-align: left;
  }

  &__subtitle {
    margin: 0 0 60px 0;
    font-size: 18px;
    font-style: normal;
    font-weight: normal;
    line-height: 24px;
    text-align: left;
  }

  &-actions {
    display: flex;
    margin-top: 140px;
  }

  &__btn {
    &_clear {
      margin-right: auto;
    }

    &_cancel {
      margin-right: 31px;
    }
  }
}
</style>
