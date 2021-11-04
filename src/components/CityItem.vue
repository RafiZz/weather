<template>
  <div class="city-item">
    <h2 class="city-item__title">{{ title }}</h2>
    <h4 class="city-item__subtitle">{{ subtitle }}</h4>
    <table class="city-table">
      <tr class="city-table-row">
        <td>Weather</td>
        <td>{{ weather }}</td>
      </tr>
      <tr class="city-table-row">
        <td>Temperature</td>
        <td>
          {{ temp }}
          <slot name="tempUnit">
            &deg;C
          </slot>
        </td>
      </tr>
      <tr class="city-table-row">
        <td>Humidity</td>
        <td>{{ humidity }} %</td>
      </tr>
      <tr class="city-table-row_updated">
        {{ readableDuration }}
      </tr>
    </table>
    <slot name="actions" v-bind:loading="loading" />
  </div>
</template>

<script>
import { CityHelper } from '../utils/cityHelper'

export default {
  name: 'CityItem',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    weather: {
      type: String,
      required: true
    },
    temp: {
      type: [String, Number],
      required: true
    },
    humidity: {
      type: [String, Number],
      required: true
    },
    updatedAtMillis: {
      type: Number,
      required: true
    },
    updatedAtFormatter: {
      type: Function,
      default: CityHelper.formatUpdatedAt
    },
    interval: {
      type: Number,
      default: 60 * 1000
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentDate: Date.now(),
      currentDateUpdateInterval: null
    }
  },
  computed: {
    readableDuration () {
      return this.updatedAtFormatter({
        now: this.currentDate,
        updated: this.updatedAtMillis
      })
    }
  },
  watch: {
    updatedAtMillis () {
      this.updateCurrentDate()
      this.clearDurationUpdateInterval()
      this.setDurationUpdateInterval()
    }
  },
  mounted () {
    this.setDurationUpdateInterval()
  },
  beforeDestroy () {
    this.clearDurationUpdateInterval()
  },
  methods: {
    setDurationUpdateInterval () {
      this.currentDateUpdateInterval = setInterval(this.updateCurrentDate, this.interval)
    },
    clearDurationUpdateInterval () {
      clearInterval(this.currentDateUpdateInterval)
    },
    updateCurrentDate () {
      this.currentDate = Date.now()
    }
  }
}
</script>

<style lang="scss">
.city-item {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(10, 10, 10, 0.25);

  &__title {
    margin: 0 0 auto 0;
    font-size: 32px;
    font-style: normal;
    font-weight: bold;
    line-height: 38px;
    text-align: left;
  }

  &__subtitle {
    margin: 15px 0 40px 0;
    font-size: 18px;
    font-style: normal;
    font-weight: normal;
    line-height: 24px;
    text-align: left;
  }
}

.city-table {
  width: 100%;
  margin-bottom: 32px;

  &-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    height: 24px;
    margin-bottom: 12px;
    border-bottom: 1px solid #c4c4c4;

    &_updated {
      color: map-get($colors, text-secondary);
      text-align: right;
    }
  }
}
</style>
