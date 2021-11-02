<template>
  <div id="app">
    <AppHeader />
    <main class="app-main">
      <LocationCityItem
        v-if="locationCity"
        :city="locationCity"
        :loading="isLocationCityReloading"
        @reload="onReloadLocationCity"
      />

      <CityList
        :cities="cities"
        :reloading-cities="reloadingCities"
        @reload="onReloadCityItem"
        @remove="onRemove"
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
        :added-cities="addedCities"
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
      locationCity: null,
      cities: [],

      addModalShow: false,
      cityAddError: '',

      isLocationCityReloading: false,
      reloadingCities: []
    }
  },
  computed: {
    addedCities () {
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

        if (!this.locationCity) {
          await this._fetchLocationCityWeater()
        }
      } catch (e) {
        this._handleError(e)
      }
    },
    async _loadLocationCity () {
      this.locationCity = await db.getLocationCity()
    },
    async _loadCities () {
      this.cities = await db.getCities()
    },
    async _fetchLocationCityWeater () {
      this.isLocationCityReloading = true
      try {
        const { lat, lon } = await LocationHelper.getLocationCoords()
        this.locationCity = await api.fetchWeatherByCoords({ lat, lon })
      } finally {
        this.isLocationCityReloading = false
      }
    },
    async _fetchCityWeatherByName (cityName) {
      const index = this.reloadingCities.push(cityName.toLowerCase()) - 1
      try {
        const city = await api.fetchWeatherByCityName(cityName)
        return city
      } finally {
        this.reloadingCities.splice(index, 1)
      }
    },
    async onReloadLocationCity () {
      try {
        await this._fetchLocationCityWeater()
      } catch (e) {
        this._handleError(e)
      }
    },
    async onReloadCityItem (city) {
      try {
        const updatedCity = await this._fetchCityWeatherByName(city.name)
        const index = this.cities.findIndex(c => c.name === city.name)
        if (index !== -1) {
          this.cities.splice(index, 1, updatedCity)
        }
      } catch (e) {
        this._handleError(e)
      }
    },
    onRemove (city) {
      this.cities.splice(this.cities.findIndex(c => c.name === city.name), 1)
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
        const city = await this._fetchCityWeatherByName(name)
        this.cities.push(city)
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
