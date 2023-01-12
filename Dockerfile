FROM squidfunk/mkdocs-material:9.0.4

# required for mkdocs-git-committers-plugin-2
RUN apk add --no-cache --virtual .build-deps gcc libc-dev libxslt-dev && \
    apk add --no-cache libxslt && \
    pip install --no-cache-dir lxml>=3.5.0 && \
    apk del .build-deps

RUN pip install --no-cache-dir \
  mkdocs-git-revision-date-localized-plugin \
  mkdocs-git-committers-plugin-2

RUN git config --global --add safe.directory /github/workspace

EXPOSE 8000

ENTRYPOINT ["mkdocs"]

CMD ["serve", "--dev-addr=0.0.0.0:8000"]
