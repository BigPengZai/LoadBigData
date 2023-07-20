<template>
  <div id="container" @scroll="handleScorll" ref="container">
    <div class="sunshine" v-for="item in showList" :key="item.tid">
      <img :src="item.src" alt="" />
      <span>{{ item.title }}</span>
    </div>
    <div ref="blank"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const container = ref<HTMLElement>();
const blank = ref<HTMLElement>();
const list = ref<any>([]);
const page = ref(1);
const limit = 50;

const totalPage = computed(() => Math.ceil(list.value.length / limit));
const showList = computed(() => list.value.slice(0, page.value * limit));

const handleScorll = () => {
  if (page.value >= totalPage.value) return;
  const clientHeight = container.value?.clientHeight || 0;
  const blankTop = blank.value?.getBoundingClientRect().top || 0;
  if (blankTop <= clientHeight) {
    page.value++;
  }
  console.log(
    "handleScorll" +
      page.value +
      "clientHeight:" +
      clientHeight +
      "blankTop:" +
      blankTop
  );
};
onMounted(async () => {
  const res = await getList();
  list.value = res;
});

const getList = () => {
  return new Promise((resolve, reject) => {
    let list: {}[] = [];
    let num = 0;
    for (let i = 0; i < 100000; i++) {
      num++;
      list.push({
        tid: num,
        src: "https://p3-passport.byteimg.com/img/user-avatar/c2b1804b60fb058877c763a19ca3297d~100x100.awebp",
        title: `第${num}条`,
      });
    }

    resolve(list);
  });
};
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}
#container {
  height: 100vh;
  overflow: auto;
}
.sunshine {
  display: flex;
  padding: 10px;
}
img {
  width: 150px;
  height: 150px;
}
</style>
