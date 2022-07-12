ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER root

RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    # java
    default-jdk \
    python3-dev \
    && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

### Weka and python-weka-wrapper ###
RUN wget -q -O /tmp/weka.deb 'https://www.cs.waikato.ac.nz/~ml/weka/snapshots/stable-3-8.deb' && \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    /tmp/weka.deb \
    imagemagick && \
    rm /tmp/weka.deb && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    echo 'alias weka="/usr/bin/weka-stable-gui"' >> /etc/bash.bashrc

COPY datamining/waikato-weka.desktop /tmp/waikato-weka.desktop
RUN xdg-desktop-menu install /tmp/waikato-weka.desktop && \
    wget -q https://raw.githubusercontent.com/Waikato/weka-3.8/master/weka/src/main/java/weka/gui/weka_icon_new.png \
    -O /tmp/waikato-weka.png && \
    for i in 16 22 24 32 36 48 64 72 96 128 192 256; do \
    { convert /tmp/waikato-weka.png -thumbnail ${i}x${i}  /tmp/waikato-weka-${i}.png; \
      xdg-icon-resource install --size ${i} --theme hicolor $_ waikato-weka; } done && \
    rm /tmp/waikato-weka*

# RStudio
RUN apt-get update --yes && \
    wget -q https://download1.rstudio.org/desktop/bionic/amd64/rstudio-2022.02.0-443-amd64.deb -O /tmp/rstudio.deb && \
    apt-get install --yes --no-install-recommends \
    'r-base' \
    /tmp/rstudio.deb && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    rm /tmp/rstudio.deb

RUN R -e "install.packages('IRkernel', dependencies=TRUE, repos='http://cran.rstudio.com/')" && \
    R -e "install.packages('ClusterR', dependencies=TRUE, repos='http://cran.rstudio.com/')" && \
    R -e "install.packages('cluster', dependencies=TRUE, repos='http://cran.rstudio.com/')" && \
    R -e "install.packages('dbscan', dependencies=TRUE, repos='http://cran.rstudio.com/')"


USER ${NB_USER}

# ML packages
RUN mamba install --quiet --yes \
    'biopython=1.*' \
    && \
    pip install --quiet --no-cache-dir \
    'python-javabridge==4.0.*' \
    'python-weka-wrapper3==0.2.*' \
    'pygraphviz==1.9' \
    'dit==1.2.*' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

### Tensorflow ###
# minor issues: 
# https://stackoverflow.com/questions/44232898/memoryerror-in-tensorflow-and-successful-numa-node-read-from-sysfs-had-negativ
# tested with:
# https://docs.vmware.com/en/VMware-vSphere-Bitfusion/4.0/Example-Guide/GUID-8F6BF9A8-DC1A-4ACD-A2FF-C9CD0B50A9DC.html
RUN pip install --quiet --no-cache-dir \
    'tensorflowjs==3.14.*' \
    # tensorflowjs must be installed first or it downgrades tensorflow to 2.6
    'tensorflow-gpu==2.8.*' \
    'tensorflow-datasets==4.4.*' \
    'tensorflow-addons==0.16.*' \
    'tensorboard==2.8.*' \
    && \
    fix-permissions "${CONDA_DIR}"

### PyTorch
RUN conda install --quiet --yes \
    'pytorch=1.11' \
    'torchvision=0.12' \
    'torchaudio=0.11' \
    'cudatoolkit=10.2' \
    -c pytorch \
    && \
    conda clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

# R
RUN R -e "IRkernel::installspec(sys_prefix = TRUE)"