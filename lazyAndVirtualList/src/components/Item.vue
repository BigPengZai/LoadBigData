<template>
  <div>
    <p>
      <span style="color: red; margin-right: 10px">{{ item.tid }}</span>
      <span style="color: chocolate; margin-right: 10px">{{ item.name }}</span>
      <span style="color: gray">{{ item.value }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, onMounted } from "vue";

interface Props {
  item: { tid: number; name: string; value: string };
}

const props = withDefaults(defineProps<Props>(), {
  item: () => ({ tid: 0, name: "", value: "" }),
});
// const { item } = props;
onMounted(() => {
  //   console.log(props.item, 11111111);
});
</script>

<style scoped></style>
