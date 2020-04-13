<template>
  <b-field :label="$t('field.url')">
    <Url v-model="obj.JoinUrl" @input="emit" />
  </b-field>
</template>

<script>
import { kNullHangout } from "~/schema";
import Url from "~/components/edit/Url";
export default {
  components: {
    Url
  },
  props: {
    value: {
      type: Object,
      default: () => (kNullHangout)
    }
  },
  data () {
    const obj = this.value || kNullHangout;
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
