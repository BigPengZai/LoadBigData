<template>
  <!-- 可视区域的容器 -->
  <div class="virtual-container" ref="list" @scroll="scrollEvent">
    <!--  -->
    <div class="list-height" :style="{ height: listHeight + 'px' }"></div>
    <div class="list-container" :style="{ transform: getTransform }">
      <!-- item-1 -->
      <div
        ref="items"
        class="list-item"
        v-for="item in visibleData"
        :key="item.tid"
        :style="{ height: itemSize + 'px', lineHeight: itemSize + 'px' }"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  defineProps,
  withDefaults,
  onMounted,
  nextTick,
  reactive,
} from "vue";

import { useWinSize } from "../utils/useWinSize.js";
// 可视区域高度固定，===》screenHeight
// 列表项高度固定，===》itemSize
// 列表数据，===》listData

const list = ref<HTMLElement>();

// let screenHeight = reactive(useWinSize());
let screenHeight = useWinSize();

interface Props {
  listData: { tid: number; value: number }[];
  itemSize: number;
}
const props = withDefaults(defineProps<Props>(), {
  listData: () => [],
  itemSize: 200,
});
const { listData, itemSize } = props;
// 列表总高度 listHeight
const listHeight = computed(() => listData.length * itemSize);
// 可显示的列表项数
const visibleCount = computed(() =>
  Math.ceil(screenHeight.value.height / itemSize)
);

// 偏移量 startOffset，滚动后将渲染区域 偏移到可视区域中
let startOffset = ref(0);
// 偏移量对应的style
const getTransform = computed(() => `translate3d(0,${startOffset.value}px,0)`);

// 数据起始索引
let startIndex = ref(0);
// 数据的结束索引
let endIndex = ref(0);
// 列表显示的数据
const visibleData = computed(() => {
  return listData.slice(startIndex.value, endIndex.value);
});

onMounted(() => {
  nextTick(() => {
    endIndex.value = startIndex.value + visibleCount.value;
    // screenHeight = useWinSize().height;
    console.log(
      startIndex.value,
      endIndex.value,
      screenHeight.value.height,
      visibleData.value.length
    );
  });
});

const scrollEvent = () => {
  // 当前滚动位置，===》scrollTop
  let scrollTop = list.value?.scrollTop || 0;
  startIndex.value = Math.floor(scrollTop / itemSize);
  endIndex.value = startIndex.value + visibleCount.value;

  startOffset.value = scrollTop - (scrollTop % itemSize);

  console.log(
    startIndex.value,
    endIndex.value,
    startOffset.value,
    screenHeight.value.height
  );
};
</script>

<style scoped>
.virtual-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}
.list-height {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}
.list-cotainer {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
  z-index: 10000;
}
.list-item {
  background-color: beige;
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>
