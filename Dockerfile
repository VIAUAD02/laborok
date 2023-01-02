FROM squidfunk/mkdocs-material:8.2.1

# required for mkdocs-git-committers-plugin-2
RUN apk add --no-cache --virtual .build-deps gcc libc-dev libxslt-dev && \
    apk add --no-cache libxslt && \
    pip install --no-cache-dir lxml>=3.5.0 && \
    apk del .build-deps

RUN pip install --no-cache-dir \
  mkdocs-git-revision-date-localized-plugin \
  mkdocs-git-committers-plugin-2

RUN git config --global --add safe.directory /github/workspace

ENTRYPOINT ["mkdocs"]
