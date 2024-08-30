import { computed } from 'vue';
import { reactive } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import type {SelectOptionData} from "@arco-design/web-vue/es/select/interface";

export const typeOptions = computed<SelectOptionData[]>(() => [
  {
    label: "风电",
    value: 1,
  },
  {
    label: "光伏",
    value: 2,
  },
  {
    label: "储能",
    value: 3,
  },
]);

export const typeMap = new Map([
  [1, "风电"],
  [2, "光伏"],
  [3, "储能"],
]);

export const starOptions = computed<SelectOptionData[]>(() => [
  {
    label: "一星",
    value: 1,
  },
  {
    label: "二星",
    value: 2,
  },
  {
    label: "三星",
    value: 3,
  },
]);

export const starMap = new Map([
  [1, "一星"],
  [2, "二星"],
  [3, "三星"],
]);

//状态
export const statusOptions = computed<SelectOptionData[]>(() => [
  {
    label: "全部",
    value: 0,
  },
  {
    label: "正常",
    value: 1,
  },
  {
    label: "禁用",
    value: 2,
  },
]);

export const statusMap = new Map([
  [0, "全部"],
  [1, "正常"],
  [2, "禁用"],
]);

//属性
export const attrOptions = computed<SelectOptionData[]>(() => [
  {
    label: "集中式",
    value: 1,
  },
  {
    label: "分布式",
    value: 2,
  },
  {
    label: "分散式",
    value: 3,
  },
]);

export const attrMap = new Map([
  [1, "集中式"],
  [2, "分布式"],
  [3, "分散式"],
]);

// 1-待定，2-推荐，3-终止，4-已完成
export const stateOptions = computed<SelectOptionData[]>(() => [
  {
    label: "待定",
    value: 1,
  },
  {
    label: "进行中",
    value: 2,
  },
  {
    label: "已完成",
    value: 3,
  },
  {
    label: "中止",
    value: 4,
  },
]);

export const stateMap = new Map([
  [1, "待定"],
  [2, "进行中"],
  [3, "已完成"],
  [4, "中止"],
]);


export const contactTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: "同行公司",
    value: 1,
  },
  {
    label: "分包方",
    value: 2,
  },
  {
    label: "总包方",
    value: 3,
  },
  {
    label: "小E",
    value: 4,
  },
  {
    label: "劳务",
    value: 5,
  },
  {
    label: "政府单位",
    value: 6,
  },
  {
    label: "资源方",
    value: 7,
  },
]);

export const contactTypeMap = new Map([
  [1, "同行公司"],
  [2, "分包方"],
  [3, "总包方"],
  [4, "小E"],
  [5, "劳务"],
  [6, "政府单位"],
  [7, "资源方"],
]);

export const personTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: "第一负责人",
    value: 1,
  },
  {
    label: "第二负责人",
    value: 2,
  },
  {
    label: "普通成员",
    value: 3,
  },
]);

export const personTypeMap = new Map([
  [1, "第一负责人"],
  [2, "第二负责人"],
  [3, "普通成员"],
]);

export const recordStateOptions =computed<SelectOptionData[]>(() => [
  {
    label: "已完成",
    value: 1,
  },
  {
    label: "进行中",
    value: 2,
  },
]);

export const recordStateMap = new Map([
  [1, "已完成"],
  [2, "进行中"],
]);
