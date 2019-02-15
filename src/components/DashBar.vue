<template>
  <div class="dashbar">
    <ul>
      <li>
        <router-link :to="'/'">
          <i class="glyphicon glyphicon-user"></i> Name
        </router-link>
      </li>
      <li>
        <span v-on:click="$emit('logout')"><i class="glyphicon glyphicon-log-out"></i></span>
      </li>
    </ul>
  </div>
</template>

<script type="text/javascript">

export default {
  created () {
  }
}

</script>
