<template>
  <div class="dashboard">
      <div class="parameters">
          <div class="box box-dimmed">
              <ul>
                  <li><a v-bind:class="{ active: selectedTimePeriod === TimePeriod.Day }" v-on:click="selectTimePeriod(TimePeriod.Day)">1D</a></li>
                  <li><a v-bind:class="{ active: selectedTimePeriod === TimePeriod.Week }" v-on:click="selectTimePeriod(TimePeriod.Week)">1W</a></li>
                  <li><a v-bind:class="{ active: selectedTimePeriod === TimePeriod.Month }" v-on:click="selectTimePeriod(TimePeriod.Month)">1M</a></li>
                  <li><a v-bind:class="{ active: selectedTimePeriod === TimePeriod.Year }" v-on:click="selectTimePeriod(TimePeriod.Year)">1Y</a></li>
              </ul>
          </div>
      </div>

      <div class="grid">
          <div class="box box-inversed summary">
              <div class="label">
                Visits
              </div>
              <div class="value">
                1234
              </div>
              <div class="label">
                Hits
              </div>
              <div class="value">
                2234
              </div>
              <div class="label">
                Errors
              </div>
              <div class="value">
                0.11%
              </div>
          </div>
          <div class="box box-normal hits-and-visits">
              <HitsAndVisits :data="data"></HitsAndVisits>
          </div>
          <div class="box box-normal pages">
              pages
          </div>
          <div class="box box-normal referers">
              referers
          </div>
          <div class="box box-normal errors">
              errors
          </div>
          <div class="box box-normal static">
              static
          </div>
      </div>
  </div>
</template>
<script lang="ts" src="./Dashboard.ts"></script>
<style scoped lang="scss" src="./Dashboard.scss"></style>
