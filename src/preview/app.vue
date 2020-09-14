<template>
  <div>
    <el-table border :data="tableData" style="width: 90%;margin:10px">
      <el-table-column width="150" label="线路名称">
        <template slot-scope="scope">第{{scope.$index + 1}}条线路</template>
      </el-table-column>
      <el-table-column label="路线" min-width="600">
        <template slot-scope="scope">{{scope.row.paths.join(' => ')}}</template>
      </el-table-column>
      <el-table-column label="线路里程(公里)" width="180">
        <template slot-scope="scope">{{(scope.row.dis / 1000).toFixed(1)}}公里</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "component_name",
  data() {
    return {
      tableData: [],
    };
  },
  methods: {
    setTableData(data) {
      this.tableData = data;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
