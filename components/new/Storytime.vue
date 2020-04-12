<template>
  <div class="block">
    <b-steps v-model="step" @input="emit">
      <b-step-item :label="$t('storytime.step1')">
        <b-field :label="$t('field.group_name')">
          <b-select v-model="selectedGroup" @input="doSelectGroup">
            <option v-for="(group, idx) in myGroups" :key="idx" :value="group">
              {{ group.Title }}
            </option>
          </b-select>
        </b-field>
        <b-notification :active.sync="isEmptyGroup" type="is-warning">
          {{ $t('storytime.emptygroup') }} <nuxt-link :to="{ path: '/new/group' }">
            {{ $t('nav.group') }} > {{ $t('nav.newgroup') }}
          </nuxt-link>
        </b-notification>
      </b-step-item>
      <b-step-item :label="$t('storytime.step2')">
        <EventVenues
          ref="venuesStep"
          v-model="storytime"
          :prefilled-venues="prefilledVenues"
          :prefilled-online-venues="prefilledOnlineVenues"
          @input="resetVenues"
        />
      </b-step-item>
      <b-step-item :label="$t('storytime.step3')">
        <EventOptions
          ref="optionsStep"
          v-model="storytime"
          @input="resetOptions"
        />
      </b-step-item>
      <b-step-item :label="$t('storytime.step4')">
        <EventAgenda
          ref="agendaStep"
          v-model="storytime"
          :group="targetGroup"
          @input="resetAgenda"
        />
      </b-step-item>
      <b-step-item :label="$t('storytime.step5')">
        <StorytimeOptions v-model="storytime.Storytime" />
      </b-step-item>
    </b-steps>
  </div>
</template>

<script>
import { mapState } from "vuex";
import EventVenues from "~/components/new/EventVenues";
import EventOptions from "~/components/new/EventOptions";
import EventAgenda from "~/components/new/EventAgenda";
import StorytimeOptions from "~/components/new/StorytimeOptions";
import { kNullStorytimeEvent } from "~/schema";
import { kNullGroup } from "~/schema/group";
export default {
  components: {
    EventAgenda,
    EventVenues,
    EventOptions,
    StorytimeOptions
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          storytime: kNullStorytimeEvent,
          step: 0
        };
      }
    },
    myGroups: {
      type: Array,
      default: () => ([])
    },
    prefilledVenues: {
      type: Array,
      default: () => ([])
    },
    prefilledOnlineVenues: {
      type: Array,
      default: () => ([])
    },
    targetGroup: {
      type: Object,
      default: kNullGroup
    }
  },
  data () {
    return {
      selectedGroup: this.$schema.kNullGroup,
      isEmptyGroup: this.myGroups.length === 0,
      storytime: this.value.storytime,
      step: this.value.step
    };
  },
  computed: {
    ...mapState({
      authUser: state => state.account.authUser
    })
  },
  watch: {
    step (newVal, oldVal) {
      if (oldVal > 0 && newVal === 0 &&
          (this.selectedGroup !== this.$schema.kNullGroup ||
           this.$route.query.groupId !== "")) {
        this.$buefy.dialog.confirm({
          message: this.$t("storytime.step0_confirm"),
          onConfirm: () => {
            this.$router.replace({ path: "/new/storytime" },
              () => {
                this.$router.go();
              });
          }
        });
      }
      if (oldVal === 0 && newVal > 0 && this.selectedGroup === this.$schema.kNullGroup) {
        this.$buefy.dialog.alert(this.$t("storytime.step1_confirm"));
      }
    }
  },
  mounted () {
    if (this.myGroups.length === 1 && !this.$route.query.groupId) {
      this.$router.replace({
        path: "/new/storytime?groupId=" + this.myGroups[0].Id
      },
      () => {
        this.$router.go();
      });
    }
  },
  methods: {
    emit () {
      if (this.targetGroup === this.$schema.kNullGroup) {
        return;
      }
      this.storytime.EditorId = this.authUser.Id;
      this.storytime.GroupId = this.selectedGroup.Id || this.targetGroup.Id || "";
      this.$emit("input", {
        step: this.step,
        storytime: this.storytime
      });
    },
    resetVenues (val) {
      this.storytime.Venues = val.Venues;
      this.storytime.OnlineVenues = val.OnlineVenues;
      this.$refs.optionsStep.reset(this.storytime);
      this.$refs.agendaStep.reset(this.storytime);
      this.emit();
    },
    resetOptions (val) {
      this.storytime.Options = val.Options;
      this.$refs.venuesStep.reset(this.storytime);
      this.$refs.agendaStep.reset(this.storytime);
      this.emit();
    },
    resetAgenda (val) {
      this.storytime.Name = val.Name;
      this.storytime.Agenda = val.Agenda;
      this.$refs.venuesStep.reset(this.storytime);
      this.$refs.optionsStep.reset(this.storytime);
      this.emit();
    },
    doSelectGroup () {
      this.$router.replace({
        path: "/new/storytime?groupId=" + this.selectedGroup.Id
      },
      () => {
        this.$router.go();
      });
    }
  }
};
</script>
