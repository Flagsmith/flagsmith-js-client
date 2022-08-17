<template>
  <div>
    <pre>{{ $flagsmith.getAllFlags('hero') }}</pre>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage'
})
</script>
