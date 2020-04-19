<template>
  <div class="container">
    <h3 class="title has-text-centered">
      {{ $t('group.create') }}
    </h3>
    <div class="box">
      <NewGroup v-model="newgroup" />
      <div v-show="showSubmit" class="block">
        <b-button class="is-block is-info is-fullwidth" @click="doCreateGroup">
          {{ $t('button.submit') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { kNullGroup } from "~/schema";
import NewGroup from "~/components/new/Group.vue";
export default {
  components: {
    NewGroup
  },
  middleware: "auth",
  data () {
    const g = _.cloneDeep(kNullGroup);
    g.Owners.push(this.$store.state.account.authUser.Username);
    return {
      newgroup: {
        group: g,
        step: 0,
        valid: false
      }
    };
  },
  computed: {
    showSubmit () {
      return ((this.newgroup.step === 1 || this.newgroup.step === 2) &&
              this.newgroup.valid);
    }
  },
  methods: {
    async doCreateGroup () {
      const existingGroup = await this.$api.getGroup(this.newgroup.group.Id);
      if (existingGroup !== this.$schema.kNullGroup) {
        this.$buefy.toast.open({
          message: this.$t("group.occupied"),
          type: "is-danger"
        });
        return;
      }
      await this.$api.createGroup(this.newgroup.group);
      const newAuthUser = _.cloneDeep(this.$store.state.account.authUser);
      if (!newAuthUser.OwnerGroups) {
        newAuthUser.OwnerGroups = [this.newgroup.group.Id];
      } else {
        newAuthUser.OwnerGroups.push(this.newgroup.group.Id);
      }
      this.$store.commit("SET_AUTH_USER", newAuthUser);
      this.$router.push("/group/" + this.newgroup.group.Id);
    }
  }
};
</script>
