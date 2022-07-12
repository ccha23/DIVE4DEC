ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER root

### Desktop ###
RUN wget -q "https://sourceforge.net/projects/turbovnc/files/3.0/turbovnc_3.0_amd64.deb/download" \
    -O /tmp/turbovnc_3.0_amd64.deb && \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    /tmp/turbovnc_3.0_amd64.deb \
    gnupg \
    xorg \
    xfce4 \
    xfce4-panel \
    xfce4-session \
    xfce4-settings \
    xfce4-terminal \
    && \
    apt-get remove -y -q light-locker libllvm11 && \
    rm /tmp/turbovnc_3.0_amd64.deb && \
    ln -s /opt/TurboVNC/bin/* /usr/local/bin/ && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

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

### Code server and Remote Desktop
RUN mamba install --quiet --yes \
    'jupyter-vscode-proxy=0.1.*' \
    && \
    pip install --quiet --no-cache-dir \
    'jupyter-desktop-server==0.1.*' \
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

# mathjax 3
COPY --chown=${NB_UID}:${NB_GID} jupyter-renderers/ /tmp/jupyter-renderers/

RUN cd /tmp/jupyter-renderers/packages/mathjax3-extension && \
    pip install --quiet --no-cache-dir . && \
    fix-permissions "${CONDA_DIR}" && \
    rm -rf /tmp/jupyter-renderers

# JSXGraph
COPY --chown=${NB_UID}:${NB_GID} jsxgraph-magic/ /tmp/jsxgraph-magic/

RUN cd /tmp/jsxgraph-magic && \
    pip install --quiet --no-cache-dir . && \
    fix-permissions "${CONDA_DIR}" && \
    rm -rf /tmp/jsxgraph-magic

# markdown-it
# RUN mamba install --quiet --yes \
#     'yarn=1.22.*' && \
#     fix-permissions "${CONDA_DIR}" && \
#     mamba clean --all -f -y

COPY --chown=${NB_UID}:${NB_GID} jupyterlab-markdownit/ /tmp/jupyterlab-markdownit/

RUN cd /tmp/jupyterlab-markdownit && \
    # fix https://github.com/yarnpkg/yarn/issues/6081
    rm -rf .git && \
    pip install --quiet --no-cache-dir . && \
    fix-permissions "${CONDA_DIR}" && \
    mamba clean --all -f -y && \
    rm -rf /tmp/jupyterlab-markdownit

# JSXGraph
COPY --chown=${NB_UID}:${NB_GID} jsxgraph-magic/ /tmp/jsxgraph-magic/

RUN cd /tmp/jsxgraph-magic && \
    pip install --quiet --no-cache-dir . && \
    fix-permissions "${CONDA_DIR}" && \
    rm -rf /tmp/jsxgraph-magic

# Diagrams
COPY --chown=${NB_UID}:${NB_GID} dimagic/ /tmp/dimagic/

RUN npm install --silent -g diagrams && \
    cd /tmp/dimagic && \
    pip install --quiet --no-cache-dir . && \
    fix-permissions "${CONDA_DIR}" && \
    rm -rf /tmp/dimagic

# Jupyter www proxy
COPY --chown=${NB_UID}:${NB_GID} jupyter-www-proxy/ /tmp/jupyter-www-proxy/

RUN cd /tmp/jupyter-www-proxy && \
    pip install --quiet --no-cache-dir . && \
    fix-permissions "${CONDA_DIR}" && \
    rm -rf /tmp/jupyter-www-proxy

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

# Remote desktop customization
COPY --chown=${NB_USER}:${NB_GID} jupyter-interface/jupyter_desktop_init.py /tmp/
RUN mv /tmp/jupyter_desktop_init.py "$(pip show jupyter-desktop-server | grep Location | awk '{print $2}')/jupyter_desktop/__init__.py"

WORKDIR "${HOME}"

CMD ["start-notebook.sh", "--LabApp.collaborative=True"]