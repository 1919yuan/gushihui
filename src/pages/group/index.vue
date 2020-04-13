<template>
  <div class="content">
    <h2> {{ $t('group.all') }} </h2>
    <div class="columns is-mobile">
      <GroupCard v-for="(group, idx) in groups" :key="idx" :group="group" />
    </div>
  </div>
</template>

<script>
import GroupCard from "~/components/card/Group.vue";
export default {
  layout: "article",
  components: {
    GroupCard
  },
  async asyncData ({ app }) {
    try {
      const groups = await app.$api.listGroups();
      return { groups };
    } catch {
      return { groups: [] };
    }
  }
};
</script>
