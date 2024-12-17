<template>
  <div>
    <selector
      :isShow="isProviceSelectorShow"
      @handle-change="handleProviceChange"
      default-title="请选择 - 省"
      codeKey="proviceCode"
      :data="provices"
    />
    <selector
      :isShow="isCitySelectorShow"
      @handle-change="handleCityChange"
      default-title="请选择 - 市"
      codeKey="cityCode"
      :data="state.cities"
    />
    <selector
      :isShow="isCountySelectorShow"
      @handle-change="handleCountyhange"
      default-title="请选择 - 区/县"
      codeKey="countyCode"
      :data="state.counties"
    />
  </div>
</template>

<script setup>
import { computed, reactive, toRaw } from 'vue'
import Selector from './components/unionSelector.vue'
import cityData from './city'

const state = reactive({
  cities: null,
  counties: null,
  selectedInfo: {
    provice: null,
    city: null,
    county: null
  }
})
const provices = formatData(cityData)

const isProviceSelectorShow = computed(() => !!provices)
const isCitySelectorShow = computed(() => !!state.cities)
const isCountySelectorShow = computed(() => !!state.counties)

const handleProviceChange = (value) => {
  if (!value) {
    state.selectedInfo.provice = null
    state.cities = null
    return
  }
  state.counties = null
  state.selectedInfo.city = null
  state.selectedInfo.county = null

  const [code, name] = value.split(':')
  state.selectedInfo.provice = {
    code,
    name
  }

  state.cities = provices[name].cities
}

const handleCityChange = (value) => {
  if (!value) {
    state.selectedInfo.city = null
    state.counties = null
    return
  }

  state.selectedInfo.county = null
  const [code, name] = value.split(':')

  state.selectedInfo.city = {
    code,
    name
  }

  state.counties = state.cities[name].counties
}

const handleCountyhange = (value) => {
  console.log(toRaw(state.selectedInfo))
  if (!value) {
    state.counties = null
    state.selectedInfo.county = null
    return
  }

  const [code, name] = value.split(':')

  state.selectedInfo.county = {
    code,
    name
  }

  // console.log(state.selectedInfo)
}

function formatData(data) {
  data = JSON.parse(JSON.stringify(data))
  return data.reduce((pre1, cur1) => {
    cur1.cities = cur1.cities.reduce((pre2, cur2) => {
      cur2.counties = cur2.counties.reduce((pre3, cur3) => {
        pre3[cur3.countyName] = cur3
        return pre3
      }, {})

      pre2[cur2.cityName] = cur2
      return pre2
    }, {})

    pre1[cur1.proviceName] = cur1
    return pre1
  }, {})
}
</script>