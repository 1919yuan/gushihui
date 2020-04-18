<template>
  <div class="content">
    <h2>
      {{ $t('profile.events') }}
    </h2>
    <p v-for="(e, idx1) in events" :key="'e' + idx1">
      <a :href="`/e/${e.Id}`">{{ e.Name }}</a>
    </p>
    <h2>
      {{ $t('profile.groups') }}
    </h2>
    <p v-for="(g, idx2) in groups" :key="'g' + idx2">
      <a :href="`/g/${g.Id}`">{{ g.Title }}</a>
    </p>
    <h2 v-show="$route.params.id == $store.state.account.authUser.Username">
      {{ $t('profile.records') }}
    </h2>
    <p v-for="(r, idx3) in records" :key="'r' + idx3">
      <a :href="`/e/${r.EventId}/${r.Id}`">{{ $util.formatLocalTime(r.Created) }}</a>
    </p>
  </div>
</template>

<script>
export default {
  async asyncData ({ app, params, store }) {
    const userName = params.id;
    const user = await app.$api.getUserWithUsername(userName);
    const userId = user.Id;
    if (!userId) {
      return { events: [], groups: [], records: [] };
    }
    const events = [];
    const today = new Date();
    const beginDate = app.$util.daysOut(today, -30);
    const endDate = app.$util.daysOut(today, 60);
    const userEvents = await app.$api.searchEvent("", "", userId, beginDate,
      endDate);
    const groups = [];
    for (let i = 0; i < userEvents.length; i++) {
      events.push(userEvents[i]);
    }
    if (user.OwnerGroups) {
      for (let i = 0; i < user.OwnerGroups.length; i++) {
        const groupId = user.OwnerGroups[i];
        groups.push(await app.$api.getGroup(groupId));
        const groupEvents = await app.$api.searchEvent("", groupId, "", beginDate,
          endDate);
        for (let j = 0; j < groupEvents.length; j++) {
          events.push(groupEvents[i]);
        }
      }
    }
    if (user.ManagerGroups) {
      for (let i = 0; i < user.ManagerGroups.length; i++) {
        const groupId = user.ManagerGroups[i];
        groups.push(await app.$api.getGroup(groupId));
        const groupEvents = await app.$api.searchEvent("", groupId, "", beginDate,
          endDate);
        for (let j = 0; j < groupEvents.length; j++) {
          events.push(groupEvents[i]);
        }
      }
    }
    const records = [];
    if (store.state.account.authUser.Id === userId) {
      const userRecords = await app.$api.searchRecord("", userId, "", "", "",
        beginDate, endDate);
      for (let i = 0; i < userRecords.length; i++) {
        records.push(userRecords[i]);
      }
    }
    return { events, groups, records };
  }
};
</script>
