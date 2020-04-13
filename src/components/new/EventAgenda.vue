<template>
  <client-only>
    <div class="container">
      <h3> {{ $t('event.agenda') }} </h3>
      <b-field :label="$t('field.title')">
        <b-input v-model="storytime.Name" @input="emit" />
      </b-field>
      <div class="mavonEditor">
        <client-only>
          <mavon-editor v-model="storytime.Agenda" @save="emit" />
        </client-only>
      </div>
    </div>
  </client-only>
</template>

<script>
import { kNullStorytimeEvent, kNullGroup } from "~/schema";

export default {
  props: {
    value: {
      type: Object,
      default: () => (kNullStorytimeEvent)
    },
    group: {
      type: Object,
      default: kNullGroup
    }
  },
  data () {
    return {
      storytime: _.cloneDeep(this.value)
    };
  },
  methods: {
    emit () {
      this.storytime.Name = this.title;
      this.$emit("input", this.storytime);
    },
    reset (val) {
      this.storytime = _.cloneDeep(val);
    }
  }
};
</script>
