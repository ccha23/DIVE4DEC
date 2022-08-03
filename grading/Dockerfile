ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

# nbgrader
COPY --chown=${NB_UID}:${NB_GID} nbgrader/ /tmp/nbgrader/

RUN cd /tmp/nbgrader && \
    pip install --quiet --no-cache-dir \
    . && \
    fix-permissions "${CONDA_DIR}" && \
    rm -rf /tmp/nbgrader

COPY --chown=${NB_UID}:${NB_GID} ngshare_exchange/ /tmp/ngshare_exchange/

RUN cd /tmp/ngshare_exchange && \
    pip install --quiet --no-cache-dir \
    . && \
    fix-permissions "${CONDA_DIR}" && \
    rm -rf /tmp/ngshare_exchange

RUN jupyter nbextension install --symlink --sys-prefix --py nbgrader && \
    jupyter nbextension enable --sys-prefix --py nbgrader && \
    jupyter serverextension enable --sys-prefix --py nbgrader  && \
    jupyter nbextension disable --sys-prefix formgrader/main --section=tree && \
    jupyter nbextension disable --sys-prefix course_list/main --section=tree && \
    jupyter serverextension disable --sys-prefix nbgrader.server_extensions.course_list && \
    fix-permissions "${CONDA_DIR}"

# COPY --chown=${NB_USER}:${NB_GID} nb/ /tmp/nb/
# RUN cp -rf /tmp/nb/nbgrader_config /etc/jupyter/nbgrader_config.py && \
#     cp -rf /tmp/nb/assignment_list.js "$(pip show nbgrader | grep Location | awk '{print $2}')/nbgrader/nbextensions/assignment_list/assignment_list.js" && \
#     cp -rf /tmp/nb/fetch_feedback.py "$(pip show ngshare_exchange | grep Location | awk '{print $2}')/ngshare_exchange/fetch_feedback.py" && \
#     cp -rf /tmp/nb/validator.py "$(pip show nbgrader | grep Location | awk '{print $2}')/nbgrader/validator.py" && \
#     cp -rf /tmp/nb/list.py "$(pip show nbgrader | grep Location | awk '{print $2}')/nbgrader/list.py" && \
#     rm -rf /tmp/nb


# # To be backward compatible
# RUN mamba install --quiet --yes \
#     'nbclient=0.5.9' \
#     'jupyterhub=1.5.0' \
#     && \
#     pip install --quiet --no-cache-dir --upgrade --no-deps --force-reinstall \
#     'traitlets==5.1.*' && \
#     mamba clean --all -f -y && \
#     fix-permissions "${CONDA_DIR}" && \
#     fix-permissions "/home/${NB_USER}"