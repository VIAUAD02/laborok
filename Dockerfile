FROM squidfunk/mkdocs-material:8.2.1

RUN pip install --no-cache-dir \
  mkdocs-git-revision-date-localized-plugin 

RUN git config --global --add safe.directory /github/workspace

ENTRYPOINT ["mkdocs"]
