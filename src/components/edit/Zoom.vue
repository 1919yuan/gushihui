<template>
  <div class="container">
    <b-field grouped group-multiline>
      <ValidationProvider
        v-slot="{ errors, valid }"
        tag="div"
        class="field"
        :name="$t('zoom.id')"
        rules="required|min:9|numeric"
      >
        <b-field
          :type="{ 'is-danger': !valid && obj.MeetingId }"
          :message="errors[0]"
        >
          <b-input
            v-model="obj.MeetingId"
            :placeholder="$t('zoom.id')"
            :maxlength="10"
            @input="emit"
          />
        </b-field>
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors, valid }"
        tag="div"
        class="field"
        :name="$t('field.password')"
        rules="required|max:16"
      >
        <b-field
          :type="{ 'is-danger': !valid && obj.MeetingId }"
          :message="errors[0]"
        >
          <b-input
            v-model="obj.Password"
            :placeholder="$t('zoom.password_ph')"
            :maxlength="16"
            type="password"
            password-reveal
            @input="emit"
          />
        </b-field>
      </ValidationProvider>
    </b-field>
    <b-field :label="$t('field.url')">
      <Url ref="url" v-model="obj.JoinUrl" @input="setUrlTouched" />
    </b-field>
  </div>
</template>

<script>
import { kNullZoom } from "~/schema";
import Url from "~/components/edit/Url";
export default {
  components: {
    Url
  },
  props: {
    value: {
      type: Object,
      default: () => (kNullZoom)
    }
  },
  data () {
    const obj = this.value || kNullZoom;
    return {
      obj: _.cloneDeep(obj),
      urlTouched: false
    };
  },
  watch: {
    obj: {
      deep: true,
      handler (val) {
        if (val.MeetingId) {
          if (!this.urlTouched) {
            this.obj.JoinUrl = "https://zoom.us/j/" + val.MeetingId;
            this.$refs.url.reset(this.obj.JoinUrl);
          }
        }
      }
    }
  },
  mounted () {
    this.$refs.url.reset(this.obj.JoinUrl);
  },
  methods: {
    emit () {
      this.$emit("input", this.obj);
    },
    setUrlTouched () {
      this.urlTouched = true;
      this.emit();
    }
  }
};
</script>
