<template>
  <div ref="list" class="virtual-container" @scroll="handleScroll">
    <div
      ref="listHeight"
      class="list-height"
      :style="{ height: screenHeight + 'px' }"
    ></div>
    <div ref="listContainer" class="list-container">
      <div
        ref="items"
        class="list-item"
        v-for="item in visibleData"
        :id="item.index + ''"
        :key="item.item.tid"
      >
        <slot :item="item.item"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// startIndex  endIndex  可视区域  startOffSet
import {
  reactive,
  ref,
  computed,
  onMounted,
  withDefaults,
  defineProps,
  onUpdated,
  nextTick,
} from "vue";

import { useWinSize } from "../utils/useWinSize.js";

interface Props {
  listData: { tid: number; name: string; value: string }[]; //列表数据
  estimateItemSize: number; //预估高度
  bufferPage: number; //缓冲区 page数量
}

interface Position {
  top: number;
  bottom: number;
  height: number;
  index: number;
}

//estimateItemSize:预估高度
const props = withDefaults(defineProps<Props>(), {
  listData: () => [{ tid: 0, name: "", value: "", bufferPage: 1 }],

  estimateItemSize: 100,
});

//screenHeight
const screenHeight = useWinSize().value.height;
const { listData, estimateItemSize, bufferPage } = props;

const items = ref<Array<HTMLElement>>();
const listHeight = ref<HTMLElement>();
const listContainer = ref<HTMLElement>();
const list = ref<HTMLElement>();

// let positions: Position[] = [];
let positions = ref<Array<Position>>([]);
// let positions = computed(() => Array<Position>);

// positions 列表渲染后存储 每一项的高度以及位置信息
const initPositions = () => {
  positions.value = listData.map((_, index) => ({
    index,
    height: estimateItemSize,
    top: index * estimateItemSize,
    bottom: (index + 1) * estimateItemSize,
  }));
};
initPositions();

// 数据起始索引
let startIndex = ref(0);
// 数据的结束索引
let endIndex = ref(0);
//visibleCount
const visibleCount = computed(() => Math.ceil(screenHeight / estimateItemSize));

//头缓存数
const aboveCount = computed(() =>
  Math.min(startIndex.value, bufferPage * visibleCount.value)
);

//尾部缓存数
const belowCount = computed(() =>
  Math.min(listData.length - endIndex.value, bufferPage * visibleCount.value)
);

let _listData = computed(() =>
  listData.map((item, index) => ({ index, item }))
);

//不带缓冲区的visibleData
// const visibleData = computed(() => {
//   return _listData.value.slice(startIndex.value, endIndex.value);
// });

const visibleData = computed(() => {
  let start = startIndex.value - aboveCount.value;
  let end = endIndex.value + belowCount.value;
  return _listData.value.slice(start, end);
});

// 获取索引开始位置
const getStartIndex = (scrollTop = 0) => {
  return binarySearch(positions.value, scrollTop);
};
// 二分查找
const binarySearch = (list, value) => {
  let start = 0;
  let end = list.length - 1;
  let tempIndex: null | number = null;
  while (start <= end) {
    // let midIndex = parseInt((start + end) / 2);
    let midIndex = Math.floor((start + end) / 2);
    let midValue = list[midIndex].bottom;
    if (midValue === value) {
      return midIndex + 1;
    } else if (midValue < value) {
      start = midIndex + 1;
    } else if (midValue > value) {
      if (tempIndex === null || tempIndex > midIndex) {
        tempIndex = midIndex;
      }
      end = end - 1;
    }
  }
  return tempIndex;
};

// 获取列表项当前的尺寸
const updateItemSize = () => {
  items.value?.forEach((node) => {
    let rect = node.getBoundingClientRect();
    let height = rect.height;
    console.log("height:", height);
    let index = +node.id.slice(0);
    let oldHeight = positions.value[index].height;
    let dValue = oldHeight - height;
    console.log("dValue:" + dValue);
    if (dValue) {
      // 修改当前的索引的属性
      positions.value[index].bottom = positions.value[index].bottom - dValue;
      positions.value[index].height = height;

      // 修改之后的所有值的属性
      for (let k = index + 1; k < positions.value.length; k++) {
        positions.value[k].top = positions.value[k - 1].bottom;
        positions.value[k].bottom = positions.value[k].bottom - dValue;
      }
    }
  });
};
const setStartOffset = () => {
  let startOffset =
    startIndex.value >= 1 ? positions.value[startIndex.value - 1].bottom : 0;
  listContainer.value!.style.transform = `translate3d(0,${startOffset}px,0)`;
};

const handleScroll = () => {
  //当前滚动的位置
  let scrollTop = list.value?.scrollTop;
  startIndex.value = getStartIndex(scrollTop) as number;
  endIndex.value = startIndex.value + visibleCount.value;

  setStartOffset();

  // console.log(scrollTop, startIndex.value, endIndex.value);
};

onMounted(() => {
  nextTick(() => {
    endIndex.value = startIndex.value + visibleCount.value;

    // console.log(visibleData.value, startIndex.value, endIndex.value);
  });
});

onUpdated(() => {
  nextTick(() => {
    if (!items.value?.length) return;

    console.log("onUpdated", items.value.length);
    //获取真实元素大小，修改对应的尺寸缓存
    updateItemSize();
    //更新列表总高
    let height = positions.value[positions.value.length - 1].bottom;
    listHeight.value!.style.height = height + "px";

    //更新真实偏移量
    setStartOffset();
  });
});
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
.list-container {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
  z-index: 10000;
  height: 100%;
}
.list-item {
  background-color: beige;
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>
