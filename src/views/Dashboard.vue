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

      <div class="grid" :class="{ updating: updating }">
          <div class="box box-inversed summary">
              <Summary :data="data"></Summary>
          </div>
          <div class="box box-normal hits-and-visits">
              <HitsAndVisits :data="data"></HitsAndVisits>
          </div>
          <div class="box box-normal pages">
              <Pages :data="data"></Pages>
          </div>
          <div class="box box-normal referers">
              <Referers :data="data"></Referers>
          </div>
          <div class="box box-normal errors">
              <Pages :data="data"></Pages>
          </div>
          <div class="box box-normal static">
              <Pages :data="data"></Pages>
          </div>
      </div>
  </div>
</template>
<script lang="ts" src="./Dashboard.ts"></script>
<style scoped lang="scss" src="./Dashboard.scss"></style>
