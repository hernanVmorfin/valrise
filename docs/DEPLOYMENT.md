# Deployment and rollback

## Staging

1. Create a database backup and a recoverable copy of `wp-content`.
2. Install and activate the archives:

   ```bash
   wp theme install valrise.zip --activate
   wp plugin install valrise-core.zip --activate
   wp valrise seed
   ```

3. In **Settings → Reading**, enable the staging search-engine visibility option (noindex) and protect the environment at the hosting layer when possible.
4. Configure the real recipient email under **Settings → VALRISE** and the hosting mail transport.
5. Test navigation, page editing, an article, consultation validation, speaking-field disclosure, failed delivery, successful delivery, keyboard navigation, responsive layouts, and the 404 page.

## Production

Build outside production with `npm run verify`. Upload only `valrise.zip` and `valrise-core.zip`; Node, Vite, and Tailwind are not production requirements. Install during a defined maintenance window, make a fresh backup first, and clear only the host/CDN caches associated with this site.

Before opening indexing, confirm the canonical domain and HTTPS behavior, then disable staging noindex under **Settings → Reading**. Recheck the XML sitemap exposed by WordPress core and inspect canonical, Open Graph, and JSON-LD output on Home, Consulting, Speaking, an article, and Contact.

## Rollback

Keep the previous theme/plugin archives and database backup until acceptance is complete. To rollback, reactivate the prior theme and plugin versions, restore the prior archives, and restore the database only if content or settings changes also need reversal. The VALRISE seed command never deletes unrelated content, but a database restore remains the safest full rollback.
