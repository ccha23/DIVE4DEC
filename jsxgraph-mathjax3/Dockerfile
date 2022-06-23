ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

# mathjax 3
COPY --chown=${NB_UID}:${NB_GID} jupyterlab-mathjax3-global/ /tmp/jupyterlab-mathjax3-global/

RUN cd /tmp/jupyterlab-mathjax3-global && \
    pip install --quiet --no-cache-dir . && \
    fix-permissions "${CONDA_DIR}" && \
    rm -rf /tmp/jupyterlab-mathjax3-global

# JSXGraph
COPY --chown=${NB_UID}:${NB_GID} jsxgraph-magic/ /tmp/jsxgraph-magic/

RUN cd /tmp/jsxgraph-magic && \
    pip install --quiet --no-cache-dir . && \
    fix-permissions "${CONDA_DIR}" && \
    rm -rf /tmp/jsxgraph-magic
