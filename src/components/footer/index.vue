<template>
  <a-layout-footer class="footer">
     <span>{{ Address }} &amp; <a href="//goflys.cn/" target="_blank">{{ Team }} </a> </span>
     <span class="copyright"> ⓒ Copyright {{Company}} 2018-{{nowyear}}</span>
    </a-layout-footer>
</template>

<script lang="ts" setup>
 //获取网站配置-应用名称
 const Address = window?.globalConfig.Address
 const Team = window?.globalConfig.Team
 const Company = window?.globalConfig.Company
 const nowyear = new Date().getFullYear()
</script>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background-color: var(--color-fill-1);
    color: var(--color-text-2);
    text-align: center;
    a{
        color: #1890ff;
        text-decoration: none;
        background-color: transparent;
        outline: none;
        cursor: pointer;
        transition: color 0.3s;
    }
    .copyright{
      padding-left: 3px;
    }
  }
</style>
