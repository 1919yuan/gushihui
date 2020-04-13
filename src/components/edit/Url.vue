<template>
  <ValidationObserver ref="urlForm">
    <ValidationProvider
      v-slot="{errors, valid}"
      tag="div"
      class="field"
      :name="$t('field.url')"
      rules="url"
    >
      <b-field :message="errors[0]" :type="{ 'is-danger': !valid && url }">
        <b-input v-model="url" :placeholder="$t('ph.url')" @input="emit" />
      </b-field>
    </ValidationProvider>
  </ValidationObserver>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data: () => ({ url: "" }),
  methods: {
    async emit () {
      const success = await this.$refs.urlForm.validate();
      if (success) {
        this.$emit("input", this.url);
      }
    },
    reset (val) {
      this.url = val;
    }
  }
};
</script>
