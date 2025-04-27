<template>
    <el-breadcrumb separator="/">
        <!-- <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item> -->
        <el-breadcrumb-item v-for="(item, index) in path" :key="index">
          {{ item }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  name: 'ModelPath',
  props: ['path'],
  data() {
    return {
      // path: ['No Model']
    }
  },
  methods: {
    
  }
}
</script>