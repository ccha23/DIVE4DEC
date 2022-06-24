ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER root

RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    build-essential \
    # java
    default-jdk \
    python3-dev \
    emacs \
    # pascal
    fp-compiler \
    # C, C++
    # gcc \
    gconf2 \
    # graphviz \
    # graphviz-dev \
    # libcairo2-dev \
    # libffi-dev \
    # libpango1.0-dev \
    # pkg-config \
    # pdf2svg \
    # SQL
    sqlite3 \
    thonny \
    && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

USER ${NB_USER}

# Javascript and Typescript
RUN npm install -g tslab && \
    tslab install \
    && \
    fix-permissions "${CONDA_DIR}"   

RUN mamba install --quiet --yes \
    'graphviz=2.50.*' \
    'xeus-python=0.13.*' \
    # C, C++
    'xeus-cling=0.13.*' \
    # SQL
    'xeus-sql=0.1.*' \
    'xwidgets=0.26.*' \
    # 'tectonic=0.9.*' \
    # 'texlab=4.1.*' \
    # 'chktex=1.7.*' \
    && \
    pip install --quiet --no-cache-dir \
    'jupyterlab_sublime==0.4.*' \
    # 'itikz==0.1.*' \
    && \
    cd /tmp && \
    jlpm add --dev \
    bash-language-server \
    vscode-css-languageserver-bin \
    dockerfile-language-server-nodejs \
    vscode-html-languageserver-bin \
    javascript-typescript-langserver \
    vscode-json-languageserver-bin \
    yaml-language-server \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}" 

# Java kernel
RUN wget 'https://github.com/SpencerPark/IJava/releases/download/v1.3.0/ijava-1.3.0.zip' \
    -O /tmp/ijava.zip && \
    unzip /tmp/ijava.zip -d /tmp/ijava && \
    python3 /tmp/ijava/install.py --sys-prefix && \
    rm -rf /tmp/ijava

# Online Python Tutor
COPY --chown=${NB_UID}:${NB_GID} mytutor/ /tmp/mytutor/

RUN cd /tmp/mytutor && \
    pip install --quiet --no-cache-dir . && \
    fix-permissions "${CONDA_DIR}" && \
    rm -rf /tmp/mytutor

