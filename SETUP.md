# Publishing your new GitHub profile + portfolio

This folder becomes the contents of your existing profile repo,
**github.com/bhargavang/bhargavang**. It replaces the old data-analyst README.

## 1. Copy it into your profile repo and push

Run these in Terminal, one at a time:

```bash
cd ~/Desktop/Claude
git clone https://github.com/bhargavang/bhargavang.git profile-repo
cp -R github-profile/. profile-repo/
cd profile-repo
git add -A
git commit -m "New software developer profile README and portfolio site"
git push
```

## 2. Turn on GitHub Pages (one time)

1. Open **github.com/bhargavang/bhargavang → Settings → Pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. Go to the **Actions** tab, pick **Deploy portfolio to GitHub Pages**, click **Run workflow**

Your site goes live at **https://bhargavang.github.io/bhargavang/**.

## 3. Refresh the commit snake (one time)

In the **Actions** tab, pick **Generate Snake Animation** and click **Run workflow**.
This creates the new gold snake. After that it updates by itself every 12 hours.

## Updating later

- **Profile README:** edit `CONFIG` at the top of `scripts/build.mjs`
  (for example, add a project's live demo or repo link), then run:

  ```bash
  node scripts/build.mjs
  ```

  Commit and push the changed `README.md` and `assets/` files.
- **Portfolio site:** edit `~/Desktop/Claude/portfolio/index.html`, run the same build
  command (it copies the page into `site/`), then commit and push. The Pages workflow
  redeploys automatically.
- **Local preview:** open `preview.html` in a browser to see roughly how the README
  looks on GitHub before you push. It isn't committed.
