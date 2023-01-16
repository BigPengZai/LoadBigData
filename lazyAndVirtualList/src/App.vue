<template>
  <!-- <LazyList /> -->
  <!-- <VirtualList :list-data="d" :item-size="100" /> -->
  <DynamicVirtualList
    :list-data="d"
    :estimate-item-size="200"
    :buffer-page="1"
    v-slot="slotProps"
  >
    <Item :item="slotProps.item" />
  </DynamicVirtualList>
</template>

<script setup lang="ts">
import LazyList from "./components/LazyList.vue";
import VirtualList from "./components/VirtualList.vue";
import DynamicVirtualList from "./components/DynamicVirtualList.vue";
import Item from "./components/Item.vue";
import { faker } from "@faker-js/faker";
interface Item {
  tid: number;
  name: string;
  value: string;
}

let d: Array<Item> = [];
for (let i = 0; i < 1000; i++) {
  d.push({
    tid: i,
    name: "peyton-" + faker.random.locale(),
    value: faker.lorem.sentences(),
  });
}
</script>
<style>
* {
  padding: 0;
  margin: 0;
}
html {
  height: 100%;
}
body {
  height: 100%;
  margin: 0;
}
#app {
  width: 100%;
  height: 100%;
}
</style>
