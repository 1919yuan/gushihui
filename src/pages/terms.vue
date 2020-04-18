<template>
  <div class="content" v-html="blog.Content" />
</template>

<script>
import { kNullBlog } from "~/schema";
export default {
  layout: "article",
  async asyncData ({ app }) {
    const blogs = await app.$api.searchBlog("icra", "", "terms", new Date(0), new Date(0));
    if (blogs.length > 0) {
      return { blog: blogs[0] };
    } else {
      return { blog: kNullBlog };
    }
  }
};
</script>
