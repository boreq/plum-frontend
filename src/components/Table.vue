<template>
    <div class="table">
        <div class="thead" v-if="header">
            <div class="th" v-for="(column, index) in header.columns" :style="getColumnStyle(index)">
                {{ column.label }}
            </div>
        </div>
        <div v-if="!dataPresent" class="no-data">
            no data
        </div>
        <div class="tbody" v-if="dataPresent">
            <div class="tr" v-for="(row, rowIndex) in limitedRows">
                <div class="td" v-for="(value, columnIndex) in row.data" :style="getColumnStyle(columnIndex)" :title="value">
                    {{ value }}
                </div>
                <div class="background" :style="getBackgroundStyle(rowIndex)"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./Table.ts"></script>
<style scoped lang="scss" src="./Table.scss"></style>
