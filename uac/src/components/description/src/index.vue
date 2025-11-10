<script setup lang="ts" name="Descriptions">
import type { DescriptionProps } from "./types";
import { User } from "@element-plus/icons-vue";
import { useNamespace } from "teek";

const ns = useNamespace("descriptions");

// 接受父组件参数，配置默认值
withDefaults(defineProps<DescriptionProps>(), {
  title: "",
});
</script>

<template>
  <div :class="`${ns.b()} flx-justify-start`">
    <slot name="avatar">
      <el-avatar :class="ns.e('head-icon')" :icon="User" />
    </slot>
    <div :class="`${ns.e('box')} flex-1`">
      <div class="flx-justify-between">
        <span :class="ns.em('box', 'title')">{{ title }}</span>
        <slot name="extra"></slot>
      </div>
      <el-row v-if="data?.length" :class="`${ns.e('content')} flx-align-center`">
        <el-col v-for="(item, index) in data" :key="index" :span="item.span || 3" :class="ns.em('content', 'item')">
          <slot>
            <div :class="ns.em('content', 'label')">{{ item.label }}</div>
            <div :class="ns.em('content', 'value')">{{ item.value }}</div>
          </slot>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@teek/styles/mixins/bem" as *;

@include b(descriptions) {
  margin: 12px 0;

  @include e(head-icon) {
    margin-right: 12px;
  }

  @include e(box) {
    @include m(title) {
      font-size: 16px;
      font-weight: 600;
      color: #191919;
    }
  }

  @include e(content) {
    flex-wrap: wrap;
    min-height: 28px;

    @include m(item) {
      display: flex;
    }

    @include m(label) {
      margin-right: 12px;
      font-size: 12px;
      color: #676767;
    }

    @include m(value) {
      font-size: 12px;
      color: #191919;
    }
  }
}
</style>
