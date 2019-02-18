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

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { TimePeriod } from '@/services/TimePeriod';
    import { ApiResource } from '@/services/ApiResource';
    import { RangeData } from '@/services/Data';
    import HitsAndVisits from '@/components/HitsAndVisits.vue';

    @Component({
      components: {
          HitsAndVisits,
      },
    })
    export default class Dashboard extends Vue {

        TimePeriod = TimePeriod;

        selectedTimePeriod: TimePeriod = TimePeriod.Day;
        data: RangeData[] = [];

        created(): void {
            this.reloadData();
        }

        selectTimePeriod(timePeriod: TimePeriod): void {
            this.selectedTimePeriod = timePeriod;
            this.reloadData();
        }

        private reloadData(): void {
            const apiResource = new ApiResource();
            apiResource.getTimeRange(this.selectedTimePeriod)
                .then(response => {
                    console.log(response);
                    this.data = response.data;
                });
        }
    }
</script>

<style scoped lang="scss">
    $spacing: 5px;

    .grid {
        display: grid;
        grid-template-columns: 250px auto auto;
        grid-template-rows: auto auto auto;
        grid-column-gap: $spacing;
        grid-row-gap: $spacing;
        grid-template-areas: 
            "summary hits-and-visits hits-and-visits"
            "summary pages referers"
            "summary errors static";
        
        .summary {
            grid-area: summary;
        }

        .hits-and-visits {
            grid-area: hits-and-visits;
        }

        .pages {
            grid-area: pages;
        }

        .referers {
            grid-area: referers;
        }

        .errors {
            grid-area: errors;
        }

        .static {
            grid-area: static;
        }


        .box.box-inversed {
            background-color: $box-inversed-background-color;

            .label {
                color: $box-inversed-text-dimmed-color;
                font-size: 12px;
                text-transform: uppercase;
            }

            .value {
                margin-bottom: .5em;
                color: $box-inversed-text-color;
                font-size: 68px;
                font-weight: 300;
            }
        }

        .box.box-normal {
            background-color: $box-normal-background-color;
        }
    }

    .parameters {
        display: flex;
        flex-direction: row;
        font-size: 10px;

        .box {
            margin: $spacing $spacing $spacing 0;
            padding: .5em 1em;

            ul {
                margin: 0; 
                padding: 0;
                list-style-type: 0;

                li {
                    margin: 0; 
                    padding: 0 5px 0 0;
                    display: inline-block;
                }
            }

            a {
                cursor: pointer;
            }

            a:hover {
                color: $primary-color;
            }

            a.active {
                color: $primary-color;
            }
        }

        .box.box-dimmed {
            background-color: $box-dimmed-background-color;
            color: $box-dimmed-text-color;
        }
    }

    .box {
        padding: 2em 1em;
        border-radius: 5px;
    }

</style>
