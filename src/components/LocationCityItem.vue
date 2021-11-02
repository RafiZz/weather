<template>
  <section class="location">
    <h4 class="location__title">Watch weather in your current location</h4>
    <CityItem
      :title="`${city.name}, ${city.countryCode.toUpperCase()}`"
      subtitle="Your current location"
      :weather="city.weather"
      :temp="city.temp"
      :humidity="city.humidity"
      :updated-at-millis="city.updatedAtMillis"
      :updated-at-formatter="city.formatUpdatedAt"
      :loading="loading"
    >
      <template v-slot:actions="{ loading }">
        <div class="location-actions">
          <BaseButton @click="onReload" :loading="loading" :disabled="loading">
            <span>RELOAD</span>
          </BaseButton>
        </div>
      </template>
    </CityItem>
  </section>
</template>

<script>
import CityItem from './CityItem.vue'
import BaseButton from './BaseButton.vue'
import { City } from '@/types/city'

export default {
  name: 'LocationCityItem',
  props: {
    city: City,
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
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
}

.location-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
