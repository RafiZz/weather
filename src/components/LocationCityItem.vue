<template>
  <section class="location">
    <CardWrapper>
      <h4 class="location__title">Watch weather in your current location</h4>
      <CityItem
        v-if="city"
        :title="`${city.name}, ${city.countryCode.toUpperCase()}`"
        subtitle="Your current location"
        :weather="city.weather"
        :temp="city.temp"
        :humidity="city.humidity"
        :updated-at-millis="city.updatedAtMillis"
        :loading="loading"
      >
        <template v-slot:actions="{ loading }">
          <div v-if="error" class="location-status">
            <div class="location-status__text location-status__text_error">
              Error: {{ error }}
            </div>
          </div>

          <div class="location-actions">
            <BaseButton @click="onReload" :loading="loading" :disabled="loading">
              <span>RELOAD</span>
            </BaseButton>
          </div>
        </template>
      </CityItem>
      <div v-else-if="loading" class="location-status">
        <div class="location-status__text">
          Loading
        </div>
      </div>
      <div v-else-if="error" class="location-status">
        <div class="location-status__text location-status__text_error">
          Error: {{ error }}
        </div>
      </div>
    </CardWrapper>
  </section>
</template>

<script>
import CardWrapper from './CardWrapper.vue'
import CityItem from './CityItem.vue'
import BaseButton from './BaseButton.vue'
import { CityHelper } from '../utils/cityHelper'

export default {
  name: 'LocationCityItem',
  props: {
    city: {
      type: Object,
      validator: (value) => {
        try {
          CityHelper.validateCityObject(value || {})
          return true
        } catch {
          return false
        }
      }
    },
    error: {
      type: String,
      required: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CardWrapper,
    CityItem,
    BaseButton
  },
  methods: {
    onReload () {
      this.$emit('reload')
    }
  }
}
</script>

<style lang="scss">
.location {
  margin: 0 auto 80px;

  @include breakpoint(md) {
    max-width: 824px;
  }

  &__title {
    margin: 0;
    margin-bottom: 20px;
    font-size: 24px;
    font-style: normal;
    font-weight: normal;
    line-height: 24px;
    color: map-get($colors, text-secondary);
  }

  &-actions {
    display: flex;
    justify-content: flex-end;
  }

  &-status {
    margin-top: 20px;

    &__text {
      text-align: left;

      &_error {
        color: map-get($colors, text-error);
      }
    }
  }
}
</style>
