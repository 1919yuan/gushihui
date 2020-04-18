<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <a href="https://github.com/1919yuan/gushihui/issues">{{
          $t('footer.feedback') }}</a>
        |
        <a href="https://github.com/1919yuan/gushihui">{{ $t('footer.code') }}</a>
        |
        <nuxt-link :to="{ path: '/terms' }">
          {{ $t('footer.terms')
          }}
        </nuxt-link>
        |
        <nuxt-link :to="{ path: '/privacy' }">
          {{ $t('footer.privacy')
          }}
        </nuxt-link>
      </p>
    </div>
  </footer>
</template>
