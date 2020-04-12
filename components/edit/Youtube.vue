<template>
  <b-field :label="$t('field.url')">
    <Url v-model="obj.JoinUrl" @input="emit" />
  </b-field>
</template>

<script>
import { kNullYoutube } from "~/schema";
import Url from "~/components/edit/Url";
export default {
  components: {
    Url
  },
  props: {
    value: {
      type: Object,
      default: () => (kNullYoutube)
    }
  },
  data () {
    const obj = this.value || kNullYoutube;
    return {
      obj: _.cloneDeep(obj)
    };
  },
  methods: {
    emit () {
      this.$emit("input", this.obj);
    }
  }
};
</script>
