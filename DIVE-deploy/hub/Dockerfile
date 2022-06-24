FROM ideonate/cdsdashboards-jupyter-k8s-hub:1.2.0-sha-d6e58b3

USER root

RUN apt-get update && \
    apt-get upgrade --yes && \
    apt-get install --yes --no-install-recommends \
    libnss-ldap \
    libpam-ldap \
    ldap-utils \
    sudo \
    && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY etc/ldap.conf /etc/ldap.conf
COPY etc/nsswitch.conf /etc/nsswitch.conf
COPY etc/pam.d /etc/pam.d

COPY login.html /usr/local/share/jupyterhub/templates/login.html

RUN pip install --quiet --no-cache-dir "notebook==6.4.*"

RUN pip install --quiet --no-cache-dir git+https://github.com/jupyter/nbgrader.git@cdcba95ee334e667b4438532dd27093b3c4df099 && \
    jupyter nbextension install --system --py --overwrite nbgrader && \
    jupyter nbextension enable --system --py nbgrader && \
    jupyter serverextension enable --system --py nbgrader && \
    jupyter nbextension disable --system assignment_list/main --section=tree && \
    jupyter serverextension disable --system nbgrader.server_extensions.assignment_list && \
    jupyter nbextension disable --system course_list/main --section=tree && \
    jupyter serverextension disable --system nbgrader.server_extensions.course_list

RUN pip install --quiet --no-cache-dir ngshare_exchange && \
    pip install --quiet --no-cache-dir --force-reinstall 'traitlets==5.1.*'

USER jovyan

COPY etc/nbgrader_config.py /home/jovyan/.jupyter/nbgrader_config.py
