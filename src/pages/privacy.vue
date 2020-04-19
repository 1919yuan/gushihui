<template>
  <div class="content" v-html="html" />
</template>

<script>
const md = require("markdown-it")();
export default {
  layout: "article",
  async asyncData ({ app }) {
    const blogs = await app.$api.searchBlog("icra", "", "privacy", new Date(0), new Date(0), true);
    if (blogs.length > 0) {
      const html = md.render(blogs[0].Content);
      return { html };
    } else {
      return { html: "" };
    }
  }
};
</script>
