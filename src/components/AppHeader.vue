<template functional>
  <header class="app-header">
    <h1 class="app-header__text">World Weather</h1>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style lang="scss">
.app-header {
  margin-top: 24px;
  margin-bottom: 32px;

  @include container();

  &__text {
    margin: 0;
    font-size: 70px;
    font-style: normal;
    font-weight: 300;
    line-height: 80px;
  }
}
</style>
