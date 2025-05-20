You need to create a `cypress/fixtures/large-file.pdf` file to test the large file upload.

You can generate a large file with the following command:

```bash
dd if=/dev/urandom of=large-file.pdf bs=1M count=120
```

