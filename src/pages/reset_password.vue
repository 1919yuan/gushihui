<template>
  <div class="container">
    <h3 class="title has-text-centered">
      {{ $t('account.resetpassword') }}
    </h3>
    <div class="box">
      <div class="block">
        <ValidationObserver ref="reset_form">
          <ValidationProvider
            v-slot="{ errors, valid }"
            tag="div"
            class="field"
            :name="$t('field.email_or_username')"
            rules="required|email_or_username"
          >
            <b-field
              :label="$t('field.email_or_username')"
              :type="{ 'is-danger': !valid && email_or_username }"
              :message="errors[0]"
            >
              <b-input
                v-model="email_or_username"
                :placeholder="$t('ph.email_or_username')"
                @keyup.native.enter="doResetPassword"
              />
            </b-field>
          </ValidationProvider>
        </ValidationObserver>
      </div>
      <div class="block">
        <b-button class="is-block is-info is-fullwidth" @click="doResetPassword">
          {{ $t('account.reset') }}
        </b-button>
      </div>
    </div>
    <p class="has-text-grey has-text-centered">
      <nuxt-link to="/login">
        {{ $t('account.login') }}
      </nuxt-link> &nbsp;·&nbsp;
      <nuxt-link to="/signup">
        {{ $t('account.signup') }}
      </nuxt-link>
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    email_or_username: ""
  }),
  methods: {
    async doResetPassword () {
      const success = await this.$refs.reset_form.validate();
      if (success) {
        let email = this.email_or_username;
        if (!email.includes("@")) {
          try {
            const result = await this.$api.getUserWithUsername(email);
            if (result !== this.$schema.kNullUser) {
              email = result.Uid;
              if (result.Provider !== "password") {
                this.$buefy.toast.open({
                  message: this.$t("account.resetcheck", {
                    provider: result.Provider
                  }),
                  type: "is-warning"
                });
              }
              return;
            }
          } catch (err) {
            email = "";
          }
        }
        const self = this;
        this.$buefy.dialog.confirm({
          message: this.$t("account.resetconfirm"),
          onConfirm: () => {
            self.$fireAuth
              .sendPasswordResetEmail(email)
              .then(() => {
                self.$buefy.toast.open({
                  message: self.$t("account.resetsent", { email }),
                  type: "is-success"
                });
              })
              .catch(function (err) {
                self.$buefy.toast.open({
                  message: self.$util.firebaseError(err.code),
                  type: "is-danger"
                });
              });
          }
        });
      }
    }
  }
};
</script>
