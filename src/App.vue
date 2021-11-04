<template>
  <div id="app">
    <AppHeader />
    <main class="app-main">
      <LocationCityItem
        v-if="locationCityWithMeta.city"
        :title="`${locationCityWithMeta.city.name}, ${locationCityWithMeta.city.countryCode.toUpperCase()}`"
        subtitle="Your current location"
        :weather="locationCityWithMeta.city.weather"
        :temp="locationCityWithMeta.city.temp"
        :humidity="locationCityWithMeta.city.humidity"
        :updated-at-millis="locationCityWithMeta.city.updatedAtMillis"
        :loading="locationCityWithMeta.loading"
        @reload="onReloadLocationCity"
      />

      <CityList
        :cities="citiesWithMeta"
        @reloadCity="onReloadCity"
        @removeCity="onRemoveCity"
      />

      <BaseButton
        v-if="!addModalShow"
        class="app-main__open-modal-btn"
        @click="openAddModal"
      >
        +
      </BaseButton>
    </main>

    <AppModal v-if="addModalShow" @close="closeAddModal">
      <CityForm
        @cancel="onFormCancel"
        @add="onFormSubmit"
        :added-cities="addedCitiesNames"
      />
    </AppModal>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import LocationCityItem from '@/components/LocationCityItem.vue'
import CityList from '@/components/CityList.vue'
import { LocationHelper } from '@/utils/locationHelper'
import { api } from '@/api'
import { db } from '@/db'
import CityForm from './components/CityForm.vue'
import AppModal from './components/AppModal.vue'
import BaseButton from './components/BaseButton.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    LocationCityItem,
    CityList,
    CityForm,
    AppModal,
    BaseButton
  },
  data () {
    return {
      locationCityWithMeta: {
        city: null,
        loading: false
      },
      citiesWithMeta: [],

      addModalShow: false,
      cityAddError: ''
    }
  },
  computed: {
    locationCity () {
      return this.locationCityWithMeta.city
    },
    cities () {
      return this.citiesWithMeta.map(({ city }) => city)
    },
    addedCitiesNames () {
      return this.cities.map(c => c.name)
    }
  },
  watch: {
    locationCity (newVal) {
      db.setLocationCity(newVal)
    },
    cities (newVal) {
      db.setCities(newVal)
    }
  },
  mounted () {
    this.loadApp()
  },
  methods: {
    async loadApp () {
      try {
        await db.initialize()
        await Promise.all([
          this._loadLocationCity(),
          this._loadCities()
        ])

        if (!this.locationCityWithMeta.city) {
          await this._fetchLocationCityWeater()
        }
      } catch (e) {
        this._handleError(e)
      }
    },
    async _loadLocationCity () {
      this.locationCityWithMeta.city = await db.getLocationCity()
    },
    async _loadCities () {
      const cities = await db.getCities()
      this.citiesWithMeta = cities.map(city => ({ city, loading: false }))
    },
    async _fetchLocationCityWeater () {
      this.locationCityWithMeta.loading = true
      try {
        const { lat, lon } = await LocationHelper.getLocationCoords()
        this.locationCityWithMeta.city = await api.fetchWeatherByCoords({ lat, lon })
      } finally {
        this.locationCityWithMeta.loading = false
      }
    },
    async onReloadLocationCity () {
      try {
        await this._fetchLocationCityWeater()
      } catch (e) {
        this._handleError(e)
      }
    },
    async onReloadCity (cityWithMeta) {
      cityWithMeta.loading = true
      try {
        cityWithMeta.city = await api.fetchWeatherByCityName(cityWithMeta.city.name)
      } catch (e) {
        this._handleError(e)
      } finally {
        cityWithMeta.loading = false
      }
    },
    onRemoveCity (cityWithMeta) {
      const index = this.citiesWithMeta.indexOf(cityWithMeta)
      if (index === -1) {
        return
      }
      this.citiesWithMeta.splice(index, 1)
    },
    openAddModal () {
      this.addModalShow = true
    },
    closeAddModal () {
      this.addModalShow = false
    },
    onFormCancel () {
      this.closeAddModal()
    },
    async onFormSubmit ({ name }) {
      try {
        const city = await api.fetchWeatherByCityName(name)
        this.citiesWithMeta.push({ city, loading: false })
        this.closeAddModal()
      } catch (e) {
        this._handleError(e)
      }
    },
    _handleError (e) {
      // TODO: dialog component
      alert(e.isAxiosError && e?.response?.data?.message ? e.response.data.message : e.message)
    }
  }
}
</script>

<style lang="scss">
@import url('~@/scss/styles.scss');

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: map-get($colors, text-primary);
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @include container();
}

.app-main {
  flex-grow: 1;

  @include breakpoint(xxl) {
    position: relative;
  }

  &__open-modal-btn {
    width: 56px;
    height: 56px;
    margin-bottom: 34px;
    color: #fff;
    background-color: map-get($colors, button-primary);
    border-radius: 50px;
    box-shadow: 0 4px 5px rgba(0, 0, 0, 0.14), 0 1px 10px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.2);

    @include breakpoint(xxl) {
      position: absolute;
      right: -106px;
      bottom: 0;
    }
  }
}
</style>
