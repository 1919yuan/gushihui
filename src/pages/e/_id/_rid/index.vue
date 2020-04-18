<template>
  <div class="content">
    <h2> {{ event.Name }} - {{ $t('event.rsvp') }} </h2>
    <p v-for="(cat, idx) in event.Options.CategoryNames" :key="idx">
      {{ cat }}: {{ record.Counts[idx] }}
    </p>
    <p v-if="!event.Options.Categorize">
      {{ $t('event.count') }}: {{ record.Count }}
    </p>
    <h3> {{ $t('field.note') }} </h3>
    <p> {{ record.Note }} </p>
    <b-notification v-if="isOwner">
      <b-field>
        <span class="button-aligned">
          Warning: you are the person who rsvp'ed to this event and you can
          delete it:
        </span>
        <b-button type="is-danger" @click="doDelete">
          <b-icon icon="delete" />
        </b-button>
      </b-field>
    </b-notification>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  async asyncData ({ app, params }) {
    const eid = params.id;
    const rid = params.rid;
    const event = await app.$api.getEvent(eid);
    const record = await app.$api.getRecord(eid, rid);
    return { event, record };
  },
  computed: {
    ...mapState({
      authUser: state => state.account.authUser
    }),
    isOwner () {
      return (this.authUser.Id === this.record.UserId ||
              this.authUser.Id === this.record.EventUserId ||
              this.authUser.Id === this.event.EditorId);
    }
  },
  methods: {
    doDelete () {
      this.$buefy.dialog.confirm({
        message: this.$t("button.areyousure"),
        onConfirm: () => {
          this.$api.delRecord(this.event.Id, this.record.Id).then(() => {
            this.$buefy.toast.open({
              message: "Deleted!",
              type: "is-success"
            });
            this.$router.replace({ path: "/" }).then((_) => {
              this.$router.go();
            });
          });
        }
      });
    }
  }
};
</script>
