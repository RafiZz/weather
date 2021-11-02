<template>
  <section class="city-list">
    <article
      class="city-list-item"
      v-for="city in cities"
      :key="city.name"
    >
      <CityItem
        :title="city.name"
        :subtitle="city.country"
        :weather="city.weather"
        :temp="city.temp"
        :humidity="city.humidity"
        :updated-at-millis="city.updatedAtMillis"
        :updated-at-formatter="city.formatUpdatedAt"
        :loading="isReloadingInProcess(city)"
      >
        <template v-slot:actions="{ loading }">
          <div class="city-actions">
            <BaseButton @click="remove(city)">
              <span>REMOVE</span>
            </BaseButton>
            <BaseButton @click="reload(city)" :loading="loading" :disabled="loading">
              <span>RELOAD</span>
            </BaseButton>
          </div>
        </template>
      </CityItem>
    </article>
  </section>
</template>

<script>
import CityItem from '@/components/CityItem.vue'
import BaseButton from './BaseButton.vue'

export default {
  name: 'CityList',
  components: {
    CityItem,
    BaseButton
  },
  props: {
    cities: {
      type: Array,
      required: true
    },
    reloadingCities: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    isReloadingInProcess (city) {
      return this.reloadingCities.some(cn => cn.toLowerCase() === city.name.toLowerCase())
    },
    remove (city) {
      this.$emit('remove', city)
    },
    reload (city) {
      this.$emit('reload', city)
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
  }
}

.city-actions {
  display: flex;
  justify-content: space-between;
}
</style>
