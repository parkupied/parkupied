- Standardize commit message style: https://seesparkbox.com/foundry/semantic_commit_messages
- Remove unnecessary files from repo (e.g. `.DS_Store`)

First change your .gitignore (e.g to make sure it includes `.DS_Store`), then...

```
git rm -rf --cached .
git add -A
git commit -m "chore: remove unnecesary / ignored files"
```

- Nice README, format with `#` or `##` for headers; later: add screenshots


- Consistent casing (e.g. `mainPage` vs `Welcome`)
- Inconistent indentation
- Communication!
- Look into firestore event listeners, maybe `.on('value', ...)` to constantly update components in real time; if so, make sure to also STOP listening
- Look up firestore / firebase database rules for access control
