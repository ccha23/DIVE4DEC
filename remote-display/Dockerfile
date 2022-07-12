ARG BASE_CONTAINER=jupyter/scipy-notebook

FROM ${BASE_CONTAINER}

USER root

## Xpra ###
RUN apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    gnupg \
    && \
    wget -O - https://xpra.org/gpg.asc | (OUT=$(apt-key add - 2>&1) || echo $OUT) && \
    echo "deb https://xpra.org/ focal main" > /etc/apt/sources.list.d/xpra.list && \
    apt-get update --yes && \
    apt-get install --yes --no-install-recommends \
    xpra=4.3.2-r0-1 \
    xpra-html5=4.5.2-r1107-1 \
    dbus-x11 \
    x11-utils \
    xfonts-base \
    xvfb \
    xserver-xorg-video-dummy \
    pipenv \
    python3-websockify python3-dbus python3-paramiko python3-pyinotify python3-netifaces \
    elementary-xfce-icon-theme && \
    apt-get remove -y -q light-locker libllvm11 && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    # fix https://stackoverflow.com/questions/64770659/fvwm-menu-desktop-hanging-during-menu-creation-and-failing-with-python-exception
    # python3-xdg in focal which uses 0.26 instead 
    /usr/bin/pip3 install --quiet --no-cache-dir \
    'pyxdg==0.28'

# fix https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=908156
RUN mkdir -p /run/xpra && \
    mkdir -p /run/user/${NB_UID}/xpra && \
    # fix permission for NB_USER to start xpra and create sockets under /run
    chmod -R 700 /run/user && \
    chmod -R 775 /run/xpra && \
    chown -R ${NB_USER}:${NB_GID} /run && \
    rm -rf /usr/share/xpra/www/default-settings.txt && \
    echo "" >> $_

# Fix missing icons from xpra menu
# xpra seamless mode uses hicolor, which does not have the icons for xfce.
# The following hack works only for apps installed before it.
RUN mv /usr/share/icons/hicolor /usr/share/icons/hicolor-orig && \
    find /usr/share/icons -name 'index.theme' -print0 | xargs -I{} -0 perl -pi -e 's{(Inherits=.*)hicolor(?:-orig)*}{$1hicolor-orig}g' "{}" && \
    find /usr/share/icons -name 'index.theme' -print0 | xargs -I{} -0 sh -c 'update-icon-caches $(dirname "{}")' && \
    ln -s /usr/share/icons/elementary-xfce /usr/share/icons/hicolor

USER ${NB_UID}

### Xpra
RUN mamba install --quiet --yes \
    'websockify=0.10.*' \
    && \
    pip install --quiet --no-cache-dir \
    'jupyter-xprahtml5-proxy' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}"

# fix http://xpra.org/trac/ticket/2174?cversion=2&cnum_hist=4
ENV XDG_MENU_PREFIX='xfce-'

# customize xpra https://xpra.org/manual.html
COPY --chown=${NB_USER}:${NB_GID} remote-display/jupyter_xprahtml5_proxy_init.py /tmp/

RUN mv /tmp/jupyter_xprahtml5_proxy_init.py "$(pip show jupyter-xprahtml5-proxy | grep Location | awk '{print $2}')/jupyter_xprahtml5_proxy/__init__.py"