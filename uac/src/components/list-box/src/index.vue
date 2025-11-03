<script setup lang="ts">
import { type ComponentPublicInstance, ref } from "vue";
import List from "./index.vue";
import { useNamespace } from "teek";

defineOptions({ name: "ListBox" });

const ns = useNamespace("list-box");

export type ListInstance = Omit<InstanceType<typeof List>, keyof ComponentPublicInstance | keyof ListProps>;

export interface ListProps {
  data: any;
  label?: string;
  value?: string;
}

withDefaults(defineProps<ListProps>(), {
  label: "label",
  value: "value",
});

const isActive = ref("");

const changeClass = (value: string) => {
  isActive.value = value;
};
</script>

<template>
  <ul :class="ns.b()">
    <li
      v-for="item in data"
      :key="item[value]"
      :class="[ns.e('item'), { 'is-active': isActive === item[value] }]"
      @click="changeClass(item[value])"
    >
      <div class="flx-justify-between">
        <div>
          <slot name="default" v-bind="item">
            <span>{{ item[label] }}</span>
          </slot>
        </div>
        <div v-if="$slots.extra" class="extra-button">
          <slot name="extra" v-bind="item"></slot>
        </div>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@use "@teek/styles/mixins/bem" as *;

@include b(list-box) {
  box-sizing: border-box;
  padding-left: 0;
  margin: 0;
  list-style: none;
  border-right: solid 1px #ffffff;

  @include e(item) {
    box-sizing: border-box;
    height: 32px;
    padding: 0 20px;
    padding-left: 400;
    font-size: 14px;
    line-height: 32px;
    color: #303133;
    white-space: nowrap;
    cursor: pointer;
    list-style: none;
    transition:
      background-color 0.3s,
      color 0.3s;

    &:hover {
      background-color: #e8f3fe;

      .extra-button {
        display: block;
      }
    }

    .extra-button {
      display: none;
      margin-right: -15px;
    }

    &.is-active {
      color: #168bf7;
    }
  }
}
</style>
