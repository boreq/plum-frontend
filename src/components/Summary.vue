<template>
    <div>
          <div class="label">
            Visits
          </div>
          <div class="value">
              {{ visits }}
          </div>
          <div class="label">
            Hits
          </div>
          <div class="value">
              {{ hits }}
          </div>
          <div class="label">
            Bytes sent
          </div>
          <div class="value">
              {{ bytesSent }}
          </div>
    </div>
</template>
<script lang="ts" src="./Summary.ts"></script>
<style scoped lang="scss" src="./Summary.scss"></style>
