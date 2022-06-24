ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER root

### Bitfusion ###
RUN wget 'https://packages.vmware.com/bitfusion/ubuntu/20.04/bitfusion-client-ubuntu2004_3.5.0-5_amd64.deb' \
    -O /tmp/bitfusion-client.deb && \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    apt-utils \
    /tmp/bitfusion-client.deb \
    && \
    rm /tmp/bitfusion-client.deb && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    usermod -aG bitfusion "${NB_USER}" && \
    chmod -R o+rX /etc/bitfusion

COPY bf/ /tmp/bf/
RUN chown root:bitfusion /tmp/bf/ca.crt && \
    mv $_ /etc/bitfusion/tls/ca.crt && \
    chmod 664 $_ && \
    mkdir ${HOME}/.bitfusion && \
    chown ${NB_USER}:${NB_GID} $_ && \
    chown ${NB_USER}:${NB_GID} /tmp/bf/client.yaml && \
    mv $_ ${HOME}/.bitfusion/client.yaml && \
    chmod 600 $_ && \
    chown ${NB_USER}:${NB_GID} /tmp/bf/servers.conf && \
    mv $_ ${HOME}/.bitfusion/servers.conf && \
    chmod 600 $_ && \
    mkdir /etc/bitfusion/lic && \
    chown root:bitfusion $_ && \
    chmod 775 $_ && \
    rm -rf /tmp/bf

USER ${NB_USER}

COPY --chown=${NB_UID}:${NB_GID} bin/ /usr/local/bin/

RUN chmod a+x /usr/local/bin/bf*start*.sh
