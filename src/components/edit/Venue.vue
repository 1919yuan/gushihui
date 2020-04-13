<template>
  <div class="block">
    <b-field :label="$t('field.name')">
      <b-field>
        <b-input v-model="venue.Name" expanded @input="emit" />
        <p class="control">
          <b-button outlined type="is-success" @click="doSave">
            {{ $t('venue.save') }}
          </b-button>
        </p>
      </b-field>
    </b-field>
    <b-field>
      <Address v-model="venue.Address" @input="emit" />
    </b-field>
    <b-field :label="$t('field.phone')">
      <Phone v-model="venue.Phone" @input="emit" />
    </b-field>
    <b-field :label="$t('field.capacity')">
      <b-numberinput v-model="venue.Capacity" @input="emit" />
    </b-field>
    <b-field :label="$t('field.url')">
      <Url v-model="venue.Url" @input="emit" />
    </b-field>
    <b-field :label="$t('field.description')">
      <b-input v-model="venue.Description" type="textarea" @input="emit" />
    </b-field>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { kNullVenue } from "~/schema";
import Address from "~/components/edit/Address";
import Phone from "~/components/edit/Phone";
import Url from "~/components/edit/Url";
export default {
  components: {
    Address,
    Phone,
    Url
  },
  props: {
    value: {
      type: Object,
      default: () => (kNullVenue)
    }
  },
  data () {
    return {
      venue: _.cloneDeep(this.value)
    };
  },
  computed: {
    ...mapState({
      authUser: state => state.account.authUser
    })
  },
  methods: {
    emit () {
      this.$emit("input", this.venue);
    },
    async doSave () {
      this.venue.EditorId = this.authUser.Id;
      if (this.$route.query.groupId) {
        this.venue.GroupId = this.$route.query.groupId;
        this.venue.UserId = "";
      } else {
        this.venue.GroupId = "";
        this.venue.UserId = this.authUser.Id;
      }
      await this.$api.saveVenue(this.venue);
      this.$buefy.toast.open({
        message: "Venue saved, next time you can use this venue to prefill "+
                   "an event.",
        type: "is-success"
      });
    }
  }
};
</script>
