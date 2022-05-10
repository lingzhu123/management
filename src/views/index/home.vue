<!-- 首页 -->
<template>
  <el-radio-group
    v-model="selectKey"
    @change="changeKey"
    style="margin-top: 20px"
  >
    <el-radio-button label="sale_">销量</el-radio-button>
    <el-radio-button label="_money">销售额</el-radio-button>
  </el-radio-group>
  <el-select
    v-model="selectDay"
    class="m-2"
    placeholder="Select"
    @change="changeKey"
    style="float: right; margin-top: 20px"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <div id="main" style="width: 100%; height: 300px; margin-top: 50px"></div>
  <el-divider />
  <p style="text-align: center; font-size: 20px">全国销量分布图</p>
  <div id="map" style="width: 100%; height: 800px"></div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, Ref } from "vue";
import * as echarts from "echarts";
import * as http from "../../request/http";
import chinaJSON from "../../data/china.json";
let myChart: echarts.ECharts;
let mapChart: echarts.ECharts;
//饼图配置项
const setData = (data: unknown) => {
  return {
    tooltip: {
      trigger: "item",
    },
    legend: {
      width: 300,
      height: 100,
      right: 10,
      top: 20,
      orient: "vertical",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: ["30%", "45%"],
        width: "100%",
        height: 300,
        avoidLabelOverlap: false,
        data: data,
      },
    ],
  };
};

//中国地图配置项
const setMapData = (data: unknown) => {
  return {
    visualMap: {
      type: "continuous",
      max: 1000000,
      min: 0,
      top: "40%",
      left: "2%",
      inRange: {
        color: ["red", "orange", "red"],
      },
      calculable: true,
    },
    tooltip: {
      show: true,
      formatter: "{b}<br/>销量:{c}",
    },
    series: [
      {
        type: "map",
        map: "china",
        top: 30,
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            areaColor: "#8884d8",
          },
        },
        itemStyle: { borderColor: "#fff" },

        data: data,
      },
    ],
  };
};
const fetchData = async () => {
  //发送请求获取数据
  const res = await http.getAdminStat();
  if (res.errno === 0) {
    //饼图
    var chartDom = document.getElementById("main") as HTMLElement;
    myChart = echarts.init(chartDom);
    //地图
    mapChart = echarts.init(document.getElementById("map") as HTMLElement);
    echarts.registerMap("china", chinaJSON as any);
    resData.value = res.data;
    const pieArr = res.data.salePie.map((item) => ({
      value: item.sale_today,
      name: item.name,
    }));
    // 饼图设置配置项
    myChart.setOption(setData(pieArr));

    //地图设置配置项
    let mapArr = res.data.saleMap.map((item) => ({
      value: item.saleNum,
      name: item.areaName,
    }));
    let mapOption = setMapData(mapArr);
    mapChart.setOption(mapOption);
  }
};
fetchData();

let selectKey = ref("sale_");
let selectDay = ref("today");
const options = ref([
  { label: "昨天", value: "yesterday" },
  { label: "今天", value: "today" },
  { label: "前三天", value: "three_days" },
]);

let resData = ref({}) as Ref<IndexStatData>;
//下拉框和单选按钮的值改变事件
const changeKey = () => {
  let key: string;
  if (selectDay.value === "sale_") {
    key = selectDay.value + selectDay.value;
  } else {
    key = selectDay.value + selectKey.value;
  }
  console.log(key);
  const newData = resData.value.salePie.map((item) => ({
    value: item[key],
    name: item.name,
  }));
  let option = setData(newData);
  //设置配置项
  myChart.setOption(option);
};
</script>
<style lang="less" scoped></style>
