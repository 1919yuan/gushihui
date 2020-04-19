<template>
  <div class="columns is-mobile is-multiline">
    <BlogCard v-for="(blog, idx) in blogs" :key="'b'+idx" :blog="blog" />
  </div>
</template>

<script>
import BlogCard from "~/components/card/Blog.vue";
export default {
  components: {
    BlogCard
  },
  layout: "article",
  async asyncData ({ app, params }) {
    try {
      const blogs = await app.$api.searchBlog("icra", "", "", new Date(0), new Date(0), false);
      return { blogs };
    } catch {
      return { blogs: [] };
    }
  }
};
</script>
