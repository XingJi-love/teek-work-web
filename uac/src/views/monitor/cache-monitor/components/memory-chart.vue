<script setup lang="ts" name="MemoryChart">
import { useChartComponent } from "@/composables";

interface ChartProps {
  value: string;
  width?: string;
  height?: string;
}

const props = withDefaults(defineProps<ChartProps>(), {
  width: "100%",
  height: "520px",
});

const { initChart } = useChartComponent({
  chartOptions: { instanceName: "chartInstance" },
  options: {
    title: {
      text: "内存信息",
      left: "center",
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    tooltip: {
      formatter: `{a} <br/>{b} : {c}${props.value.charAt(props.value.length - 1)}`,
    },
    series: [
      {
        name: "内存消耗",
        type: "gauge",
        min: 0,
        max: 1000,
        detail: {
          formatter: () => {
            return props.value;
          },
        },
        data: [
          {
            value: parseFloat(props.value),
            name: "峰值",
          },
        ],
      },
    ],
  },
});

onMounted(initChart);
</script>

<template>
  <div ref="chartInstance" :style="{ width: width, height: height }"></div>
</template>
