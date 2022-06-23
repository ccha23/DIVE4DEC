ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER root

### code-server ###
RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    curl \
    && \
    wget -q https://code-server.dev/install.sh -O /tmp/install.sh && \
    sh /tmp/install.sh --version 4.4.0 && \
    rm -rf ~/.cache/code-server/ && \
    rm -rf /tmp/install.sh && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV TZ=Hongkong
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# fix https://github.com/jupyter/docker-stacks/issues/815
RUN cat /etc/skel/.bashrc >> /etc/bash.bashrc

USER ${NB_UID}

### Code server
RUN mamba install --quiet --yes \
    'jupyter-vscode-proxy=0.1.*' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

# JupyterLab interface
RUN mamba install --quiet --yes \
    'black=22.*' \
    'ipydrawio=1.2.*' \
    'ipydrawio-export=1.2.*' \
    'jupyter-packaging=0.11.*' \
    'jupyter-offlinenotebook=0.2.*' \
    'jupyterlab_code_formatter=1.4.*' \
    'jupyterlab-lsp=3.10.*' \
    'jupyterlab-system-monitor=0.8.*' \
    'jupyterlab-spellchecker=0.7.*' \
    'jupyterlab-git=0.37.*' \
    'jupytext=1.13.*' \
    'nbgitpuller=1.0.*' \
    'python-lsp-server=1.4.*' \
    # 'graphviz=2.50.*' \
    'retrolab=0.3.*' \
    # 'xeus-python=0.13.*' \
    # 'xeus-cling=0.13.*' \
    # 'xeus-sql=0.1.*' \
    # 'xwidgets=0.26.*' \
    && \
    pip install --quiet --no-cache-dir \
    'jupyterlab_sublime==0.4.*' \
    # && \
    # jlpm add --dev \
    # bash-language-server \
    # vscode-css-languageserver-bin \
    # dockerfile-language-server-nodejs \
    # vscode-html-languageserver-bin \
    # javascript-typescript-langserver \
    # vscode-json-languageserver-bin \
    # yaml-language-server \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}" 
    # && \
    # # kludge https://github.com/jupyterhub/nbgitpuller/issues/235
    # package_path=$(pip show nbgitpuller | grep Location | awk '{print $2}') && \
    # cp "${package_path}/nbgitpuller/templates/status.html" "${package_path}/notebook/templates/status.html"

# Jupyter-book
RUN mamba install --quiet --yes \
    'jupyter-book=0.12.*' \
    'myst-nb==0.13.*' \
    && \
    pip install --quiet --no-cache-dir \
    'sphinx-proof==0.1.*' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

# markdown-it
RUN mamba install --quiet --yes \
    'yarn=1.22.*' && \
    fix-permissions "${CONDA_DIR}" && \
    mamba clean --all -f -y

COPY --chown=${NB_UID}:${NB_GID} jupyterlab-markdownit/ /tmp/jupyterlab-markdownit/

RUN cd /tmp/jupyterlab-markdownit && \
    # fix https://github.com/yarnpkg/yarn/issues/6081
    rm -rf .git && \
    pip install --quiet --no-cache-dir . && \
    fix-permissions "${CONDA_DIR}" && \
    mamba clean --all -f -y && \
    rm -rf /tmp/jupyterlab-markdownit

COPY --chown=${NB_USER}:${NB_GID} jupyter-interface/condarc "${CONDA_DIR}/.condarc"

USER ${NB_USER}

WORKDIR "${HOME}"

CMD ["start-notebook.sh", "--LabApp.collaborative=True"]