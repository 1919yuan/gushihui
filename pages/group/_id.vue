<template>
  <div class="content">
    <h3> {{ pageTitle }} </h3>
    <div class="block">
      <div class="box">
        <b-field :label="$t('field.title')" horizontal>
          <b-input v-model="title" />
        </b-field>
        <b-field :label="$t('field.description')" horizontal>
          <b-input v-model="description" type="textarea" />
        </b-field>
        <b-field :label="$t('field.thumbnail')" horizontal>
          <b-input v-model="thumbnailUrl" />
        </b-field>
        <b-field horizontal>
          <p class="control">
            <b-button type="is-primary" expanded @click="doSaveGroup">
              {{ $t('button.save') }}
            </b-button>
          </p>
        </b-field>
      </div>
      <ValidationObserver ref="add_form">
        <b-field
          :message="emailOrUsernameInputMessage"
          :type="emailOrUsernameInputType"
        >
          <div class="field-body">
            <b-field>
              <b-select v-model="addRole" placeholder="role">
                <option value="owner">
                  owner
                </option>
                <option value="manager">
                  manager
                </option>
                <option value="member">
                  member
                </option>
              </b-select>
              <ValidationProvider
                ref="emailOrUsernameInput"
                tag="div"
                class="control is-expanded"
                :name="$t('field.email_or_username')"
                rules="required|email_or_username"
              >
                <b-input
                  v-model="emailOrUsername"
                  :placeholder="$t('ph.a_email_or_username')"
                  expanded
                />
              </ValidationProvider>
              <p class="control">
                <b-button class="is-success" @click="doAdd">
                  {{ $t('button.add') }}
                </b-button>
              </p>
            </b-field>
          </div>
        </b-field>
      </ValidationObserver>
    </div>
    <b-table
      :data="tableData"
      :striped="true"
      :hoverable="true"
      :mobile-cards="true"
    >
      <template slot-scope="props">
        <b-table-column
          field="index"
          label="ID"
          numeric
        >
          {{ props.row.index }}
        </b-table-column>
        <b-table-column
          field="username"
          label="Username"
        >
          {{
            props.row.username
          }}
        </b-table-column>
        <b-table-column
          field="role"
          label="Role"
        >
          {{
            props.row.role
          }}
        </b-table-column>
        <b-table-column
          v-if="isOwner"
          label="Delete"
        >
          <b-button
            type="is-danger"
            :disabled="disableButton(props.row)"
            @click="doDelete(props.row.id, props.row.role)"
          >
            <b-icon icon="delete" />
          </b-button>
        </b-table-column>
      </template>
      <template slot="empty">
        <p class="content">
          Data error...
        </p>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  middleware: "auth",
  layout: "article",
  async asyncData ({ app, params }) {
    try {
      const groupOfIds = await app.$api.getGroup(params.id);
      const groupOfUsernames = await app.$api.getGroupOfUsernames(groupOfIds);
      const groupOfEmails = await app.$api.getGroupOfEmails(groupOfIds);
      return { groupOfIds, groupOfUsernames, groupOfEmails };
    } catch {
    }
  },
  data: () => ({
    emailOrUsername: "",
    addRole: null,
    isMounted: false,
    title: "",
    description: "",
    thumbnailUrl: ""
  }),
  computed: {
    ...mapState({
      authUser: state => state.account.authUser
    }),
    emailOrUsernameInputMessage () {
      if (!this.isMounted) { return ""; }
      if (this.$refs.emailOrUsernameInput.errors.length > 0) {
        return this.$refs.emailOrUsernameInput.errors[0];
      } else {
        return "";
      }
    },
    emailOrUsernameInputType () {
      if (!this.isMounted) { return ""; }
      if (!this.$refs.emailOrUsernameInput.valid && this.emailOrUsername) {
        return { "is-danger": true };
      } else {
        return {};
      }
    },
    isOwner () {
      const ownerGroups = this.$store.state.account.authUser.OwnerGroups;
      return (ownerGroups && ownerGroups.includes(this.$route.params.id));
    },
    pageTitle () {
      const ownerGroups = this.$store.state.account.authUser.OwnerGroups;
      if (ownerGroups && ownerGroups.includes(this.$route.params.id)) {
        return this.$t("group.manage", { id: this.$route.params.id });
      } else {
        return this.$t("group.view", { id: this.$route.params.id });
      }
    },
    tableData () {
      const data = [];
      let idx = 0;
      for (let i = 0; i < this.groupOfIds.Owners.length; i++) {
        data.push({
          index: idx,
          username: this.groupOfUsernames.Owners[i],
          role: "owner",
          id: this.groupOfIds.Owners[i]
        });
        idx++;
      }
      for (let i = 0; i < this.groupOfIds.Managers.length; i++) {
        data.push({
          index: idx,
          username: this.groupOfUsernames.Managers[i],
          role: "manager",
          id: this.groupOfIds.Managers[i]
        });
        idx++;
      }
      for (let i = 0; i < this.groupOfIds.Members.length; i++) {
        data.push({
          index: idx,
          username: this.groupOfUsernames.Members[i],
          role: "member",
          id: this.groupOfIds.Members[i]
        });
        idx++;
      }
      return data;
    }
  },
  mounted () {
    if (this.groupOfIds === this.$schema.kNullGroup) {
      throw new Error("Group Id not found!");
    }
    this.isMounted = true;
    this.title = this.groupOfIds.Title;
    this.description = this.groupOfIds.Description;
    this.thumbnailUrl = this.groupOfIds.ThumbnailUrl;
  },
  methods: {
    disableButton (row) {
      return row.role === "owner" && row.id === this.authUser.Id;
    },
    doDelete (id, role) {
      if (role === "owner") {
        this.$api.removeOwnerId(id, this.$route.params.id);
      } else if (role === "manager") {
        this.$api.removeManagerId(id, this.$route.params.id);
      } else {
        this.$api.removeMemberId(id, this.$route.params.id);
      }
      this.$router.go();
    },
    async doAdd () {
      const success = await this.$refs.add_form.validate();
      if (!success) { return; }
      const result = await this.$api.searchUser(this.emailOrUsername);
      if (result === this.$schema.kNullUser) {
        this.$buefy.toast.open({
          message: this.$t("account.notfound"),
          type: "is-warning"
        });
        return;
      }
      if (this.addRole === "owner") {
        await this.$api.addOwnerId(result.Id, this.$route.params.id);
      } else if (this.addRole === "manager") {
        await this.$api.addManagerId(result.Id, this.$route.params.id);
      } else {
        await this.$api.addMemberId(result.Id, this.$route.params.id);
      }
      this.$router.go();
    },
    async doSaveGroup () {
      await this.$api.updateGroupMetadata({
        Title: this.title,
        Description: this.description,
        ThumbnailUrl: this.thumbnailUrl || ""
      }, this.$route.params.id);
      this.$router.go();
    }
  }
};
</script>
