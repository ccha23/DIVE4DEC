ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER ${NB_UID}

WORKDIR "${HOME}"

COPY --chown=${NB_UID}:${NB_GID} ./ ./

RUN mamba install --quiet --yes \
    jupyter-packaging \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}" 

RUN cd ./ && \
    pip install --quiet --no-cache-dir -e . && \
    jupyter labextension develop . --overwrite && \
    fix-permissions "${CONDA_DIR}"

CMD ["start-notebook.sh", "--LabApp.collaborative=True"]