<template>
  <section class="city-list">
    <article
      class="city-list-item"
      v-for="cityWithMeta in cities"
      :key="cityWithMeta.city.name"
    >
      <CardWrapper class="city-list-item-wrapper">
        <CityItem
          class="city-list-item-city"
          v-if="cityWithMeta.city"
          :title="cityWithMeta.city.name"
          :subtitle="getCountryNameByCode(cityWithMeta.city.countryCode)"
          :weather="cityWithMeta.city.weather"
          :temp="cityWithMeta.city.temp"
          :humidity="cityWithMeta.city.humidity"
          :updated-at-millis="cityWithMeta.city.updatedAtMillis"
          :loading="cityWithMeta.loading"
        >
          <template v-slot:actions="{ loading }">
            <div
              v-if="cityWithMeta.error"
              class="city-list-item-error"
            >
              <div class="city-list-item-error__text">
                Error: {{ cityWithMeta.error }}
              </div>
            </div>

            <div class="city-list-item-actions">
              <BaseButton @click="remove(cityWithMeta)">
                <span>REMOVE</span>
              </BaseButton>
              <BaseButton
                @click="reload(cityWithMeta)"
                :loading="loading"
                :disabled="loading"
              >
                <span>RELOAD</span>
              </BaseButton>
            </div>
          </template>
        </CityItem>
      </CardWrapper>
    </article>
  </section>
</template>

<script>
import CityItem from '@/components/CityItem.vue'
import BaseButton from './BaseButton.vue'
import { CityHelper } from '../utils/cityHelper'
import CardWrapper from './CardWrapper.vue'

export default {
  name: 'CityList',
  components: {
    CityItem,
    BaseButton,
    CardWrapper
  },
  props: {
    cities: {
      type: Array,
      required: true
    }
  },
  methods: {
    remove (cityWithMeta) {
      this.$emit('removeCity', cityWithMeta)
    },
    reload (cityWithMeta) {
      this.$emit('reloadCity', cityWithMeta)
    },
    getCountryNameByCode (countryCode) {
      return CityHelper.getCountryByCode(countryCode)
    }
  }
}
</script>

<style lang="scss">
.city-list {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  margin: 0 -20px;

  &-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 20px 34px;

    @include breakpoint(md) {
      width: 50%;
    }

    @include breakpoint(lg) {
      width: 33.33%;
    }

    @include breakpoint(xl) {
      width: 25%;
    }

    &-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    &-city {
      flex-grow: 1;
    }

    &-actions {
      display: flex;
      justify-content: space-between;
      margin-top: auto;
    }

    &-error {
      margin: 20px 0;

      &__text {
        color: map-get($colors, text-error);
        text-align: left;
      }
    }
  }
}
</style>
