<template>
  <div class="container">
    <h3 class="title has-text-centered">
      {{ $t('account.choose_username') }}
    </h3>
    <div class="box">
      <div class="block">
        <ValidationObserver ref="username_form">
          <ValidationProvider
            v-slot="{ errors, valid }"
            tag="div"
            class="field"
            :name="$t('field.username')"
            rules="required|username"
          >
            <b-field
              :label="$t('field.username')"
              :type="{ 'is-danger': !valid && username }"
              :message="errors[0]"
            >
              <b-input
                v-model="username"
                :placeholder="$t('ph.username')"
                @keyup.native.enter="doAddUsername"
              />
            </b-field>
          </ValidationProvider>
        </ValidationObserver>
      </div>
      <div class="block">
        <b-button class="is-block is-info is-fullwidth" @click="doAddUsername">
          {{ $t('button.submit') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from "lodash";
import { mapGetters, mapState } from "vuex";
export default {
  data: () => ({
    username: ""
  }),
  computed: {
    ...mapGetters("account", ["isLoggedIn"]),
    ...mapState("account", ["authUser"])
  },
  mounted () {
    if (!this.isLoggedIn) {
      this.$router.push({ path: "/" });
    }
  },
  methods: {
    async doAddUsername () {
      const success = await this.$refs.username_form.validate();
      if (success) {
        try {
          const result = await this.$api.getUserWithUsername(this.username);

          if (result !== this.$schema.kNullUser) {
            this.$buefy.toast.open({
              message: this.$t("account.username_occupied"),
              type: "is-warning"
            });
          } else {
            const newUser = cloneDeep(this.authUser);
            newUser.Username = this.username;
            this.$api.setUser(newUser);
            this.$store.commit("account/SET_AUTH_USER", newUser);
          }
        } catch { }
      }
    }
  }
};
</script>
