ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER root

### Math
RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    emacs \
    ghostscript \
    fonts-freefont-otf \
    octave \
    && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Maxima
# fix personality failure
RUN echo 'deb http://ppa.launchpad.net/maxima-developers/maxima-nightly/ubuntu focal main' > /etc/apt/sources.list.d/maxima-developers-ubuntu-maxima-nightly-focal.list && \
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 269CC6D68C369059 && \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    maxima-sbcl=5.44.0-31~202106092339~ubuntu20.04.1 wxmaxima=21.01.0-27~202104030352~ubuntu20.04.1 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    libzmq3-dev sbcl cl-quicklisp && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --chown=${NB_UID}:${NB_GID} math/sbclrc /etc/sbclrc

USER ${NB_USER}

# Octave
RUN mamba install --quiet --yes \
    'gnuplot=5.4.*' && \
    pip install --quiet --no-cache-dir 'octave_kernel==0.34.*' && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

# Maxima
RUN sbcl --non-interactive --load "/usr/share/common-lisp/source/quicklisp/quicklisp.lisp" \
    --eval "(quicklisp-quickstart:install :path \"/tmp/quicklisp\")" && \
    git clone https://github.com/robert-dodier/maxima-jupyter.git && \
    cd maxima-jupyter && \
    perl -pi -e 's/"\\\\tag{\$~A\$}"/""/g' src/overrides.lisp && \
    maxima --batch-string="load(\"load-maxima-jupyter.lisp\");jupyter_install();" && \
    cd .. && \
    rm -rf maxima-jupyter && \
    mv ${HOME}/.local/share/jupyter/kernels/maxima ${CONDA_DIR}/share/jupyter/kernels/ && \
    mv ${HOME}/.local/share/maxima-jupyter ${CONDA_DIR}/share/ && \
    fix-permissions "${CONDA_DIR}" && \
    fix-permissions /tmp/quicklisp

# Sagemath
# Specify prefix (-p) to override condarc, which sets the default env path to jovyan's home
RUN mamba create --quiet --yes \
    -p "${CONDA_DIR}/envs/sage" \
    'python=3.8.*' \
    'sage=9.*' \
    && \
    rm "${CONDA_DIR}/envs/sage/share/jupyter/kernels/sagemath/doc" && \
    jupyter kernelspec install "${CONDA_DIR}/envs/sage/share/jupyter/kernels/sagemath" --sys-prefix && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"
