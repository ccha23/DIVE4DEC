ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER ${NB_USER}

COPY --chown=${NB_UID}:${NB_GID} jupyter_contrib_nbextensions/ /tmp/jupyter_contrib_nbextensions/

RUN cd /tmp/jupyter_contrib_nbextensions && \
    pip install --quiet --no-cache-dir . && \
    bash -c 'for package in jupyter-latex-envs; do \
        location=$(pip show ${package} | grep "Location:" | cut -d ":" -f2 | xargs); \
        for i in $(pip show -f ${package}); do \
            if [ "${i: -3}" = ".py" ]; then \
                sed -i "s/template_path/template_paths/g" "${location}/${i}"; \
            fi; \
        done; \
    done' && \    
    fix-permissions "${CONDA_DIR}" && \
    rm -rf /tmp/jupyter_contrib_nbextensions

RUN mamba install --quiet --yes \
    'rise=5.7.*' \
    && \
    # issue: https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/1529
    # bash -c 'location=$(pip show jupyter_contrib_nbextensions | grep "Location:" | cut -d ":" -f2 | xargs); \
    #     ln -s "${location}/jupyter_contrib_nbextensions/nbextensions/"* "${CONDA_DIR}/share/jupyter/nbextensions"' && \
    # bash -c 'location=$(pip show jupyter_nbextensions_configurator | grep "Location:" | cut -d ":" -f2 | xargs); \
    #     ln -s "${location}/jupyter_nbextensions_configurator/static/"* "${CONDA_DIR}/share/jupyter/nbextensions"' && \
    jupyter nbextension install --py jupyter_contrib_nbextensions --sys-prefix && \
    # jupyter nbextension install --py jupyter_nbextensions_configurator --sys-prefix && \
    jupyter nbextension install --py latex_envs --sys-prefix && \
    jupyter nbextension enable init_cell/main --sys-prefix && \
    jupyter nbextension enable scratchpad/main --sys-prefix && \
    jupyter nbextension enable spellchecker/main --sys-prefix && \
    jupyter nbextension enable codefolding/main --sys-prefix && \
    jupyter nbextension enable --section edit codefolding/edit --sys-prefix && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"